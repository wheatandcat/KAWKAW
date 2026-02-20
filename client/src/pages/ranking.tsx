import { useState, useMemo } from "react";
import { products, categories } from "@/lib/products";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/product-icon";
import { Trophy, Star, TrendingUp, ShoppingCart, Crown, Medal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SortMode = "popular" | "rating" | "reviews" | "discount";

interface RankingProps {
  onAddToCart: (id: string) => void;
}

export default function RankingPage({ onAddToCart }: RankingProps) {
  const [sortMode, setSortMode] = useState<SortMode>("popular");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const { toast } = useToast();

  const rankedProducts = useMemo(() => {
    let filtered = products.filter((p) =>
      selectedCategory === "すべて" || p.category === selectedCategory
    );

    switch (sortMode) {
      case "popular":
        filtered.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "discount":
        filtered.sort((a, b) => {
          const discA = (a.originalPrice - a.price) / a.originalPrice;
          const discB = (b.originalPrice - b.price) / b.originalPrice;
          return discB - discA;
        });
        break;
    }

    return filtered;
  }, [sortMode, selectedCategory]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return null;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
    if (rank === 2) return "bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700";
    if (rank === 3) return "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800";
    return "bg-card border-card-border";
  };

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: "popular", label: "人気順" },
    { key: "rating", label: "評価順" },
    { key: "reviews", label: "レビュー数順" },
    { key: "discount", label: "割引率順" },
  ];

  const handleAdd = (id: string, name: string) => {
    onAddToCart(id);
    toast({ title: "カートに追加しました", description: name });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/10 p-2 rounded-md">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-ranking-title">
                ランキング
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                架空商品の人気ランキング。みんなが気になっている商品をチェック！
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {sortOptions.map((opt) => (
            <Button
              key={opt.key}
              variant={sortMode === opt.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode(opt.key)}
              data-testid={`button-sort-${opt.key}`}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`button-rank-category-${cat}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="space-y-2">
          {rankedProducts.map((product, index) => {
            const rank = index + 1;
            const discount = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-md border transition-colors ${getRankBg(rank)}`}
                data-testid={`ranking-item-${rank}`}
              >
                <div className="flex items-center justify-center w-8 shrink-0">
                  {getRankIcon(rank) || (
                    <span className="text-lg font-bold text-muted-foreground">{rank}</span>
                  )}
                </div>

                <Link href={`/product/${product.id}`} data-testid={`ranking-link-${product.id}`}>
                  <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-background/50 rounded-md shrink-0 cursor-pointer">
                    <ProductIcon name={product.image} className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium text-foreground line-clamp-1 cursor-pointer hover:underline" data-testid={`ranking-name-${product.id}`}>
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="flex items-center gap-1">
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
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount.toLocaleString()}件)
                    </span>
                    {product.badge && (
                      <Badge variant="secondary" className="text-[10px]">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                    <span className="text-base font-bold text-foreground">
                      ¥{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ¥{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-[10px] no-default-hover-elevate no-default-active-elevate">
                      -{discount}%
                    </Badge>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => handleAdd(product.id, product.name)}
                  data-testid={`ranking-add-to-cart-${product.id}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
