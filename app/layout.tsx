import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "カウカウ - 架空のショッピングサイト",
  description: "買い物依存症防止のための架空ECサイト。実際の決済は発生しません。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
