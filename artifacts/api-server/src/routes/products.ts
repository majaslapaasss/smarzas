import { Router, type IRouter } from "express";
import { and, eq, ilike, or } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  ListFeaturedProductsResponse,
  ListCategoriesResponse,
  GetProductParams,
  GetProductResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { gender, category, search } = parsed.data;
  const conditions = [];
  if (gender) {
    conditions.push(eq(productsTable.gender, gender));
  }
  if (category) {
    conditions.push(eq(productsTable.category, category));
  }
  if (search) {
    conditions.push(
      or(
        ilike(productsTable.name, `%${search}%`),
        ilike(productsTable.brand, `%${search}%`),
      ),
    );
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(productsTable.name);

  res.json(ListProductsResponse.parse(products));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true))
    .orderBy(productsTable.name);

  res.json(ListFeaturedProductsResponse.parse(products));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(product));
});

router.get("/categories", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable);

  const byCategory = new Map<string, number>();
  for (const product of products) {
    byCategory.set(product.category, (byCategory.get(product.category) ?? 0) + 1);
  }

  const categories = Array.from(byCategory.entries()).map(
    ([name, productCount], index) => ({
      id: index + 1,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      productCount,
    }),
  );

  res.json(ListCategoriesResponse.parse(categories));
});

export default router;
