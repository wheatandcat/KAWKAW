"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CUSTOM_PROMPT } from "@/lib/custom-prompt";

export function MakerAiSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CUSTOM_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-xl p-6 space-y-5 bg-muted/30">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500 shrink-0" />
        <h2 className="font-black text-base">
          AIアシストで簡単にカウカウ構文を作成！？
        </h2>
      </div>

      <video
        src="https://cdn.kawkaw.app/maker_demo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-lg"
      />

      <p className="text-sm text-muted-foreground leading-relaxed">
        Google の <strong>Gemini</strong> に専用の Gem（カスタム
        AI）を作ると、ひと言指示するだけでカウカウメーカー用のリンクが自動生成されます。
      </p>

      <ol className="space-y-5 text-sm">
        {/* Step 1 */}
        <li className="space-y-2">
          <p className="font-semibold">1. Gemini で Gem を新規作成</p>
          <p className="text-muted-foreground">
            <Link
              href="https://gemini.google.com/gems/create"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline text-blue-600 hover:text-blue-800"
            >
              gemini.google.com/gems/create
              <ExternalLink className="w-3 h-3" />
            </Link>{" "}
            を開き、以下の設定で作成してください。
          </p>
          <div className="rounded-md border bg-background p-3 space-y-1 text-xs font-mono">
            <p>
              <span className="text-muted-foreground">名前：</span>
              カウカウ 架空商品開発部
            </p>
            <p>
              <span className="text-muted-foreground">説明：</span>
              架空商品を作成のお手伝いをします
            </p>
            <p>
              <span className="text-muted-foreground">カスタム指示：</span>
              下記プロンプトを貼り付け
            </p>
          </div>
        </li>

        {/* Step 2 */}
        <li className="space-y-2">
          <p className="font-semibold">2. プロンプトをコピーして貼り付け</p>
          <p className="text-muted-foreground">
            カスタム指示欄に以下のプロンプトをそのまま貼り付けてください。
          </p>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                カスタム指示をコピー
              </>
            )}
          </Button>

          <Accordion type="single" collapsible>
            <AccordionItem value="prompt" className="border rounded-md px-3">
              <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline py-2">
                カスタム指示を確認
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words max-h-64 overflow-y-auto font-mono bg-muted/50 rounded p-3">
                  {CUSTOM_PROMPT}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>

        {/* Step 3 */}
        <li className="space-y-2">
          <p className="font-semibold">3. Gem に話しかけるだけ</p>
          <p className="text-muted-foreground">作成した Gem に</p>
          <p className="rounded-md border bg-background px-3 py-2 text-xs font-mono">
            カウカウっぽい家具商品を作って
          </p>
          <p className="text-muted-foreground">
            と送るだけでカウカウメーカー用のリンクが生成されます。リンクをクリックするとそのまま商品プレビューが表示されます。
          </p>
        </li>
      </ol>
    </div>
  );
}
