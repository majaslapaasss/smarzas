import { Link } from 'wouter';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border bg-secondary/30 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground block mb-4">
              Perfume Baltic
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {t('footerTagline')}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">{t('shop')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-primary transition-colors">{t('allFragrances')}</Link></li>
              <li><Link href="/shop?gender=women" className="hover:text-primary transition-colors">{t('womensPerfumes')}</Link></li>
              <li><Link href="/shop?gender=men" className="hover:text-primary transition-colors">{t('mensCologne')}</Link></li>
              <li><Link href="/shop?gender=unisex" className="hover:text-primary transition-colors">{t('unisexScents')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">{t('support')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contactUs')}</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-primary transition-colors">{t('shippingReturns')}</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">{t('faq')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Perfume Baltic. {t('allRightsReserved')}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
