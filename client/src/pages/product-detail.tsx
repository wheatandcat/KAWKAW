import { useParams, useSearch } from "wouter";
import { useEffect, useRef } from "react";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, ChevronLeft, Truck, Shield, RotateCcw, Package } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ProductIcon } from "@/components/product-icon";
import { ReviewSection } from "@/components/review-section";

interface ProductDetailProps {
  onAddToCart: (id: string) => void;
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const searchString = useSearch();
  const { toast } = useToast();
  const reviewsRef = useRef<HTMLDivElement>(null);
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    if (params.get("scrollTo") === "reviews" && reviewsRef.current) {
      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchString]);

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

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product.id);
    toast({
      title: "カートに追加しました",
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 mb-4 text-muted-foreground" data-testid="button-back">
            <ChevronLeft className="w-4 h-4" />
            商品一覧に戻る
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="flex items-center justify-center bg-card border border-card-border rounded-md p-8">
            <ProductIcon name={product.image} className="w-32 h-32 md:w-40 md:h-40" />
          </div>

          <div className="flex flex-col gap-4">
            {product.badge && (
              <Badge variant="secondary" className="self-start">{product.badge}</Badge>
            )}

            <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-product-title">
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
                <Badge variant="destructive" className="no-default-hover-elevate no-default-active-elevate">
                  -{discount}% OFF
                </Badge>
                <span className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-detail-price">
                  ¥{product.price.toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-sm text-muted-foreground">
                  参考価格: <span className="line-through">¥{product.originalPrice.toLocaleString()}</span>
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-product-description">
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

            <p className="text-[10px] text-muted-foreground text-center">
              ※これは架空の商品です。実際には購入されません。
            </p>
          </div>
        </div>
      </div>

      <div ref={reviewsRef}>
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
