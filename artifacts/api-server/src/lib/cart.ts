import { eq } from "drizzle-orm";
import { cartItemsTable, db, productsTable } from "@workspace/db";

export async function loadCart(cartId: string) {
  const rows = await db
    .select({
      id: cartItemsTable.id,
      quantity: cartItemsTable.quantity,
      product: productsTable,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.cartId, cartId));

  const subtotalCents = rows.reduce(
    (sum, row) => sum + row.product.priceCents * row.quantity,
    0,
  );

  return {
    cartId,
    items: rows,
    subtotalCents,
  };
}
