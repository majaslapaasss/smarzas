import { createHash } from "node:crypto";
import type { Request } from "express";
import Stripe from "stripe";
import { eq, and } from "drizzle-orm";
import { cartItemsTable, db, ordersTable, type Order } from "@workspace/db";

export type PaymentMethod = "stripe" | "paysera";

export interface OrderItemForPayment {
  name: string;
  quantity: number;
  priceCents: number;
}

/**
 * Public origin used for payment redirect URLs. PUBLIC_URL wins if set;
 * otherwise derived from the request (requires `trust proxy` behind Render).
 */
export function getBaseUrl(req: Request): string {
  const configured = process.env.PUBLIC_URL ?? process.env.RENDER_EXTERNAL_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return `${req.protocol}://${req.get("host")}`;
}

// ---------------------------------------------------------------------------
// Stripe (hosted Checkout)
// ---------------------------------------------------------------------------

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

export async function createStripeCheckoutSession(
  order: Order,
  items: OrderItemForPayment[],
  shippingCents: number,
  baseUrl: string,
  shippingLabel = "Shipping",
): Promise<{ url: string; sessionId: string }> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: item.priceCents,
        product_data: { name: item.name },
      },
    }),
  );

  if (shippingCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: shippingCents,
        product_data: { name: shippingLabel },
      },
    });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: order.customerEmail,
    metadata: { orderId: String(order.id) },
    success_url: `${baseUrl}/order/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }
  return { url: session.url, sessionId: session.id };
}

export async function retrieveStripeSession(sessionId: string) {
  return getStripe().checkout.sessions.retrieve(sessionId);
}

export function verifyStripeWebhook(
  payload: Buffer,
  signature: string,
): Stripe.Event {
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}

// ---------------------------------------------------------------------------
// Paysera (redirect API v1.6, https://developers.paysera.com)
// ---------------------------------------------------------------------------

export function isPayseraConfigured(): boolean {
  return !!process.env.PAYSERA_PROJECT_ID && !!process.env.PAYSERA_SIGN_PASSWORD;
}

function payseraEncode(params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  return Buffer.from(query, "utf8")
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

function payseraDecode(data: string): Record<string, string> {
  const query = Buffer.from(
    data.replaceAll("-", "+").replaceAll("_", "/"),
    "base64",
  ).toString("utf8");
  return Object.fromEntries(new URLSearchParams(query));
}

function payseraSign(data: string): string {
  return createHash("md5")
    .update(data + process.env.PAYSERA_SIGN_PASSWORD!)
    .digest("hex");
}

export function buildPayseraPaymentUrl(order: Order, baseUrl: string): string {
  const params: Record<string, string> = {
    projectid: process.env.PAYSERA_PROJECT_ID!,
    orderid: String(order.id),
    amount: String(order.totalCents),
    currency: "EUR",
    accepturl: `${baseUrl}/order/${order.id}`,
    cancelurl: `${baseUrl}/checkout`,
    callbackurl: `${baseUrl}/api/payments/paysera/callback`,
    p_email: order.customerEmail,
    test: process.env.PAYSERA_TEST ?? "1",
    version: "1.6",
  };

  const data = payseraEncode(params);
  const sign = payseraSign(data);
  return `https://www.paysera.com/pay/?data=${encodeURIComponent(data)}&sign=${sign}`;
}

/**
 * Validates and decodes a Paysera callback. Returns the decoded parameters
 * or null when the signature is invalid.
 */
export function parsePayseraCallback(
  data: string,
  ss1: string,
): Record<string, string> | null {
  if (payseraSign(data) !== ss1) {
    return null;
  }
  return payseraDecode(data);
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Marks a pending order as paid and clears the cart it was created from. */
export async function markOrderPaid(orderId: number): Promise<void> {
  const [order] = await db
    .update(ordersTable)
    .set({ status: "paid" })
    .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")))
    .returning();

  if (order?.cartId) {
    await db
      .delete(cartItemsTable)
      .where(eq(cartItemsTable.cartId, order.cartId));
  }
}
