import { logger } from "./logger";

export const SHIPPING_COUNTRIES = ["LV", "LT", "EE"] as const;
export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

export const CARRIERS = ["omniva", "dpd", "venipak"] as const;
export type Carrier = (typeof CARRIERS)[number];

export const CARRIER_LABELS: Record<Carrier, string> = {
  omniva: "Omniva",
  dpd: "DPD",
  venipak: "Venipak",
};

/**
 * Parcel locker / pickup point delivery price the customer pays, in cents,
 * by carrier and destination country (shipments originate in Latvia).
 * Based on the carriers' standard Baltic rates — adjust here when your
 * carrier contract prices differ.
 */
export const CARRIER_PRICES: Record<Carrier, Record<ShippingCountry, number>> = {
  omniva: { LV: 349, LT: 699, EE: 699 },
  dpd: { LV: 319, LT: 599, EE: 599 },
  venipak: { LV: 299, LT: 499, EE: 599 },
};

/** Orders at or above this subtotal ship free. */
export const FREE_SHIPPING_FROM_CENTS = 5000;

export function getShippingCents(
  carrier: Carrier,
  country: ShippingCountry,
  subtotalCents: number,
): number {
  if (subtotalCents >= FREE_SHIPPING_FROM_CENTS) return 0;
  return CARRIER_PRICES[carrier][country];
}

// ---------------------------------------------------------------------------
// Pickup point feeds (public, no credentials required)
// ---------------------------------------------------------------------------

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
}

const FEED_TTL_MS = 12 * 60 * 60 * 1000; // refetch feeds every 12h

interface FeedCacheEntry {
  fetchedAt: number;
  byCountry: Partial<Record<ShippingCountry, PickupPoint[]>>;
}

const feedCache = new Map<Carrier, FeedCacheEntry>();
const inflight = new Map<Carrier, Promise<FeedCacheEntry>>();

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) {
    throw new Error(`Feed request failed: ${res.status} ${url}`);
  }
  return res.json();
}

function groupByCountry(
  points: Array<PickupPoint & { country: string }>,
): FeedCacheEntry {
  const byCountry: FeedCacheEntry["byCountry"] = {};
  for (const { country, ...point } of points) {
    if (!(SHIPPING_COUNTRIES as readonly string[]).includes(country)) continue;
    (byCountry[country as ShippingCountry] ??= []).push(point);
  }
  for (const list of Object.values(byCountry)) {
    list.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
  }
  return { fetchedAt: Date.now(), byCountry };
}

async function fetchOmniva(): Promise<FeedCacheEntry> {
  const data = (await fetchJson("https://www.omniva.ee/locations.json")) as Array<
    Record<string, string>
  >;
  // TYPE "0" = parcel machine ("1" = post office counter)
  const points = data
    .filter((loc) => loc.TYPE === "0")
    .map((loc) => ({
      id: loc.ZIP,
      name: loc.NAME,
      address: [loc.A5_NAME, loc.A7_NAME].filter(Boolean).join(" "),
      city: loc.A3_NAME || loc.A2_NAME || loc.A1_NAME || "",
      zip: loc.ZIP,
      country: loc.A0_NAME,
    }));
  return groupByCountry(points);
}

async function fetchDpd(): Promise<FeedCacheEntry> {
  const data = (await fetchJson(
    "https://ftp.dpdbaltics.com/PickupParcelShopData.json",
  )) as Array<Record<string, string>>;
  const points = data.map((shop) => ({
    id: shop.parcelShopId,
    name: shop.companyName || shop.companyShortName || shop.parcelShopId,
    address: [shop.street, shop.houseNo].filter(Boolean).join(" "),
    city: shop.city ?? "",
    zip: shop.zipCode ?? "",
    country: shop.countryCode,
  }));
  return groupByCountry(points);
}

async function fetchVenipak(): Promise<FeedCacheEntry> {
  const data = (await fetchJson(
    "https://go.venipak.lt/ws/get_pickup_points",
  )) as Array<Record<string, unknown>>;
  const points = data.map((point) => ({
    id: String(point.id),
    name: String(point.display_name || point.name || point.id),
    address: String(point.address ?? ""),
    city: String(point.city ?? ""),
    zip: String(point.zip ?? ""),
    country: String(point.country ?? ""),
  }));
  return groupByCountry(points);
}

const FEED_FETCHERS: Record<Carrier, () => Promise<FeedCacheEntry>> = {
  omniva: fetchOmniva,
  dpd: fetchDpd,
  venipak: fetchVenipak,
};

async function getFeed(carrier: Carrier): Promise<FeedCacheEntry> {
  const cached = feedCache.get(carrier);
  if (cached && Date.now() - cached.fetchedAt < FEED_TTL_MS) {
    return cached;
  }

  const pending = inflight.get(carrier);
  if (pending) return pending;

  const promise = FEED_FETCHERS[carrier]()
    .then((entry) => {
      feedCache.set(carrier, entry);
      return entry;
    })
    .catch((err) => {
      logger.error({ err, carrier }, "Failed to fetch pickup point feed");
      // Serve stale data if we have it — better than an empty checkout.
      if (cached) return cached;
      throw err;
    })
    .finally(() => {
      inflight.delete(carrier);
    });

  inflight.set(carrier, promise);
  return promise;
}

export async function getPickupPoints(
  carrier: Carrier,
  country: ShippingCountry,
): Promise<PickupPoint[]> {
  const feed = await getFeed(carrier);
  return feed.byCountry[country] ?? [];
}

export async function findPickupPoint(
  carrier: Carrier,
  country: ShippingCountry,
  id: string,
): Promise<PickupPoint | null> {
  const points = await getPickupPoints(carrier, country);
  return points.find((point) => point.id === id) ?? null;
}
