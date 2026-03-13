import { Suspense } from "react";
import { MakerForm } from "./maker-form";

export const metadata = {
  title: "カウカウメーカー - カウカウ",
  description: "あなただけの架空商品を作って共有しよう",
};

export default function MakerPage() {
  return (
    <Suspense fallback={null}>
      <MakerForm />
    </Suspense>
  );
}
