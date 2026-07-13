import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  cartItemsTable,
  db,
  orderItemsTable,
  ordersTable,
  productsTable,
} from "@workspace/db";
import {
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderParams,
  GetOrderResponse,
} from "@workspace/api-zod";
import { loadCart } from "../lib/cart";

const router: IRouter = Router();

async function loadOrder(orderId: number) {
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId));

  if (!order) {
    return null;
  }

  const items = await db
    .select({
      id: orderItemsTable.id,
      quantity: orderItemsTable.quantity,
      priceCentsAtPurchase: orderItemsTable.priceCentsAtPurchase,
      product: productsTable,
    })
    .from(orderItemsTable)
    .innerJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
    .where(eq(orderItemsTable.orderId, orderId));

  return { ...order, items };
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    cartId,
    customerName,
    customerEmail,
    shippingAddress,
    city,
    postalCode,
  } = parsed.data;

  const cart = await loadCart(cartId);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      totalCents: cart.subtotalCents,
      status: "placed",
    })
    .returning();

  if (!order) {
    res.status(500).json({ error: "Failed to create order" });
    return;
  }

  await db.insert(orderItemsTable).values(
    cart.items.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      quantity: item.quantity,
      priceCentsAtPurchase: item.product.priceCents,
    })),
  );

  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));

  const fullOrder = await loadOrder(order.id);
  res.status(201).json(CreateOrderResponse.parse(fullOrder));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const order = await loadOrder(params.data.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(order));
});

export default router;
