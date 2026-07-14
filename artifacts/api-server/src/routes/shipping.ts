import { Router, type IRouter } from "express";
import {
  ListShippingMethodsQueryParams,
  ListShippingMethodsResponse,
  ListPickupPointsQueryParams,
  ListPickupPointsResponse,
} from "@workspace/api-zod";
import {
  CARRIERS,
  CARRIER_LABELS,
  CARRIER_PRICES,
  FREE_SHIPPING_FROM_CENTS,
  getPickupPoints,
} from "../lib/shipping";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/shipping/methods", (req, res): void => {
  const parsed = ListShippingMethodsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { country } = parsed.data;
  const methods = CARRIERS.map((carrier) => ({
    carrier,
    label: CARRIER_LABELS[carrier],
    priceCents: CARRIER_PRICES[carrier][country],
    freeFromCents: FREE_SHIPPING_FROM_CENTS,
  }));

  res.json(ListShippingMethodsResponse.parse(methods));
});

router.get("/shipping/pickup-points", async (req, res): Promise<void> => {
  const parsed = ListPickupPointsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { carrier, country } = parsed.data;
  try {
    const points = await getPickupPoints(carrier, country);
    res.json(ListPickupPointsResponse.parse(points));
  } catch (err) {
    logger.error({ err, carrier, country }, "Pickup point feed unavailable");
    res.status(502).json({
      error: "Carrier locations are temporarily unavailable. Please try again shortly.",
    });
  }
});

export default router;
