import { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ProductIcon } from "@/components/product-icon";

interface CheckoutCompleteProps {
  order: Order | null;
}

export default function CheckoutComplete({ order }: CheckoutCompleteProps) {
  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">注文情報が見つかりません</p>
        <Link href="/">
          <Button className="mt-4">トップに戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-order-complete">
            ご購入ありがとうございました!
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            架空の注文が完了しました。実際の請求はありません。
          </p>
        </div>

        <Card className="p-4 bg-card border-card-border mb-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-foreground">注文詳細</h3>
            <span className="text-xs text-muted-foreground" data-testid="text-order-id">
              {order.id}
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="shrink-0">
                  <ProductIcon name={item.image} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-1">{item.name}</p>
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

          <div className="border-t mt-3 pt-3 flex justify-between gap-2 items-baseline">
            <span className="font-semibold text-foreground">合計</span>
            <span className="text-lg font-bold text-primary" data-testid="text-order-total">
              ¥{order.total.toLocaleString()}
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">架空配送ステータス</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ただいま時空の狭間を通過中です。到着予定：パラレルワールド時間で明日。
              </p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-1" data-testid="button-continue-shopping">
              買い物を続ける
            </Button>
          </Link>
          <Link href="/orders" className="flex-1">
            <Button className="w-full gap-1" data-testid="button-view-orders">
              注文履歴を見る
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-6">
          このサイトは買い物依存症防止のためのシミュレーションです。
          <br />
          実際の金銭のやり取りは一切発生しません。
        </p>
      </div>
    </div>
  );
}
