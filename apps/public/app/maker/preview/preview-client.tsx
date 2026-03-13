"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  Wand2,
  Twitter,
  Download,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import { ProductIcon } from "@/components/product-icon";
import { useToast } from "@/hooks/use-toast";

// 4:3 のキャプチャサイズ (表示 600×450px → scale:2 で 1200×900px)
const CAPTURE_W = 600;
const CAPTURE_H = 450;

export function PreviewClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<"preview" | "saved">("preview");
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/.test(navigator.userAgent);

  const name = searchParams.get("name") || "架空の商品";
  const price = Number(searchParams.get("price")) || 9800;
  const originalPrice = Number(searchParams.get("originalPrice")) || 19800;
  const description =
    searchParams.get("description") || "これは架空の商品です。";
  const image = searchParams.get("image") || "sparkles";
  const badge = searchParams.get("badge") || null;
  const rating = Math.min(
    5,
    Math.max(1, Number(searchParams.get("rating")) || 4.0),
  );
  const reviewCount = Math.max(
    0,
    Number(searchParams.get("reviewCount")) || 128,
  );

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const captureScreenshot = async () => {
    if (!previewRef.current) return;
    setIsCapturing(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, {
        width: CAPTURE_W,
        height: CAPTURE_H,
        pixelRatio: 2,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      setCapturedBlob(blob);
      setCapturedImage(dataUrl);
      setDialogStep("preview");
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "エラーが発生しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kawkaw-maker_${name}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tweetText = `${name} #カウカウメーカー`;
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const saveAndProceed = async () => {
    if (!capturedBlob) return;

    const file = new File([capturedBlob], `kawkaw-maker_${name}.png`, {
      type: "image/png",
    });

    if (
      isIOS &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file], text: tweetText });
        setDialogOpen(false);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    downloadImage(capturedBlob);
    setDialogStep("saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div
          className="flex items-center justify-between mb-6"
          style={{ maxWidth: CAPTURE_W }}
        >
          <div className="flex items-center gap-2">
            <Link href="/maker">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                もう一度作る
              </Button>
            </Link>
            <Link href={`/maker/create?${searchParams.toString()}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Pencil className="w-3 h-3" />
                編集
              </Button>
            </Link>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Wand2 className="w-3 h-3" />
            プレビュー
          </Badge>
        </div>

        {/* 16:9 Webカード（キャプチャ対象） */}
        <div className="overflow-x-auto pb-2">
          <div
            ref={previewRef}
            style={{
              width: CAPTURE_W,
              height: CAPTURE_H,
              background: "#ffffff",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* 左: アイコンエリア */}
            <div
              style={{
                width: 220,
                flexShrink: 0,
                background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 24,
              }}
            >
              <ProductIcon name={image} className="w-24 h-24" />
            </div>

            {/* 右: 商品情報 */}
            <div
              style={{
                flex: 1,
                padding: "22px 26px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* ブランド・バッジ行 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                {badge ? (
                  <span
                    style={{
                      fontSize: 11,
                      lineHeight: "18px",
                      background: "#f3f4f6",
                      color: "#374151",
                      borderRadius: 4,
                      padding: "2px 8px",
                      display: "inline-block",
                    }}
                  >
                    {badge}
                  </span>
                ) : (
                  <span />
                )}
                <span
                  style={{
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "#9ca3af",
                    fontWeight: 600,
                  }}
                >
                  #カウカウメーカー
                </span>
              </div>

              {/* タイトル: 折り返しあり・省略なし */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: "26px",
                  color: "#111827",
                  marginBottom: 10,
                }}
              >
                {name}
              </div>

              {/* 評価 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                      stroke={i < Math.floor(rating) ? "#fbbf24" : "#d1d5db"}
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    lineHeight: "14px",
                    fontWeight: 600,
                    color: "#2563eb",
                  }}
                >
                  {rating.toFixed(1)}
                </span>
                <span
                  style={{ fontSize: 12, lineHeight: "14px", color: "#6b7280" }}
                >
                  ({reviewCount.toLocaleString()}件の評価)
                </span>
              </div>

              {/* 説明: 折り返しあり・省略なし */}
              <div
                style={{
                  fontSize: 12,
                  lineHeight: "20px",
                  color: "#6b7280",
                  flex: 1,
                  overflow: "hidden",
                  marginBottom: 14,
                }}
              >
                {description}
              </div>

              {/* 区切り線 */}
              <div
                style={{ height: 1, background: "#e5e7eb", marginBottom: 14 }}
              />

              {/* 価格行 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 11,
                    lineHeight: "18px",
                    padding: "1px 8px",
                    borderRadius: 4,
                    fontWeight: 600,
                  }}
                >
                  -{discount}% OFF
                </span>
                <span
                  style={{
                    fontSize: 28,
                    lineHeight: "32px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  ¥{price.toLocaleString()}
                </span>
              </div>

              {/* 参考価格行 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ fontSize: 11, lineHeight: "18px", color: "#9ca3af" }}
                >
                  参考価格:{" "}
                  <span style={{ textDecoration: "line-through" }}>
                    ¥{originalPrice.toLocaleString()}
                  </span>
                </span>
                <span
                  style={{ fontSize: 10, lineHeight: "18px", color: "#d1d5db" }}
                >
                  ※架空の商品です
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 共有ボタン群 */}
        <div className="mt-6 space-y-3 max-w-[600px]">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={captureScreenshot}
            disabled={isCapturing}
          >
            <Twitter className="w-5 h-5" />
            {isCapturing
              ? "画像を作成中..."
              : isIOS
                ? "画像を共有する"
                : "画像を保存してXに投稿"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            <span className="font-bold">#カウカウメーカー</span>
            でSNSに投稿された商品はカウカウで逆輸入する可能性があるのでご容赦ください。
          </p>
        </div>
      </div>

      {/* スクリーンショット確認ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {dialogStep === "preview" ? (
            <>
              <DialogHeader>
                <DialogTitle>スクリーンショットを確認</DialogTitle>
              </DialogHeader>

              {capturedImage && (
                <div className="rounded-md overflow-hidden border">
                  <Image
                    src={capturedImage}
                    alt="スクリーンショットプレビュー"
                    width={1200}
                    height={900}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <DialogFooter className="gap-2 flex-col sm:flex-col">
                <Button className="w-full gap-2" onClick={saveAndProceed}>
                  <Twitter className="w-4 h-4" />
                  {isIOS ? "共有する" : "Xに投稿する"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    if (capturedBlob) downloadImage(capturedBlob);
                    setDialogOpen(false);
                  }}
                >
                  <Download className="w-4 h-4" />
                  画像だけ保存する
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setDialogOpen(false)}
                >
                  キャンセル
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  画像を保存しました
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">
                Xの投稿画面で保存した画像を添付してから投稿してください。
              </p>

              <DialogFooter className="gap-2 flex-col sm:flex-col">
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    window.open(xUrl, "_blank");
                    setDialogOpen(false);
                  }}
                >
                  <Twitter className="w-4 h-4" />
                  Xの投稿画面を開く
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setDialogOpen(false)}
                >
                  閉じる
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
