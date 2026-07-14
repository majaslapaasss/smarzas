import { eq } from "drizzle-orm";
import { db, orderItemsTable, ordersTable, productsTable } from "@workspace/db";

/**
 * Loads an order with its items, shaped for API responses (internal fields
 * like cartId/paymentSessionId are dropped; nulls become undefined so the
 * generated zod response schemas accept them).
 */
export async function loadOrderForResponse(orderId: number) {
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

  const { cartId, paymentSessionId, shippingCountry, pickupPointId, paymentMethod, ...rest } =
    order;
  return { ...rest, paymentMethod: paymentMethod ?? undefined, items };
}
