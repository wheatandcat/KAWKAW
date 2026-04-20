"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductIcon } from "@/components/product-icon";
import { ReviewSection } from "@/components/review-section";
import { useCartContext } from "@/lib/cart-context";

interface ProductDetailClientProps {
  id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const { handleAddToCart } = useCartContext();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const reviewsRef = useRef<HTMLDivElement>(null);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const product = products.find((p) => p.id === id);

  const relatedProducts = product
    ? (() => {
        const filtered = products.filter(
          (p) =>
            p.category === product.category &&
            p.id !== product.id &&
            !p.disabled,
        );
        // 時間帯でシャッフル (1時間ごとに順番が変わる)
        const seed = Math.floor(Date.now() / 3_600_000);
        const seededRand = (n: number) => {
          const x = Math.sin(seed + n) * 10000;
          return x - Math.floor(x);
        };
        return filtered
          .map((p, i) => ({ p, r: seededRand(i) }))
          .sort((a, b) => a.r - b.r)
          .map(({ p }) => p)
          .slice(0, 12);
      })()
    : [];

  const scrollRelated = (dir: "left" | "right") => {
    if (!relatedScrollRef.current) return;
    relatedScrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (scrollTo === "reviews" && reviewsRef.current) {
      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [id, searchParams]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium">商品が見つかりません</p>
        <Link href="/">
          <Button variant="outline" size="sm" className="mt-4">
            トップに戻る
          </Button>
        </Link>
      </div>
    );
  }

  if (product.disabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium">申し訳ございません。</p>
        <p className="text-base text-muted-foreground mt-2">
          入力された架空商品は、時空倫理委員会の指導に基づき永久封印いたしました。
        </p>
        <Link href="/">
          <Button variant="outline" size="sm" className="mt-6">
            トップに戻る
          </Button>
        </Link>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleAdd = () => {
    handleAddToCart(product.id);
    toast({
      title: "カートに追加しました",
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 mb-4 text-muted-foreground"
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4" />
            商品一覧に戻る
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="flex items-center justify-center bg-card border border-card-border rounded-md p-8">
            <ProductIcon
              name={product.image}
              className="w-32 h-32 md:w-40 md:h-40"
            />
          </div>

          <div className="flex flex-col gap-4">
            {product.badge && (
              <Badge variant="secondary" className="self-start">
                {product.badge}
              </Badge>
            )}

            <h1
              className="text-xl md:text-2xl font-bold text-foreground"
              data-testid="text-product-title"
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-primary font-medium">
                {product.rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount.toLocaleString()}件の評価)
              </span>
            </div>

            <div className="border-t border-b py-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <Badge
                  variant="destructive"
                  className="no-default-hover-elevate no-default-active-elevate"
                >
                  -{discount}% OFF
                </Badge>
                <span
                  className="text-2xl md:text-3xl font-bold text-foreground"
                  data-testid="text-detail-price"
                >
                  ¥{product.price.toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-sm text-muted-foreground">
                  参考価格:{" "}
                  <span className="line-through">
                    ¥{product.originalPrice.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>

            <p
              className="text-sm text-muted-foreground leading-relaxed"
              data-testid="text-product-description"
            >
              {product.description}
            </p>

            <Card className="bg-card border-card-border p-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>架空配送: 明日お届け（時空を超えて）</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>架空保証: 永久保証付き</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>架空返品: 思念だけで返品可能</span>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              className="w-full gap-2 mt-2"
              onClick={handleAdd}
              data-testid="button-add-to-cart-detail"
            >
              <ShoppingCart className="w-5 h-5" />
              カートに入れる
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={async () => {
                const url = window.location.href;
                const shareData = {
                  title: product.name,
                  text: product.description,
                  url,
                };
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch {}
                } else {
                  await navigator.clipboard.writeText(url);
                  toast({
                    title: "URLをコピーしました",
                    description: "クリップボードにコピーされました",
                  });
                }
              }}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4" />
              共有する
            </Button>

            <p className="text-[10px] text-muted-foreground text-center">
              ※これは架空の商品です。実際には購入されません。
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold">この商品に関連する商品</h2>
          </div>
          <div className="relative group">
            <button
              onClick={() => scrollRelated("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-background border border-border rounded-full w-8 h-8 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="前へ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div
              ref={relatedScrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedProducts.map((rp) => {
                const rpDiscount = Math.round(
                  ((rp.originalPrice - rp.price) / rp.originalPrice) * 100,
                );
                return (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.id}`}
                    className="shrink-0"
                  >
                    <Card className="w-36 p-3 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex items-center justify-center bg-muted rounded-md p-3 h-24">
                        <ProductIcon name={rp.image} className="w-14 h-14" />
                      </div>
                      <p className="text-xs font-medium line-clamp-3 leading-tight">
                        {rp.name}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${
                              i < Math.floor(rp.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-0.5">
                          ({rp.reviewCount.toLocaleString()})
                        </span>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge
                            variant="destructive"
                            className="text-[9px] px-1 py-0 no-default-hover-elevate no-default-active-elevate"
                          >
                            -{rpDiscount}%
                          </Badge>
                          <span className="text-sm font-bold">
                            ¥{rp.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          参考:{" "}
                          <span className="line-through">
                            ¥{rp.originalPrice.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => scrollRelated("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-background border border-border rounded-full w-8 h-8 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="次へ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div ref={reviewsRef}>
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
