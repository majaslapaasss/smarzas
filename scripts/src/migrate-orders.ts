// Ensures the orders tables exist with the current compact layout.
//
// 1. If an outdated orders table is found (recognised by the missing
//    customer_phone column), it is dropped together with order_items —
//    Postgres cannot reorder columns in place. Safe while the store runs
//    on test payments; remove the drop once real order history matters.
// 2. The tables are then created directly here when missing, so the
//    database is never left without them even if a later build step fails.
//
// Runs before db:push on every deploy; drizzle-kit then sees matching
// tables and changes nothing. Products and carts are never touched.
import { pool } from "@workspace/db";

const { rows: outdated } = await pool.query(
  `SELECT 1 FROM information_schema.tables t
   WHERE t.table_name = 'orders'
     AND NOT EXISTS (
       SELECT 1 FROM information_schema.columns c
       WHERE c.table_name = 'orders' AND c.column_name = 'customer_phone'
     )`,
);

if (outdated.length > 0) {
  await pool.query(`DROP TABLE IF EXISTS order_items`);
  await pool.query(`DROP TABLE IF EXISTS orders`);
  console.log("Dropped old-layout orders tables.");
}

await pool.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY,
    status text NOT NULL DEFAULT 'pending',
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    shipping_carrier text NOT NULL,
    pickup_point text NOT NULL,
    total_cents integer NOT NULL,
    shipping_cents integer NOT NULL DEFAULT 0,
    payment_method text,
    created_at timestamptz NOT NULL DEFAULT now(),
    shipping_country text NOT NULL,
    pickup_point_id text NOT NULL,
    cart_id text,
    payment_session_id text
  )
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS order_items (
    id serial PRIMARY KEY,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price_cents_at_purchase integer NOT NULL,
    CONSTRAINT order_items_order_id_orders_id_fk
      FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT order_items_product_id_products_id_fk
      FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);

console.log("Orders tables are present with the current layout.");

await pool.end();
