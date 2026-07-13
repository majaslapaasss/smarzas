import { Link } from 'wouter';
import { useListFeaturedProducts } from '@workspace/api-client-react';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';
import heroImg from '@assets/generated_images/hero-perfume.jpg';
import womenImg from '@assets/generated_images/women-category.jpg';
import menImg from '@assets/generated_images/men-category.jpg';
import unisexImg from '@assets/generated_images/unisex-category.jpg';

export default function Home() {
  const { data: featuredProducts, isLoading } = useListFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/50 pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">
                Welcome to Scent Outlet
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-foreground mb-6">
                Your signature scent, <br />
                <span className="text-muted-foreground italic">beautifully accessible.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Discover our curated collection of premium fragrances for everyone. 
                Warm, inviting, and priced without the luxury markup.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Shop the Collection
                </Link>
                <Link
                  href="/shop?featured=true"
                  className="inline-flex items-center justify-center rounded-full border border-input bg-transparent px-8 py-3.5 text-sm font-medium hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  View Bestsellers
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={heroImg}
                  alt="Elegant perfume bottle"
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Decorative blur blob */}
              <div className="absolute -z-10 -bottom-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                Loved by Many
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Our most sought-after fragrances, curated just for you.
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group">
              View all products
              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="aspect-square bg-secondary rounded-2xl"></div>
                  <div className="h-4 bg-secondary rounded w-2/3"></div>
                  <div className="h-6 bg-secondary rounded w-full"></div>
                  <div className="h-4 bg-secondary rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Category / Gender */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              Find Your Match
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether you prefer deep woods, fresh florals, or clean aquatic notes, your next signature scent is waiting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/shop?gender=women" className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] block">
              <img src={womenImg} alt="Women's Fragrances" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-white/80 text-sm font-medium tracking-wider uppercase mb-2">Collection</span>
                <h3 className="font-serif text-3xl text-white mb-2">Women</h3>
                <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:text-white">
                  Shop now <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link href="/shop?gender=unisex" className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] block">
              <img src={unisexImg} alt="Unisex Fragrances" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-white/80 text-sm font-medium tracking-wider uppercase mb-2">Collection</span>
                <h3 className="font-serif text-3xl text-white mb-2">Unisex</h3>
                <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:text-white">
                  Shop now <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link href="/shop?gender=men" className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] block">
              <img src={menImg} alt="Men's Fragrances" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-white/80 text-sm font-medium tracking-wider uppercase mb-2">Collection</span>
                <h3 className="font-serif text-3xl text-white mb-2">Men</h3>
                <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:text-white">
                  Shop now <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
