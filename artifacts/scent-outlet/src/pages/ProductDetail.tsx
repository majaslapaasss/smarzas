import { useState } from 'react';
import { useRoute } from 'wouter';
import { useGetProduct, useAddCartItem, getGetCartQueryKey } from '@workspace/api-client-react';
import { useCartId, formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const productId = parseInt(params?.id || '0', 10);
  
  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: { enabled: !!productId }
  });
  
  const [quantity, setQuantity] = useState(1);
  const cartId = useCartId();
  const addCartItem = useAddCartItem();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdded, setIsAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="aspect-square bg-secondary/50 rounded-[2rem] animate-pulse"></div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <div className="pt-6 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-medium mb-4">Product Not Found</h2>
        <p className="text-muted-foreground">The fragrance you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addCartItem.mutate({
      cartId,
      data: { productId, quantity }
    }, {
      onSuccess: () => {
        setIsAdded(true);
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey(cartId) });
        toast({
          title: "Added to cart",
          description: `${quantity}x ${product.name} added to your bag.`,
        });
        setTimeout(() => setIsAdded(false), 2000);
      }
    });
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary/30 rounded-[2rem] sticky top-24">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-4 md:pt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              {product.brand}
            </span>
            <span className="h-1 w-1 rounded-full bg-border"></span>
            <span className="text-sm text-muted-foreground capitalize">
              {product.gender}
            </span>
            {product.featured && (
              <>
                <span className="h-1 w-1 rounded-full bg-border"></span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground font-normal">
                  Bestseller
                </Badge>
              </>
            )}
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-foreground mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="text-2xl font-medium text-foreground mb-8">
            {formatPrice(product.priceCents)}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="mb-10">
            <h3 className="font-medium text-sm text-foreground uppercase tracking-wider mb-4">Scent Notes</h3>
            <div className="flex flex-wrap gap-2">
              {product.scentNotes.map((note) => (
                <Badge key={note} variant="outline" className="bg-secondary/30 text-foreground px-4 py-1.5 font-normal text-sm rounded-full border-border/50">
                  {note}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            {isOutOfStock ? (
              <div className="p-4 bg-muted text-center rounded-2xl text-muted-foreground font-medium">
                Currently Out of Stock
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between border border-input rounded-full p-2 w-full sm:w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-50"
                    disabled={quantity <= 1 || addCartItem.isPending}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-foreground w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock || addCartItem.isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <Button 
                  size="lg" 
                  className={cn(
                    "flex-1 rounded-full h-14 text-base transition-all duration-300",
                    isAdded ? "bg-green-600 hover:bg-green-700 text-white" : ""
                  )}
                  onClick={handleAddToCart}
                  disabled={addCartItem.isPending}
                >
                  {isAdded ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : addCartItem.isPending ? (
                    "Adding..."
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {!isOutOfStock && product.stock <= 5 && (
              <p className="mt-4 text-sm text-destructive font-medium flex items-center justify-center sm:justify-start">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse mr-2"></span>
                Only {product.stock} left in stock - order soon
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
