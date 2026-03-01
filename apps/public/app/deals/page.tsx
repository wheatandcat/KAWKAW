"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/product-icon";
import { Tag, Star, ShoppingCart, Percent, Gift, Sparkles, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";
import { useCartContext } from "@/lib/cart-context";

function getDailyDeals(): {
  spotlightDeal: Product & { dealDiscount: number };
  categoryDeals: { category: string; products: (Product & { dealDiscount: number })[] }[];
  pickupDeals: (Product & { dealDiscount: number })[];
} {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const rng = (i: number) => ((dayOfYear * 9301 + 49297 + i * 1259) % 233280) / 233280;

  const shuffled = [...products].sort((a, b) => rng(parseInt(a.id)) - rng(parseInt(b.id)));

  const withDiscount = (p: Product, i: number) => ({
    ...p,
    dealDiscount: Math.floor(rng(i * 17 + 7) * 25) + 15,
  });

  const spotlightDeal = withDiscount(shuffled[0], 0);

  const categoryMap = new Map<string, Product[]>();
  shuffled.slice(1).forEach((p) => {
    const arr = categoryMap.get(p.category) || [];
    arr.push(p);
    categoryMap.set(p.category, arr);
  });

  const categoryDeals = Array.from(categoryMap.entries())
    .map(([category, prods]) => ({
      category,
      products: prods.slice(0, 3).map((p, i) => withDiscount(p, parseInt(p.id) + i)),
    }))
    .filter((c) => c.products.length >= 2);

  const usedIds = new Set([spotlightDeal.id, ...categoryDeals.flatMap((c) => c.products.map((p) => p.id))]);
  const pickupDeals = shuffled
    .filter((p) => !usedIds.has(p.id))
    .slice(0, 6)
    .map((p, i) => withDiscount(p, parseInt(p.id) + i + 100));

  return { spotlightDeal, categoryDeals, pickupDeals };
}

export default function DealsPage() {
  const { handleAddToCart } = useCartContext();
  const { toast } = useToast();
  const [deals] = useState(() => getDailyDeals());

  const handleAdd = (id: string, name: string) => {
    handleAddToCart(id);
    toast({ title: "カートに追加しました", description: name });
  };

  const { spotlightDeal, categoryDeals, pickupDeals } = deals;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-md">
              <Tag className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-deals-title">
                本日のお得情報
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                毎日更新される架空のお得情報。今日だけの特別価格をお見逃しなく！
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-8">
        <section data-testid="section-spotlight">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">本日の目玉商品</h2>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-5 md:p-8" data-testid={`spotlight-item-${spotlightDeal.id}`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link href={`/product/${spotlightDeal.id}`}>
                <div className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-background rounded-md cursor-pointer shrink-0">
                  <ProductIcon name={spotlightDeal.image} className="w-16 h-16 md:w-20 md:h-20" />
                </div>
              </Link>

              <div className="flex-1 text-center md:text-left">
                <Badge variant="destructive" className="no-default-hover-elevate no-default-active-elevate gap-1 mb-2">
                  <Percent className="w-3 h-3" />
                  本日限定 {spotlightDeal.dealDiscount}%OFF
                </Badge>

                <Link href={`/product/${spotlightDeal.id}`}>
                  <h3 className="text-lg md:text-xl font-bold text-foreground cursor-pointer hover:underline" data-testid={`spotlight-name-${spotlightDeal.id}`}>
                    {spotlightDeal.name}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {spotlightDeal.description}
                </p>

                <div className="flex items-center gap-1 mt-2 justify-center md:justify-start">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(spotlightDeal.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({spotlightDeal.reviewCount.toLocaleString()}件)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-3 justify-center md:justify-start flex-wrap">
                  <span className="text-2xl md:text-3xl font-bold text-destructive">
                    ¥{Math.floor(spotlightDeal.price * (1 - spotlightDeal.dealDiscount / 100)).toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ¥{spotlightDeal.price.toLocaleString()}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="mt-4 gap-2"
                  onClick={() => handleAdd(spotlightDeal.id, spotlightDeal.name)}
                  data-testid={`spotlight-add-to-cart-${spotlightDeal.id}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  カートに入れる
                </Button>
              </div>
            </div>
          </div>
        </section>

        {categoryDeals.map(({ category, products: catProducts }) => (
          <section key={category} data-testid={`section-category-${category}`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-foreground">{category}のお得情報</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catProducts.map((product) => {
                const dealPrice = Math.floor(product.price * (1 - product.dealDiscount / 100));
                return (
                  <div
                    key={product.id}
                    className="bg-card border border-card-border rounded-md p-4 flex flex-col gap-2"
                    data-testid={`deal-item-${product.id}`}
                  >
                    <div className="flex gap-3">
                      <Link href={`/product/${product.id}`}>
                        <div className="flex items-center justify-center w-16 h-16 bg-background rounded-md shrink-0 cursor-pointer">
                          <ProductIcon name={product.image} className="w-8 h-8" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-sm font-medium text-foreground line-clamp-2 cursor-pointer hover:underline" data-testid={`deal-name-${product.id}`}>
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <Badge variant="destructive" className="text-[10px] no-default-hover-elevate no-default-active-elevate">
                        -{product.dealDiscount}%
                      </Badge>
                      <span className="text-lg font-bold text-foreground">
                        ¥{dealPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full gap-1.5 mt-auto"
                      onClick={() => handleAdd(product.id, product.name)}
                      data-testid={`deal-add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      カートに入れる
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section data-testid="section-pickup">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-foreground">スタッフのおすすめ</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pickupDeals.map((product) => {
              const dealPrice = Math.floor(product.price * (1 - product.dealDiscount / 100));
              return (
                <div
                  key={product.id}
                  className="bg-card border border-card-border rounded-md p-3 flex flex-col gap-2"
                  data-testid={`pickup-item-${product.id}`}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="flex items-center justify-center h-20 bg-background rounded-md cursor-pointer">
                      <ProductIcon name={product.image} className="w-8 h-8" />
                    </div>
                  </Link>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs font-medium text-foreground line-clamp-2 cursor-pointer hover:underline">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-1 flex-wrap mt-auto">
                    <span className="text-sm font-bold text-foreground">
                      ¥{dealPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-[9px] no-default-hover-elevate no-default-active-elevate">
                      -{product.dealDiscount}%
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-1"
                    onClick={() => handleAdd(product.id, product.name)}
                    data-testid={`pickup-add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    カートへ
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
