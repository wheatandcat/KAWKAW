import { useState, useMemo, useEffect, useCallback } from "react";
import { products } from "@/lib/products";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/product-icon";
import { Zap, Star, ShoppingCart, Clock, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getTimeSaleProducts(): (Product & { extraDiscount: number; soldPercent: number; endsInMs: number })[] {
  const seed = Math.floor(Date.now() / (1000 * 60 * 60));
  const rng = (i: number) => ((seed * 9301 + 49297 + i * 1259) % 233280) / 233280;

  const sorted = [...products].sort((a, b) => rng(parseInt(a.id)) - rng(parseInt(b.id)));
  const selected = sorted.slice(0, 12);

  return selected.map((p, i) => {
    const extraDiscount = Math.floor(rng(i * 7 + 3) * 30) + 10;
    const soldPercent = Math.floor(rng(i * 13 + 5) * 60) + 20;
    const hoursLeft = (rng(i * 11 + 1) * 5 + 0.5);
    const endsInMs = Math.floor(hoursLeft * 60 * 60 * 1000);
    return { ...p, extraDiscount, soldPercent, endsInMs };
  });
}

function CountdownTimer({ endsInMs }: { endsInMs: number }) {
  const [remaining, setRemaining] = useState(endsInMs);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return (
    <div className="flex items-center gap-1 text-destructive font-mono text-sm font-bold" data-testid="countdown-timer">
      <Clock className="w-3.5 h-3.5" />
      <span>{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
    </div>
  );
}

function SoldBar({ percent }: { percent: number }) {
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            background: percent > 70 ? "#ef4444" : percent > 40 ? "#f59e0b" : "#22c55e",
          }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">
        {percent}% が購入済み
      </p>
    </div>
  );
}

interface TimeSaleProps {
  onAddToCart: (id: string) => void;
}

export default function TimeSalePage({ onAddToCart }: TimeSaleProps) {
  const { toast } = useToast();
  const [saleProducts] = useState(() => getTimeSaleProducts());

  const handleAdd = (id: string, name: string) => {
    onAddToCart(id);
    toast({ title: "カートに追加しました", description: name });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-start gap-3">
            <div className="bg-destructive/10 p-2 rounded-md">
              <Zap className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-timesale-title">
                タイムセール
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                期間限定の特別価格！急がないと売り切れちゃうかも（架空だけど）
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-card rounded-md px-3 py-2 border border-card-border">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium">最大50%OFF</span>
            </div>
            <div className="flex items-center gap-1.5 bg-card rounded-md px-3 py-2 border border-card-border">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium">数時間限定</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saleProducts.map((product) => {
            const salePrice = Math.floor(product.price * (1 - product.extraDiscount / 100));
            const totalDiscount = Math.round(
              ((product.originalPrice - salePrice) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-card border border-card-border rounded-md p-4 flex flex-col gap-3"
                data-testid={`timesale-item-${product.id}`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="no-default-hover-elevate no-default-active-elevate gap-1">
                    <Zap className="w-3 h-3" />
                    タイムセール
                  </Badge>
                  <CountdownTimer endsInMs={product.endsInMs} />
                </div>

                <div className="flex gap-3">
                  <Link href={`/product/${product.id}`} data-testid={`timesale-link-${product.id}`}>
                    <div className="flex items-center justify-center w-20 h-20 bg-background rounded-md shrink-0 cursor-pointer">
                      <ProductIcon name={product.image} className="w-10 h-10" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-sm font-medium text-foreground line-clamp-2 cursor-pointer hover:underline" data-testid={`timesale-name-${product.id}`}>
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mt-1">
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
                    -{totalDiscount}% OFF
                  </Badge>
                  <span className="text-xl font-bold text-destructive" data-testid={`timesale-price-${product.id}`}>
                    ¥{salePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 -mt-2">
                  <span className="text-xs text-muted-foreground">
                    通常価格: <span className="line-through">¥{product.price.toLocaleString()}</span>
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ¥{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <SoldBar percent={product.soldPercent} />

                <Button
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => handleAdd(product.id, product.name)}
                  data-testid={`timesale-add-to-cart-${product.id}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  カートに入れる
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
