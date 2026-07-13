import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { productsTable } from "./products";

export const cartItemsTable = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    cartId: text("cart_id").notNull(),
    productId: integer("product_id")
      .notNull()
      .references(() => productsTable.id),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.cartId, table.productId)],
);

export const insertCartItemSchema = createInsertSchema(cartItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItemRow = typeof cartItemsTable.$inferSelect;
