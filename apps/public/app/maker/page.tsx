import Link from "next/link";
import type { Metadata } from "next";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MakerAiSection } from "./maker-intro-client";

export const metadata: Metadata = {
  title: "カウカウメーカー - カウカウ",
  description: "あなただけの架空商品を作って共有しよう",
};

export default function MakerIntroPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-lg mx-auto space-y-12">
        {/* ヒーロー */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wand2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            カウカウメーカー
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            あなただけの架空商品を作って共有しよう。
            <br />
            実際には販売されません。
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            SNSに投稿された商品は逆輸入する可能性があります。
          </p>
        </div>

        <Button asChild size="lg" className="w-full gap-2">
          <Link href="/maker/create">
            <Wand2 className="w-5 h-5" />
            はじめる
          </Link>
        </Button>

        <MakerAiSection />

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="underline hover:no-underline">
            カウカウトップへ
          </Link>
        </p>
      </div>
    </div>
  );
}
