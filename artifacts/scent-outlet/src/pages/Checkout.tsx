import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetCart, useCreateOrder, OrderInput } from '@workspace/api-client-react';
import { useCartId, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/lib/i18n';
import { useMemo } from 'react';
import { CreditCard, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

function buildCheckoutSchema(t: (key: string) => string) {
  return z.object({
    customerName: z.string().min(2, t('validationNameMin')),
    customerEmail: z.string().email(t('validationEmail')),
    shippingAddress: z.string().min(5, t('validationAddressMin')),
    city: z.string().min(2, t('validationCityMin')),
    postalCode: z.string().min(4, t('validationPostalMin')),
    paymentMethod: z.enum(['stripe', 'paysera']),
  });
}

type CheckoutFormValues = z.infer<ReturnType<typeof buildCheckoutSchema>>;

export default function Checkout() {
  const { t, language } = useTranslation();
  const checkoutSchema = useMemo(() => buildCheckoutSchema(t), [language]);
  const [, setLocation] = useLocation();
  const cartId = useCartId();
  const { data: cart, isLoading: isCartLoading } = useGetCart(cartId, { 
    query: { enabled: !!cartId } 
  });
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      shippingAddress: "",
      city: "",
      postalCode: "",
      paymentMethod: "stripe",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: t('bagEmpty'),
        description: t('bagEmptyToastDesc'),
        variant: "destructive"
      });
      return;
    }

    createOrder.mutate(
      { 
        data: {
          cartId,
          ...data
        } 
      },
      {
        onSuccess: (order) => {
          // The cart is kept until payment succeeds (the server clears it),
          // so a cancelled payment doesn't lose the bag.
          if (order.paymentUrl) {
            setIsRedirecting(true);
            window.location.assign(order.paymentUrl);
          } else {
            setLocation(`/order/${order.id}`);
          }
        },
        onError: (error) => {
          const serverMessage = (error as { data?: { error?: string } })?.data?.error;
          toast({
            title: t('checkoutFailed'),
            description: serverMessage || t('checkoutFailedDesc'),
            variant: "destructive"
          });
        }
      }
    );
  };

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h1 className="font-serif text-3xl font-medium mb-4">{t('bagEmpty')}</h1>
        <p className="text-muted-foreground mb-8">{t('cannotCheckoutEmpty')}</p>
        <Button asChild className="rounded-full">
          <Link href="/shop">{t('returnToShop')}</Link>
        </Button>
      </div>
    );
  }

  // Simplified logic for shipping cost
  const shippingCents = cart.subtotalCents >= 5000 ? 0 : 500; // Free shipping over €50
  const totalCents = cart.subtotalCents + shippingCents;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-6xl">
      <div className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">{t('checkout')}</h1>
        <p className="text-muted-foreground">{t('checkoutSubtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <div className="bg-card p-6 md:p-8 rounded-3xl border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-medium">{t('contactInformation')}</h2>
                  
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('emailAddress')}</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" className="h-12 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6 border-t border-border space-y-6">
                  <h2 className="font-serif text-2xl font-medium">{t('shippingDetails')}</h2>
                  
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fullName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" className="h-12 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('streetAddress')}</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Perfume Lane, Apt 4B" className="h-12 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('city')}</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" className="h-12 bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('postalCode')}</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" className="h-12 bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border space-y-6">
                  <h2 className="font-serif text-2xl font-medium">{t('paymentMethod')}</h2>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            <label
                              className={cn(
                                "flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors",
                                field.value === "stripe"
                                  ? "border-primary bg-primary/5"
                                  : "border-input hover:bg-secondary/30"
                              )}
                            >
                              <RadioGroupItem value="stripe" className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium">
                                  <CreditCard className="h-4 w-4" />
                                  {t('payCard')}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {t('payCardDesc')}
                                </p>
                              </div>
                            </label>

                            <label
                              className={cn(
                                "flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors",
                                field.value === "paysera"
                                  ? "border-primary bg-primary/5"
                                  : "border-input hover:bg-secondary/30"
                              )}
                            >
                              <RadioGroupItem value="paysera" className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium">
                                  <Landmark className="h-4 w-4" />
                                  {t('payPaysera')}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {t('payPayseraDesc')}
                                </p>
                              </div>
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-8 border-t border-border">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full h-14 text-lg"
                    disabled={createOrder.isPending || isRedirecting}
                  >
                    {isRedirecting
                      ? t('redirectingToPayment')
                      : createOrder.isPending
                        ? t('processing')
                        : t('payNow')}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {t('securePaymentNote')}
                  </p>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    {t('agreePrefix')}
                    <Link href="/terms" className="underline hover:text-foreground">{t('agreeTermsLink')}</Link>
                    {t('agreeAnd')}
                    <Link href="/privacy" className="underline hover:text-foreground">{t('agreePrivacyLink')}</Link>
                    {t('agreeSuffix')}
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-secondary/20 p-6 md:p-8 rounded-3xl sticky top-24">
            <h2 className="font-serif text-2xl font-medium mb-6">{t('inYourBag')}</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-secondary/50 rounded-xl overflow-hidden shrink-0">
                    {item.product.imageUrl && (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    )}
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.product.brand}</p>
                  </div>
                  <div className="text-right font-medium">
                    {formatPrice(item.product.priceCents * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="font-medium text-foreground">{formatPrice(cart.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="font-medium text-foreground">
                  {shippingCents === 0 ? t('free') : formatPrice(shippingCents)}
                </span>
              </div>
              {shippingCents > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t('spendMoreFreeShipping', { amount: formatPrice(5000 - cart.subtotalCents) })}
                </p>
              )}
            </div>
            
            <div className="border-t border-border mt-6 pt-6 flex justify-between items-end">
              <span className="font-medium text-foreground text-lg">{t('total')}</span>
              <span className="font-serif text-3xl font-medium">{formatPrice(totalCents)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
