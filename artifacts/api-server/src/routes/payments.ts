import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  VerifyStripePaymentBody,
  VerifyStripePaymentResponse,
} from "@workspace/api-zod";
import {
  isStripeConfigured,
  markOrderPaid,
  parsePayseraCallback,
  retrieveStripeSession,
  verifyStripeWebhook,
} from "../lib/payments";
import { loadOrderForResponse } from "../lib/orders";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Called by the storefront when the customer returns from Stripe Checkout.
// Confirms with Stripe that the session is paid before marking the order.
router.post("/payments/stripe/verify", async (req, res): Promise<void> => {
  const parsed = VerifyStripePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!isStripeConfigured()) {
    res.status(503).json({ error: "Stripe is not configured" });
    return;
  }

  const { orderId, sessionId } = parsed.data;

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.paymentSessionId !== sessionId) {
    res.status(400).json({ error: "Session does not belong to this order" });
    return;
  }

  if (order.status === "pending") {
    const session = await retrieveStripeSession(sessionId);
    if (session.payment_status === "paid") {
      await markOrderPaid(orderId);
    }
  }

  const fullOrder = await loadOrderForResponse(orderId);
  res.json(VerifyStripePaymentResponse.parse(fullOrder));
});

// Stripe server-to-server webhook. Optional but recommended; requires
// STRIPE_WEBHOOK_SECRET. The raw body parser is mounted in app.ts.
router.post("/payments/stripe/webhook", async (req, res): Promise<void> => {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ error: "Stripe webhook is not configured" });
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string" || !Buffer.isBuffer(req.body)) {
    res.status(400).json({ error: "Invalid webhook request" });
    return;
  }

  let event;
  try {
    event = verifyStripeWebhook(req.body, signature);
  } catch (err) {
    logger.warn({ err }, "Stripe webhook signature verification failed");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = Number(session.metadata?.orderId);
    if (orderId && session.payment_status === "paid") {
      await markOrderPaid(orderId);
    }
  }

  res.json({ received: true });
});

// Paysera server-to-server callback (sent as GET by default, POST in some
// configurations). Paysera requires the literal response "OK" to consider
// the callback delivered.
router.all("/payments/paysera/callback", async (req, res): Promise<void> => {
  const source = { ...(req.body ?? {}), ...req.query } as Record<
    string,
    unknown
  >;
  const { data, ss1 } = source;
  if (typeof data !== "string" || typeof ss1 !== "string") {
    res.status(400).send("Missing data or ss1");
    return;
  }

  const params = parsePayseraCallback(data, ss1);
  if (!params) {
    logger.warn("Paysera callback signature verification failed");
    res.status(400).send("Invalid signature");
    return;
  }

  // status 1 = payment successful (0 = not executed, 2 = accepted but not
  // yet executed, 3 = additional information)
  if (params.status === "1") {
    const orderId = Number(params.orderid);
    if (orderId) {
      await markOrderPaid(orderId);
    }
  }

  res.send("OK");
});

export default router;
