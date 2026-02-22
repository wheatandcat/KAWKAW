"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Package, Menu, X, Trophy, Flame, Clock, PackagePlus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCartContext } from "@/lib/cart-context";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, searchQuery, setSearchQuery } = useCartContext();

  return (
    <header className="sticky top-0 z-50 bg-[#131921] text-white">
      <div className="flex items-center gap-3 px-4 py-2">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-1 shrink-0 cursor-pointer">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-primary">カウカウ</span>
            <span className="text-[10px] text-gray-400 hidden md:block">.fake</span>
          </div>
        </Link>

        <div className="flex-1 max-w-2xl hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="架空の商品を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white text-foreground rounded-md border-0"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-1 hidden md:flex"
            onClick={() => router.push("/ranking")}
            data-testid="link-ranking"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs">ランキング</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-1 hidden md:flex"
            onClick={() => router.push("/orders")}
            data-testid="link-orders"
          >
            <Package className="w-5 h-5" />
            <span className="text-xs">注文履歴</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 relative"
            onClick={() => router.push("/cart")}
            data-testid="link-cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs ml-1 hidden md:inline">カート</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 min-w-5 flex items-center justify-center text-[10px] px-1"
                data-testid="badge-cart-count"
              >
                {cartCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="架空の商品を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white text-foreground rounded-md border-0"
              data-testid="input-search-mobile"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-2 w-full justify-start"
            onClick={() => { router.push("/ranking"); setMobileMenuOpen(false); }}
            data-testid="link-ranking-mobile"
          >
            <Trophy className="w-4 h-4" />
            ランキング
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-2 w-full justify-start"
            onClick={() => { router.push("/orders"); setMobileMenuOpen(false); }}
            data-testid="link-orders-mobile"
          >
            <Package className="w-4 h-4" />
            注文履歴
          </Button>

          <div className="border-t border-gray-600 my-1" />

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-2 w-full justify-start"
            onClick={() => { router.push("/deals"); setMobileMenuOpen(false); }}
            data-testid="link-deals-mobile"
          >
            <Flame className="w-4 h-4" />
            本日のお得情報
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-2 w-full justify-start"
            onClick={() => { router.push("/timesale"); setMobileMenuOpen(false); }}
            data-testid="link-timesale-mobile"
          >
            <Clock className="w-4 h-4" />
            タイムセール
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 gap-2 w-full justify-start"
            onClick={() => { router.push("/new-arrivals"); setMobileMenuOpen(false); }}
            data-testid="link-newarrivals-mobile"
          >
            <PackagePlus className="w-4 h-4" />
            新着アイテム
          </Button>

          <div className="border-t border-gray-600 my-1" />

          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary">
            <ShieldAlert className="w-4 h-4" />
            買い物依存防止モード
          </div>
        </div>
      )}

      <div className="bg-[#232f3e] px-4 py-1.5 text-xs text-gray-300 hidden md:block">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-medium text-white">全品架空</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/deals")}>本日のお得情報</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/timesale")}>タイムセール</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/new-arrivals")}>新着アイテム</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/ranking")}>ランキング</span>
          <span className="text-primary">買い物依存防止モード</span>
        </div>
      </div>
    </header>
  );
}
