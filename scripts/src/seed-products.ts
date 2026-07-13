import { db, productsTable } from "@workspace/db";

const IMAGE_BASE = "/api/images";

const products: (typeof productsTable.$inferInsert)[] = [
  {
    name: "Amber Bloom",
    brand: "Perfume Baltic",
    gender: "women",
    description:
      "A warm floral amber that opens with jasmine and settles into a soft, sun-kissed base. Made for everyday wear that still feels special.",
    scentNotes: ["Jasmine", "Amber", "Soft Musk"],
    category: "Floral",
    priceCents: 2900,
    imageUrl: `${IMAGE_BASE}/amber-bloom.jpg`,
    stock: 42,
    featured: true,
  },
  {
    name: "Velvet Rose",
    brand: "Perfume Baltic",
    gender: "women",
    description:
      "Rich Turkish rose layered over creamy sandalwood, finished with a whisper of vanilla. Romantic without being heavy.",
    scentNotes: ["Turkish Rose", "Sandalwood", "Vanilla"],
    category: "Floral",
    priceCents: 3200,
    imageUrl: `${IMAGE_BASE}/velvet-rose.jpg`,
    stock: 35,
    featured: true,
  },
  {
    name: "Citrus Breeze",
    brand: "Perfume Baltic",
    gender: "unisex",
    description:
      "Bright Sicilian lemon and grapefruit over a clean green base. The scent equivalent of throwing open the windows on a spring morning.",
    scentNotes: ["Sicilian Lemon", "Grapefruit", "Green Tea"],
    category: "Citrus",
    priceCents: 2200,
    imageUrl: `${IMAGE_BASE}/citrus-breeze.jpg`,
    stock: 60,
    featured: false,
  },
  {
    name: "Midnight Oud",
    brand: "Perfume Baltic",
    gender: "men",
    description:
      "Deep, smoky oud wrapped in leather and dark spice. A bold signature scent for evenings that call for presence.",
    scentNotes: ["Oud", "Leather", "Black Pepper"],
    category: "Woody",
    priceCents: 3900,
    imageUrl: `${IMAGE_BASE}/midnight-oud.jpg`,
    stock: 28,
    featured: true,
  },
  {
    name: "Vanilla Suede",
    brand: "Perfume Baltic",
    gender: "unisex",
    description:
      "Soft vanilla bean folded into buttery suede and warm tonka bean. Cozy, skin-like, and endlessly wearable.",
    scentNotes: ["Vanilla Bean", "Suede Accord", "Tonka Bean"],
    category: "Gourmand",
    priceCents: 2600,
    imageUrl: `${IMAGE_BASE}/vanilla-suede.jpg`,
    stock: 50,
    featured: false,
  },
  {
    name: "Sea Salt Musk",
    brand: "Perfume Baltic",
    gender: "men",
    description:
      "A crisp aquatic musk with driftwood and sea salt. Fresh enough for the gym, refined enough for the office.",
    scentNotes: ["Sea Salt", "Driftwood", "White Musk"],
    category: "Fresh",
    priceCents: 2400,
    imageUrl: `${IMAGE_BASE}/sea-salt-musk.jpg`,
    stock: 55,
    featured: false,
  },
  {
    name: "Golden Oak",
    brand: "Perfume Baltic",
    gender: "men",
    description:
      "Toasted oak and cedar with a golden thread of amber running through. Grounded, confident, built to last all day.",
    scentNotes: ["Cedar", "Oakmoss", "Amber"],
    category: "Woody",
    priceCents: 3100,
    imageUrl: `${IMAGE_BASE}/golden-oak.jpg`,
    stock: 33,
    featured: false,
  },
  {
    name: "Peony Silk",
    brand: "Perfume Baltic",
    gender: "women",
    description:
      "Delicate peony petals over silky white musk, with a touch of pear for sweetness. Light, pretty, and easy to fall in love with.",
    scentNotes: ["Peony", "White Musk", "Pear"],
    category: "Floral",
    priceCents: 2500,
    imageUrl: `${IMAGE_BASE}/peony-silk.jpg`,
    stock: 47,
    featured: false,
  },
  {
    name: "Fresh Linen",
    brand: "Perfume Baltic",
    gender: "unisex",
    description:
      "The scent of line-dried sheets and clean cotton, softened with a touch of white flowers. Understated and comforting.",
    scentNotes: ["Cotton Accord", "White Flowers", "Musk"],
    category: "Fresh",
    priceCents: 1900,
    imageUrl: `${IMAGE_BASE}/fresh-linen.jpg`,
    stock: 65,
    featured: false,
  },
  {
    name: "Spiced Leather",
    brand: "Perfume Baltic",
    gender: "men",
    description:
      "Supple leather warmed by cardamom and clove. A confident, spice-forward scent with real depth.",
    scentNotes: ["Leather", "Cardamom", "Clove"],
    category: "Oriental",
    priceCents: 3400,
    imageUrl: `${IMAGE_BASE}/spiced-leather.jpg`,
    stock: 30,
    featured: false,
  },
  {
    name: "Coconut Vetiver",
    brand: "Perfume Baltic",
    gender: "unisex",
    description:
      "Creamy coconut meets earthy vetiver for a scent that feels like a beach vacation and a walk in the woods at once.",
    scentNotes: ["Coconut", "Vetiver", "Sea Spray"],
    category: "Fresh",
    priceCents: 2300,
    imageUrl: `${IMAGE_BASE}/coconut-vetiver.jpg`,
    stock: 40,
    featured: false,
  },
  {
    name: "Cashmere Musk",
    brand: "Perfume Baltic",
    gender: "women",
    description:
      "The softest musk we make, blended with iris and warm cashmere accord. Understated luxury for daily wear.",
    scentNotes: ["Iris", "Cashmere Accord", "Musk"],
    category: "Musk",
    priceCents: 2800,
    imageUrl: `${IMAGE_BASE}/cashmere-musk.jpg`,
    stock: 38,
    featured: true,
  },
];

async function seed() {
  const existing = await db.select().from(productsTable).limit(1);
  if (existing.length > 0) {
    console.log("Products table already has data, skipping seed.");
    process.exit(0);
  }

  await db.insert(productsTable).values(products);
  console.log(`Seeded ${products.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
