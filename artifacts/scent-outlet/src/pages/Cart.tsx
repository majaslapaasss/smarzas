import { Link } from 'wouter';
import { 
  useGetCart, 
  useUpdateCartItem, 
  useRemoveCartItem,
  getGetCartQueryKey 
} from '@workspace/api-client-react';
import { useCartId, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';

export default function Cart() {
  const { t } = useTranslation();
  const cartId = useCartId();
  const { data: cart, isLoading } = useGetCart(cartId, { 
    query: { enabled: !!cartId } 
  });
  
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const queryClient = useQueryClient();

  const handleUpdateQuantity = (itemId: number, quantity: number, maxStock: number) => {
    if (quantity < 1 || quantity > maxStock) return;
    
    updateItem.mutate(
      { cartId, itemId, data: { quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey(cartId) });
        }
      }
    );
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem.mutate(
      { cartId, itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey(cartId) });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-12">{t('yourBag')}</h1>
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-6">
              <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-24 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground mb-6">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl font-medium mb-4">{t('bagEmpty')}</h1>
        <p className="text-muted-foreground mb-8">
          {t('bagEmptyText')}
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/shop">{t('continueShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-6xl">
      <h1 className="font-serif text-3xl md:text-4xl font-medium mb-12">{t('yourBag')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-6 py-6 border-b border-border first:pt-0">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-secondary/30 rounded-2xl overflow-hidden relative">
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
              
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-1 block">
                      {item.product.brand}
                    </span>
                    <Link href={`/product/${item.product.id}`} className="font-serif text-lg font-medium hover:text-primary transition-colors block mb-1">
                      {item.product.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {t(`gender_${item.product.gender}`)}
                    </span>
                  </div>
                  <div className="text-right font-medium">
                    {formatPrice(item.product.priceCents * item.quantity)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-input rounded-full px-2 py-1 bg-background">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.product.stock)}
                      className="p-1.5 hover:bg-secondary rounded-full transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1 || updateItem.isPending}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.product.stock)}
                      className="p-1.5 hover:bg-secondary rounded-full transition-colors disabled:opacity-50"
                      disabled={item.quantity >= item.product.stock || updateItem.isPending}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeItem.isPending}
                    className="text-sm text-muted-foreground hover:text-destructive flex items-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">{t('remove')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-secondary/20 p-8 rounded-3xl sticky top-24">
            <h2 className="font-serif text-2xl font-medium mb-6">{t('orderSummary')}</h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="font-medium text-foreground">{formatPrice(cart.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="font-medium text-foreground">{t('calculatedAtCheckout')}</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-medium text-foreground">{t('estimatedTotal')}</span>
                <span className="font-serif text-2xl font-medium">{formatPrice(cart.subtotalCents)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('taxesNote')}
              </p>
            </div>

            <Button asChild className="w-full rounded-full h-14 text-base" size="lg">
              <Link href="/checkout">
                {t('proceedToCheckout')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="mt-6 text-center">
              <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground">
                {t('orContinueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
