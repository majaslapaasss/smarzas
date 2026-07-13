import { Link } from 'wouter';
import { Product } from '@workspace/api-client-react';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group relative block h-full">
      <Card className="h-full overflow-hidden border-transparent bg-transparent hover:bg-card/50 transition-colors duration-300 hover:shadow-sm">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-secondary/50 rounded-2xl mb-4">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            {product.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                  Featured
                </Badge>
              </div>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="bg-destructive/10 text-destructive border-transparent">
                  Only {product.stock} left
                </Badge>
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Sold Out
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 px-2 pb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand}
            </span>
            <h3 className="font-serif text-lg font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="mt-auto pt-3 flex items-center justify-between">
              <span className="font-medium text-foreground">
                {formatPrice(product.priceCents)}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {product.gender}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
