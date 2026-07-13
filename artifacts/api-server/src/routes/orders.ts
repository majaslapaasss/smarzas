import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, orderItemsTable, ordersTable } from "@workspace/db";
import {
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderParams,
  GetOrderResponse,
} from "@workspace/api-zod";
import { loadCart } from "../lib/cart";
import { loadOrderForResponse } from "../lib/orders";
import {
  buildPayseraPaymentUrl,
  calculateShippingCents,
  createStripeCheckoutSession,
  getBaseUrl,
  isPayseraConfigured,
  isStripeConfigured,
} from "../lib/payments";
import { logger } from "../lib/logger";

const router: IRouter = Router();

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
    paymentMethod,
  } = parsed.data;

  if (paymentMethod === "stripe" && !isStripeConfigured()) {
    res.status(503).json({
      error: "Card payments are not configured (missing STRIPE_SECRET_KEY)",
    });
    return;
  }
  if (paymentMethod === "paysera" && !isPayseraConfigured()) {
    res.status(503).json({
      error:
        "Paysera payments are not configured (missing PAYSERA_PROJECT_ID / PAYSERA_SIGN_PASSWORD)",
    });
    return;
  }

  const cart = await loadCart(cartId);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const shippingCents = calculateShippingCents(cart.subtotalCents);
  const totalCents = cart.subtotalCents + shippingCents;

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      totalCents,
      status: "pending",
      cartId,
      paymentMethod,
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

  // The cart is intentionally NOT cleared here — it is cleared once payment
  // succeeds (webhook/callback/verify), so a cancelled payment keeps the bag.

  const baseUrl = getBaseUrl(req);
  let paymentUrl: string;
  try {
    if (paymentMethod === "stripe") {
      const session = await createStripeCheckoutSession(
        order,
        cart.items.map((item) => ({
          name: `${item.product.brand} — ${item.product.name}`,
          quantity: item.quantity,
          priceCents: item.product.priceCents,
        })),
        shippingCents,
        baseUrl,
      );
      paymentUrl = session.url;
      await db
        .update(ordersTable)
        .set({ paymentSessionId: session.sessionId })
        .where(eq(ordersTable.id, order.id));
    } else {
      paymentUrl = buildPayseraPaymentUrl(order, baseUrl);
    }
  } catch (err) {
    logger.error({ err }, "Failed to create payment session");
    await db
      .delete(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order.id));
    await db.delete(ordersTable).where(eq(ordersTable.id, order.id));
    res.status(502).json({ error: "Failed to start payment. Please try again." });
    return;
  }

  const fullOrder = await loadOrderForResponse(order.id);
  res.status(201).json(CreateOrderResponse.parse({ ...fullOrder, paymentUrl }));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const order = await loadOrderForResponse(params.data.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(order));
});

export default router;
