import { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { ProductIcon } from "@/components/product-icon";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Card className="group flex flex-col bg-white dark:bg-card border border-card-border">
      <Link href={`/product/${product.id}`} data-testid={`link-product-${product.id}`}>
        <div className="relative p-4 pb-2 cursor-pointer">
          {product.badge && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 text-[10px] z-10"
              data-testid={`badge-product-${product.id}`}
            >
              {product.badge}
            </Badge>
          )}
          <div className="flex items-center justify-center h-32 md:h-40">
            <ProductIcon name={product.image} className="w-16 h-16 md:w-20 md:h-20" />
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-4 pb-4 gap-2">
        <Link href={`/product/${product.id}`}>
          <h3
            className="text-sm font-medium leading-snug line-clamp-2 cursor-pointer text-foreground"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </Link>

        <Link href={`/product/${product.id}?scrollTo=reviews`} data-testid={`link-reviews-${product.id}`}>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-primary">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        </Link>

        <div className="flex items-baseline gap-2 flex-wrap mt-auto">
          <span className="text-lg font-bold text-foreground" data-testid={`text-price-${product.id}`}>
            ¥{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ¥{product.originalPrice.toLocaleString()}
          </span>
          <Badge variant="destructive" className="text-[10px] no-default-hover-elevate no-default-active-elevate">
            -{discount}%
          </Badge>
        </div>

        <Button
          size="sm"
          className="w-full mt-1 gap-1"
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product.id);
          }}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          カートに入れる
        </Button>
      </div>
    </Card>
  );
}
