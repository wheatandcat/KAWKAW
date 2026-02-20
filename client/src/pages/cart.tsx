import { CartItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { ProductIcon } from "@/components/product-icon";

interface CartPageProps {
  cart: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartPage({
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartPageProps) {
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold text-foreground">カートは空です</h2>
        <p className="text-sm text-muted-foreground mt-1">
          架空の商品をカートに入れてみましょう
        </p>
        <Link href="/">
          <Button className="mt-4" data-testid="button-continue-shopping">
            商品を見る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 mb-4 text-muted-foreground" data-testid="button-back-to-shop">
            <ChevronLeft className="w-4 h-4" />
            買い物を続ける
          </Button>
        </Link>

        <h1 className="text-xl font-bold text-foreground mb-4" data-testid="text-cart-title">
          ショッピングカート
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            {cart.map((item) => (
              <Card
                key={item.product.id}
                className="p-4 bg-card border-card-border"
                data-testid={`card-cart-item-${item.product.id}`}
              >
                <div className="flex gap-4">
                  <Link href={`/product/${item.product.id}`}>
                    <div className="shrink-0 cursor-pointer flex items-center justify-center w-16 md:w-20 bg-background rounded-md p-2">
                      <ProductIcon name={item.product.image} className="w-10 h-10 md:w-14 md:h-14" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="text-sm font-medium text-foreground line-clamp-1 cursor-pointer">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.product.category}
                    </p>
                    <p className="text-base font-bold text-foreground mt-1">
                      ¥{item.product.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span
                          className="w-8 text-center text-sm font-medium"
                          data-testid={`text-quantity-${item.product.id}`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive gap-1"
                        onClick={() => onRemove(item.product.id)}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">削除</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="md:col-span-1">
            <Card className="p-4 bg-card border-card-border sticky top-20">
              <h3 className="font-semibold text-foreground mb-3">注文の概要</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    小計 ({cart.reduce((s, i) => s + i.quantity, 0)}点)
                  </span>
                  <span className="font-medium">
                    ¥{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">配送料</span>
                  <span className="text-emerald-600 font-medium">無料</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">架空割引</span>
                  <span className="text-destructive font-medium">-¥0</span>
                </div>
              </div>
              <div className="border-t mt-3 pt-3">
                <div className="flex justify-between gap-2 items-baseline">
                  <span className="font-semibold text-foreground">合計（税込）</span>
                  <span className="text-xl font-bold text-primary" data-testid="text-cart-total">
                    ¥{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={onCheckout}
                data-testid="button-checkout"
              >
                レジに進む
              </Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                ※架空の購入です。お金はかかりません。
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
