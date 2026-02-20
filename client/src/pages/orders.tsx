import { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ClipboardList, Package } from "lucide-react";
import { Link } from "wouter";
import { ProductIcon } from "@/components/product-icon";

interface OrdersPageProps {
  orders: Order[];
}

export default function OrdersPage({ orders }: OrdersPageProps) {
  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ClipboardList className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold text-foreground">注文履歴がありません</h2>
        <p className="text-sm text-muted-foreground mt-1">
          架空の商品を購入すると、ここに履歴が表示されます
        </p>
        <Link href="/">
          <Button className="mt-4" data-testid="button-start-shopping">
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
          <Button variant="ghost" size="sm" className="gap-1 mb-4 text-muted-foreground" data-testid="button-back-home">
            <ChevronLeft className="w-4 h-4" />
            トップに戻る
          </Button>
        </Link>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground" data-testid="text-orders-title">
            注文履歴
          </h1>
          <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">
            {orders.length}件
          </Badge>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const dateStr = new Date(order.date).toLocaleString("ja-JP", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={order.id}
                className="bg-card border-card-border"
                data-testid={`card-order-${order.id}`}
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">
                        {order.id}
                      </span>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 dark:border-emerald-800 no-default-hover-elevate no-default-active-elevate">
                        架空配送完了
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {dateStr}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2.5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="shrink-0">
                          <ProductIcon name={item.image} className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ¥{item.price.toLocaleString()} x {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-foreground shrink-0">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-3 pt-3 flex justify-end gap-2 items-baseline">
                    <span className="text-sm text-muted-foreground">合計:</span>
                    <span className="text-base font-bold text-foreground">
                      ¥{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-8">
          すべての注文は架空です。実際の金銭のやり取りは発生していません。
        </p>
      </div>
    </div>
  );
}
