import { createHmac, timingSafeEqual } from "node:crypto";
import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { desc, eq, inArray } from "drizzle-orm";
import {
  db,
  orderItemsTable,
  ordersTable,
  productsTable,
} from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminListOrdersResponse,
  AdminUpdateOrderStatusParams,
  AdminUpdateOrderStatusBody,
  AdminUpdateOrderStatusResponse,
  AdminCreateProductBody,
  AdminCreateProductResponse,
  AdminUpdateProductParams,
  AdminUpdateProductBody,
  AdminUpdateProductResponse,
  AdminDeleteProductParams,
} from "@workspace/api-zod";
import { loadOrderForResponse } from "../lib/orders";

const router: IRouter = Router();

// Stateless session token derived from the password: survives server
// restarts (Render free tier sleeps) without storing sessions anywhere,
// and never exposes the password itself to the browser.
function sessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password)
    .update("perfume-baltic-admin-session")
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const expected = sessionToken();
  if (!expected) {
    res.status(503).json({ error: "Admin panel is not configured (ADMIN_PASSWORD unset)" });
    return;
  }
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !safeEqual(token, expected)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", (req, res): void => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    res.status(503).json({ error: "Admin panel is not configured (ADMIN_PASSWORD unset)" });
    return;
  }

  if (!safeEqual(parsed.data.password, password)) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }

  res.json(AdminLoginResponse.parse({ token: sessionToken() }));
});

router.get("/admin/orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt));

  const orderIds = orders.map((order) => order.id);
  const items = orderIds.length
    ? await db
        .select({
          id: orderItemsTable.id,
          orderId: orderItemsTable.orderId,
          quantity: orderItemsTable.quantity,
          priceCentsAtPurchase: orderItemsTable.priceCentsAtPurchase,
          product: productsTable,
        })
        .from(orderItemsTable)
        .innerJoin(
          productsTable,
          eq(orderItemsTable.productId, productsTable.id),
        )
        .where(inArray(orderItemsTable.orderId, orderIds))
    : [];

  const response = orders.map(
    ({ cartId, paymentSessionId, paymentMethod, ...order }) => ({
      ...order,
      paymentMethod: paymentMethod ?? undefined,
      items: items
        .filter((item) => item.orderId === order.id)
        .map(({ orderId, ...item }) => item),
    }),
  );

  res.json(AdminListOrdersResponse.parse(response));
});

router.patch(
  "/admin/orders/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = AdminUpdateOrderStatusParams.safeParse(req.params);
    const body = AdminUpdateOrderStatusBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const [updated] = await db
      .update(ordersTable)
      .set({ status: body.data.status })
      .where(eq(ordersTable.id, params.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const order = await loadOrderForResponse(params.data.id);
    res.json(AdminUpdateOrderStatusResponse.parse(order));
  },
);

router.post(
  "/admin/products",
  requireAdmin,
  async (req, res): Promise<void> => {
    const parsed = AdminCreateProductBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [product] = await db
      .insert(productsTable)
      .values({ ...parsed.data, featured: parsed.data.featured ?? false })
      .returning();

    res.status(201).json(AdminCreateProductResponse.parse(product));
  },
);

router.patch(
  "/admin/products/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = AdminUpdateProductParams.safeParse(req.params);
    const body = AdminUpdateProductBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    if (Object.keys(body.data).length === 0) {
      res.status(400).json({ error: "Nothing to update" });
      return;
    }

    const [product] = await db
      .update(productsTable)
      .set(body.data)
      .where(eq(productsTable.id, params.data.id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(AdminUpdateProductResponse.parse(product));
  },
);

router.delete(
  "/admin/products/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = AdminDeleteProductParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    try {
      const deleted = await db
        .delete(productsTable)
        .where(eq(productsTable.id, params.data.id))
        .returning();
      if (deleted.length === 0) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
    } catch (err) {
      // 23503 = foreign key violation: the product appears in past orders
      if ((err as { code?: string })?.code === "23503") {
        res.status(409).json({
          error:
            "This product appears in past orders and cannot be deleted. Set its stock to 0 to stop selling it.",
        });
        return;
      }
      throw err;
    }

    res.status(204).end();
  },
);

export default router;
