import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { productsTable } from "./products";

// Columns are ordered for comfortable browsing in a database console:
// what you need to ship an order comes first, bookkeeping fields last.
export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  // pending = awaiting payment, paid = payment confirmed
  status: text("status").notNull().default("pending"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  shippingCarrier: text("shipping_carrier").notNull(),
  // human-readable locker: "Name, Street, City ZIP"
  pickupPoint: text("pickup_point").notNull(),
  totalCents: integer("total_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  // --- bookkeeping (needed by the system, rarely by a human) ---
  shippingCountry: text("shipping_country").notNull(),
  pickupPointId: text("pickup_point_id").notNull(),
  // cart is kept until payment succeeds so a cancelled payment doesn't lose it
  cartId: text("cart_id"),
  paymentSessionId: text("payment_session_id"),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  priceCentsAtPurchase: integer("price_cents_at_purchase").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
});
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItemsTable.$inferSelect;
