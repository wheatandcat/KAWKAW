import { useState, useMemo } from "react";
import { products, categories } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Zap, Gift, Search } from "lucide-react";

interface HomeProps {
  searchQuery: string;
  onAddToCart: (id: string) => void;
}

export default function Home({ searchQuery, onAddToCart }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "すべて" || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                ようこそ、カウカウへ
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                全品100%架空。買い物欲を安全に満たせるフェイク通販サイトです。
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-card rounded-md px-3 py-2 border border-card-border">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium">タイムセール実施中</span>
            </div>
            <div className="flex items-center gap-1.5 bg-card rounded-md px-3 py-2 border border-card-border">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium">送料永久無料</span>
            </div>
            <div className="flex items-center gap-1.5 bg-card rounded-md px-3 py-2 border border-card-border">
              <Gift className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium">架空ポイント10倍</span>
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
              data-testid={`button-category-${cat}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-semibold text-foreground">
            {selectedCategory === "すべて" ? "すべての商品" : selectedCategory}
          </h2>
          <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">
            {filteredProducts.length}件
          </Badge>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-foreground">商品が見つかりません</p>
            <p className="text-sm text-muted-foreground mt-1">
              検索条件を変更してお試しください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="border-t bg-card py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            カウカウ.fake - これは架空の通販サイトです。実際の商品は存在しません。
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            買い物依存症の防止を目的としたシミュレーションサービスです。
          </p>
        </div>
      </footer>
    </div>
  );
}
