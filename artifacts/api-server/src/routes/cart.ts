import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { cartItemsTable, db, productsTable } from "@workspace/db";
import {
  GetCartParams,
  GetCartResponse,
  AddCartItemParams,
  AddCartItemBody,
  AddCartItemResponse,
  UpdateCartItemParams,
  UpdateCartItemBody,
  UpdateCartItemResponse,
  RemoveCartItemParams,
  RemoveCartItemResponse,
} from "@workspace/api-zod";
import { loadCart } from "../lib/cart";

const router: IRouter = Router();

router.get("/cart/:cartId", async (req, res): Promise<void> => {
  const params = GetCartParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const cart = await loadCart(params.data.cartId);
  res.json(GetCartResponse.parse(cart));
});

router.post("/cart/:cartId/items", async (req, res): Promise<void> => {
  const params = AddCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { cartId } = params.data;
  const { productId, quantity } = parsed.data;

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  if (!product) {
    res.status(400).json({ error: "Product not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.cartId, cartId),
        eq(cartItemsTable.productId, productId),
      ),
    );

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ cartId, productId, quantity });
  }

  const cart = await loadCart(cartId);
  res.json(AddCartItemResponse.parse(cart));
});

router.patch(
  "/cart/:cartId/items/:itemId",
  async (req, res): Promise<void> => {
    const params = UpdateCartItemParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = UpdateCartItemBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { cartId, itemId } = params.data;

    const [updated] = await db
      .update(cartItemsTable)
      .set({ quantity: parsed.data.quantity })
      .where(
        and(
          eq(cartItemsTable.id, itemId),
          eq(cartItemsTable.cartId, cartId),
        ),
      )
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    const cart = await loadCart(cartId);
    res.json(UpdateCartItemResponse.parse(cart));
  },
);

router.delete(
  "/cart/:cartId/items/:itemId",
  async (req, res): Promise<void> => {
    const params = RemoveCartItemParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const { cartId, itemId } = params.data;

    const [removed] = await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.id, itemId),
          eq(cartItemsTable.cartId, cartId),
        ),
      )
      .returning();

    if (!removed) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    const cart = await loadCart(cartId);
    res.json(RemoveCartItemResponse.parse(cart));
  },
);

export default router;
