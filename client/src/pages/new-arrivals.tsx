import { useState, useMemo } from "react";
import { products, categories } from "@/lib/products";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/product-icon";
import { PackagePlus, Star, ShoppingCart, Clock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

function getNewArrivals(): (Product & { daysAgo: number; isNew: boolean; isHot: boolean })[] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const rng = (i: number) => ((dayOfYear * 7919 + 104729 + i * 1637) % 233280) / 233280;

  return [...products]
    .map((p, idx) => {
      const daysAgo = Math.floor(rng(parseInt(p.id) * 3) * 30);
      const isNew = daysAgo <= 7;
      const isHot = rng(parseInt(p.id) * 5 + 1) > 0.7;
      return { ...p, daysAgo, isNew, isHot };
    })
    .sort((a, b) => a.daysAgo - b.daysAgo);
}

function formatDaysAgo(days: number): string {
  if (days === 0) return "本日入荷";
  if (days === 1) return "昨日入荷";
  if (days <= 7) return `${days}日前に入荷`;
  if (days <= 14) return "先週入荷";
  return `${days}日前に入荷`;
}

interface NewArrivalsProps {
  onAddToCart: (id: string) => void;
}

export default function NewArrivalsPage({ onAddToCart }: NewArrivalsProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [allItems] = useState(() => getNewArrivals());

  const filtered = useMemo(() => {
    if (selectedCategory === "すべて") return allItems;
    return allItems.filter((p) => p.category === selectedCategory);
  }, [allItems, selectedCategory]);

  const handleAdd = (id: string, name: string) => {
    onAddToCart(id);
    toast({ title: "カートに追加しました", description: name });
  };

  const todayItems = filtered.filter((p) => p.daysAgo === 0);
  const thisWeekItems = filtered.filter((p) => p.daysAgo >= 1 && p.daysAgo <= 7);
  const olderItems = filtered.filter((p) => p.daysAgo > 7);

  const renderSection = (title: string, icon: React.ReactNode, items: typeof filtered, testId: string) => {
    if (items.length === 0) return null;
    return (
      <section data-testid={testId}>
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">
            {items.length}件
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((product) => {
            const discount = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-card border border-card-border rounded-md flex flex-col"
                data-testid={`new-item-${product.id}`}
              >
                <Link href={`/product/${product.id}`} data-testid={`new-link-${product.id}`}>
                  <div className="relative p-3 pb-1 cursor-pointer">
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
                      {product.isNew && (
                        <Badge variant="default" className="text-[10px]">NEW</Badge>
                      )}
                      {product.isHot && (
                        <Badge variant="destructive" className="text-[10px] no-default-hover-elevate no-default-active-elevate">HOT</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center h-28">
                      <ProductIcon name={product.image} className="w-12 h-12" />
                    </div>
                  </div>
                </Link>

                <div className="flex flex-col flex-1 px-3 pb-3 gap-1.5">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs font-medium text-foreground line-clamp-2 cursor-pointer hover:underline" data-testid={`new-name-${product.id}`}>
                      {product.name}
                    </h3>
                  </Link>

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
                    <span className="text-[10px] text-muted-foreground">
                      ({product.reviewCount.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDaysAgo(product.daysAgo)}
                  </div>

                  <div className="flex items-baseline gap-1.5 flex-wrap mt-auto">
                    <span className="text-sm font-bold text-foreground">
                      ¥{product.price.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-[9px] no-default-hover-elevate no-default-active-elevate">
                      -{discount}%
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    className="w-full gap-1 mt-1"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAdd(product.id, product.name);
                    }}
                    data-testid={`new-add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    カートに入れる
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/10 p-2 rounded-md">
              <PackagePlus className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-newarrivals-title">
                新着アイテム
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                最近入荷した架空の新商品をチェック！見逃せない架空アイテムが続々登場。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="shrink-0"
              data-testid={`button-new-category-${cat}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8 space-y-8">
        {renderSection(
          "本日入荷",
          <Sparkles className="w-5 h-5 text-amber-500" />,
          todayItems,
          "section-today"
        )}
        {renderSection(
          "今週の新着",
          <PackagePlus className="w-5 h-5 text-blue-500" />,
          thisWeekItems,
          "section-thisweek"
        )}
        {renderSection(
          "最近の入荷",
          <Clock className="w-5 h-5 text-muted-foreground" />,
          olderItems,
          "section-older"
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackagePlus className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-foreground">このカテゴリの新着はありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
