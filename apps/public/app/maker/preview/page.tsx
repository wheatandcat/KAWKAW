import { Suspense } from "react";
import { PreviewClient } from "./preview-client";

export const metadata = {
  title: "商品プレビュー - カウカウメーカー",
};

export default function MakerPreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewClient />
    </Suspense>
  );
}
