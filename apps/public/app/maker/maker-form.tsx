"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductIcon } from "@/components/product-icon";
import { Wand2 } from "lucide-react";
import { ICON_OPTIONS } from "@/lib/icon-registry";

export function MakerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [iconSearch, setIconSearch] = useState("");
  const [form, setForm] = useState({
    name: searchParams.get("name") ?? "",
    price: searchParams.get("price") ?? "",
    originalPrice: searchParams.get("originalPrice") ?? "",
    description: searchParams.get("description") ?? "",
    image: searchParams.get("image") ?? "sparkles",
    badge: searchParams.get("badge") ?? "",
    rating: searchParams.get("rating") ?? "4.0",
    reviewCount: searchParams.get("reviewCount") ?? "128",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice);

    if (!form.name || price <= 0 || originalPrice <= 0) return;

    const params = new URLSearchParams({
      name: form.name,
      price: String(price),
      originalPrice: String(originalPrice),
      description: form.description,
      image: form.image,
      rating: form.rating,
      reviewCount: form.reviewCount,
      ...(form.badge ? { badge: form.badge } : {}),
    });

    router.push(`/maker/preview?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Wand2 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">カウカウメーカー</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          あなただけの架空商品を作って共有しよう。実際には販売されません。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">商品名 *</Label>
              <span
                className={`text-xs ${form.name.length > 35 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {form.name.length}/35
              </span>
            </div>
            <Input
              id="name"
              placeholder="例: 夢の中で動くロボット掃除機"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value.slice(0, 35) })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">販売価格（円）*</Label>
              <Input
                id="price"
                type="number"
                placeholder="9800"
                min={1}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">参考価格（円）*</Label>
              <Input
                id="originalPrice"
                type="number"
                placeholder="19800"
                min={1}
                value={form.originalPrice}
                onChange={(e) =>
                  setForm({ ...form, originalPrice: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">商品説明 *</Label>
              <span
                className={`text-xs ${form.description.length > 256 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {form.description.length}/256
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="この商品の特徴を自由に書いてください"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value.slice(0, 256) })
              }
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">評価（1.0〜5.0）</Label>
              <Input
                id="rating"
                type="number"
                placeholder="4.0"
                min={1.0}
                max={5.0}
                step={0.1}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewCount">レビュー数</Label>
              <Input
                id="reviewCount"
                type="number"
                placeholder="128"
                min={0}
                value={form.reviewCount}
                onChange={(e) =>
                  setForm({ ...form, reviewCount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="badge">バッジ（任意）</Label>
              <span
                className={`text-xs ${form.badge.length > 10 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {form.badge.length}/10
              </span>
            </div>
            <Input
              id="badge"
              placeholder="例: 新発売、期間限定"
              value={form.badge}
              onChange={(e) =>
                setForm({ ...form, badge: e.target.value.slice(0, 10) })
              }
            />
          </div>

          <div className="space-y-3">
            <Label>アイコンを選ぶ</Label>
            <Input
              placeholder="アイコン名で検索（例: star, heart）"
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
            />
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {ICON_OPTIONS.filter((icon) =>
                icon.includes(iconSearch.toLowerCase()),
              ).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, image: icon })}
                  className={`p-2 rounded-md flex items-center justify-center transition-colors ${
                    form.image === icon
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "hover:bg-muted"
                  }`}
                  title={icon}
                >
                  <ProductIcon name={icon} className="w-5 h-5" />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              選択中: {form.image}
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2">
            <Wand2 className="w-5 h-5" />
            作成する
          </Button>
        </form>
      </div>
    </div>
  );
}
