import { Link } from 'wouter';
import { useGetCart } from '@workspace/api-client-react';
import { useCartId } from '@/lib/utils';
import { ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation, Language } from '@/lib/i18n';

function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useTranslation();

  const option = (lang: Language, label: string) => (
    <button
      onClick={() => setLanguage(lang)}
      className={cn(
        'px-1.5 py-0.5 rounded transition-colors',
        language === lang
          ? 'font-semibold text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      )}
      aria-pressed={language === lang}
    >
      {label}
    </button>
  );

  return (
    <div className={cn('flex items-center gap-0.5 text-sm', className)}>
      <Globe className="h-4 w-4 text-muted-foreground mr-1" />
      {option('lv', 'LV')}
      <span className="text-muted-foreground/50">/</span>
      {option('en', 'EN')}
    </div>
  );
}

export function Navbar() {
  const cartId = useCartId();
  const { data: cart } = useGetCart(cartId, { query: { enabled: !!cartId } });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                Perfume Baltic
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('allFragrances')}
            </Link>
            <Link href="/shop?gender=women" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('women')}
            </Link>
            <Link href="/shop?gender=men" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('men')}
            </Link>
            <Link href="/shop?gender=unisex" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('unisex')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher className="hidden md:flex" />
            <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/shop" className="text-sm font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              {t('allFragrances')}
            </Link>
            <Link href="/shop?gender=women" className="text-sm font-medium text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              {t('women')}
            </Link>
            <Link href="/shop?gender=men" className="text-sm font-medium text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              {t('men')}
            </Link>
            <Link href="/shop?gender=unisex" className="text-sm font-medium text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              {t('unisex')}
            </Link>
            <div className="pt-2 border-t border-border/40">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
