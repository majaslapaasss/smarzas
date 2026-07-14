// One-time cleanup: drops outdated orders tables so `db:push` recreates
// them with the current compact column layout (Postgres cannot reorder
// columns in place). The current layout is recognised by the presence of
// the customer_phone column. Runs before db:push on every deploy; once the
// table has the new shape this is a no-op. Only order history is affected —
// products and carts are untouched. Safe while the store runs on test
// payments; remove this pattern once real order history must be preserved.
import { pool } from "@workspace/db";

const { rows } = await pool.query(
  `SELECT 1 FROM information_schema.tables WHERE table_name = 'orders'`,
);

if (rows.length > 0) {
  const { rows: current } = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_name = 'orders' AND column_name = 'customer_phone'`,
  );

  if (current.length === 0) {
    await pool.query(`DROP TABLE IF EXISTS order_items`);
    await pool.query(`DROP TABLE IF EXISTS orders`);
    console.log("Dropped old-layout orders tables; db:push will recreate them.");
  } else {
    console.log("Orders table already has the current layout; nothing to do.");
  }
} else {
  console.log("Orders table does not exist yet; db:push will create it.");
}

await pool.end();
