import { useRoute, Link } from 'wouter';
import { useGetOrder } from '@workspace/api-client-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, MapPin, Mail, Calendar } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function OrderConfirmation() {
  const { t, language } = useTranslation();
  const [, params] = useRoute('/order/:id');
  const orderId = parseInt(params?.id || '0', 10);
  
  const { data: order, isLoading, isError } = useGetOrder(orderId, {
    query: { enabled: !!orderId }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h1 className="font-serif text-3xl font-medium mb-4">{t('orderNotFound')}</h1>
        <p className="text-muted-foreground mb-8">{t('orderNotFoundText')}</p>
        <Button asChild className="rounded-full">
          <Link href="/shop">{t('returnToShop')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-4">
          {t('thankYou')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('orderReceived')}
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden mb-12">
        <div className="p-6 md:p-8 border-b border-border bg-secondary/10 flex flex-wrap gap-6 md:gap-12 justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('orderNumber')}</p>
            <p className="font-medium text-foreground">#{order.id.toString().padStart(6, '0')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('date')}</p>
            <p className="font-medium text-foreground">
              {new Date(order.createdAt).toLocaleDateString(language === 'lv' ? 'lv-LV' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('total')}</p>
            <p className="font-medium text-foreground">{formatPrice(order.totalCents)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('status')}</p>
            <p className="font-medium text-foreground">{t(`status_${order.status}`)}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-serif text-2xl font-medium mb-6">{t('orderItems')}</h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-secondary/30 rounded-xl overflow-hidden">
                  {item.product.imageUrl ? (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary" />
                  )}
                </div>
                <div className="flex flex-1 justify-between">
                  <div>
                    <Link href={`/product/${item.product.id}`} className="font-medium hover:text-primary transition-colors block mb-1">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{t('qty')}: {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium">
                    {formatPrice(item.priceCentsAtPurchase * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-secondary/20 p-6 md:p-8 rounded-3xl">
          <h3 className="flex items-center font-medium text-lg mb-4">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            {t('shippingDetails')}
          </h3>
          <p className="text-foreground">{order.customerName}</p>
          <p className="text-muted-foreground">{order.shippingAddress}</p>
          <p className="text-muted-foreground">{order.city}, {order.postalCode}</p>
        </div>
        
        <div className="bg-secondary/20 p-6 md:p-8 rounded-3xl">
          <h3 className="flex items-center font-medium text-lg mb-4">
            <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
            {t('contactInfo')}
          </h3>
          <p className="text-foreground">{order.customerEmail}</p>
          <p className="text-muted-foreground text-sm mt-2">
            {t('emailUpdatesNote')}
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/shop">{t('continueShopping')}</Link>
        </Button>
      </div>
    </div>
  );
}
