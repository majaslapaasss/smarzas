import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "./logger";
import { loadOrderForResponse } from "./orders";

const CARRIER_EMAIL_LABELS: Record<string, string> = {
  omniva: "Omniva",
  dpd: "DPD",
  venipak: "Venipak",
};

export function isEmailConfigured(): boolean {
  return !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

function eur(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Sends the order confirmation (bilingual LV/EN) to the customer once
 * payment is confirmed. A copy goes to ORDER_NOTIFY_EMAIL when set, so the
 * store owner learns about new orders without checking the database.
 * Failures are logged, never thrown — email must not break payment flow.
 */
export async function sendOrderConfirmationEmail(orderId: number): Promise<void> {
  try {
    if (!isEmailConfigured()) {
      logger.warn({ orderId }, "SMTP not configured; skipping order confirmation email");
      return;
    }

    const order = await loadOrderForResponse(orderId);
    if (!order) {
      logger.error({ orderId }, "Order not found when sending confirmation email");
      return;
    }

    const orderNo = `#${order.id.toString().padStart(6, "0")}`;
    const carrier = CARRIER_EMAIL_LABELS[order.shippingCarrier] ?? order.shippingCarrier;
    const subtotalCents = order.totalCents - order.shippingCents;

    const itemRowsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">
            ${escapeHtml(item.product.brand)} — ${escapeHtml(item.product.name)}
            <span style="color:#888;">× ${item.quantity}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">
            ${eur(item.priceCentsAtPurchase * item.quantity)}
          </td>
        </tr>`,
      )
      .join("");

    const itemLinesText = order.items
      .map(
        (item) =>
          `  ${item.quantity}x ${item.product.brand} — ${item.product.name}: ${eur(
            item.priceCentsAtPurchase * item.quantity,
          )}`,
      )
      .join("\n");

    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h1 style="font-size:22px;margin-bottom:4px;">Perfume Baltic</h1>
  <h2 style="font-size:17px;font-weight:normal;margin-top:0;">
    Paldies par pasūtījumu! / Thank you for your order!
  </h2>
  <p>
    Jūsu pasūtījums <strong>${orderNo}</strong> ir apmaksāts un drīzumā tiks nosūtīts.<br>
    <span style="color:#666;">Your order <strong>${orderNo}</strong> is paid and will be dispatched shortly.</span>
  </p>

  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    ${itemRowsHtml}
    <tr>
      <td style="padding:8px 0;color:#666;">Starpsumma / Subtotal</td>
      <td style="padding:8px 0;text-align:right;">${eur(subtotalCents)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#666;">Piegāde / Shipping (${escapeHtml(carrier)})</td>
      <td style="padding:8px 0;text-align:right;">${order.shippingCents === 0 ? "0.00 € (bezmaksas / free)" : eur(order.shippingCents)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:bold;border-top:2px solid #222;">Kopā / Total</td>
      <td style="padding:8px 0;text-align:right;font-weight:bold;border-top:2px solid #222;">${eur(order.totalCents)}</td>
    </tr>
  </table>

  <h3 style="font-size:15px;margin-bottom:4px;">Piegāde / Delivery</h3>
  <p style="margin-top:0;">
    ${escapeHtml(order.customerName)}<br>
    ${escapeHtml(order.customerPhone)}<br>
    <strong>${escapeHtml(carrier)}</strong> — ${escapeHtml(order.pickupPoint)}
  </p>
  <p style="color:#666;font-size:13px;">
    Kad sūtījums būs pakomātā, saņemsiet īsziņu no ${escapeHtml(carrier)} uz norādīto tālruni.<br>
    When the parcel reaches the locker, ${escapeHtml(carrier)} will text the phone number above.
  </p>
  <p style="color:#999;font-size:12px;margin-top:24px;">
    Jautājumi? / Questions? — atbildiet uz šo e-pastu / just reply to this email.
  </p>
</div>`;

    const text = [
      `Perfume Baltic — Paldies par pasūtījumu! / Thank you for your order!`,
      ``,
      `Pasūtījums / Order: ${orderNo}`,
      ``,
      itemLinesText,
      ``,
      `Starpsumma / Subtotal: ${eur(subtotalCents)}`,
      `Piegāde / Shipping (${carrier}): ${eur(order.shippingCents)}`,
      `Kopā / Total: ${eur(order.totalCents)}`,
      ``,
      `Piegāde / Delivery:`,
      `  ${order.customerName}`,
      `  ${order.customerPhone}`,
      `  ${carrier} — ${order.pickupPoint}`,
      ``,
      `Kad sūtījums būs pakomātā, saņemsiet īsziņu no ${carrier}.`,
      `When the parcel reaches the locker, ${carrier} will send you an SMS.`,
    ].join("\n");

    await getTransporter().sendMail({
      from: process.env.SMTP_FROM ?? `"Perfume Baltic" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      bcc: process.env.ORDER_NOTIFY_EMAIL || undefined,
      subject: `Pasūtījums / Order ${orderNo} — Perfume Baltic`,
      text,
      html,
    });

    logger.info({ orderId, to: order.customerEmail }, "Order confirmation email sent");
  } catch (err) {
    logger.error({ err, orderId }, "Failed to send order confirmation email");
  }
}
