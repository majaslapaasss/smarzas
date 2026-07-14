// One-time cleanup: drops the pre-locker orders tables (recognised by the
// old shipping_address column) so `db:push` recreates them with the compact
// column layout. Runs before db:push on every deploy; once the table has
// the new shape this is a no-op. Only order history is affected — products
// and carts are untouched.
import { pool } from "@workspace/db";

const { rows } = await pool.query(
  `SELECT 1 FROM information_schema.columns
   WHERE table_name = 'orders' AND column_name = 'shipping_address'`,
);

if (rows.length > 0) {
  await pool.query(`DROP TABLE IF EXISTS order_items`);
  await pool.query(`DROP TABLE IF EXISTS orders`);
  console.log("Dropped old-layout orders tables; db:push will recreate them.");
} else {
  console.log("Orders table already has the compact layout; nothing to do.");
}

await pool.end();
