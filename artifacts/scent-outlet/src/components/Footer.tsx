import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/30 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground block mb-4">
              Scent Outlet
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Discover your signature scent without the luxury markup. We bring you quality fragrances for men, women, and everyone in between.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Fragrances</Link></li>
              <li><Link href="/shop?gender=women" className="hover:text-primary transition-colors">Women's Perfumes</Link></li>
              <li><Link href="/shop?gender=men" className="hover:text-primary transition-colors">Men's Cologne</Link></li>
              <li><Link href="/shop?gender=unisex" className="hover:text-primary transition-colors">Unisex Scents</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><span className="hover:text-primary cursor-pointer transition-colors">Contact Us</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">Shipping & Returns</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">FAQ</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Scent Outlet. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
