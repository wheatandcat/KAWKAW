import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "カウカウ 管理画面",
  description: "KauKau 管理画面",
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
            <header className="border-b border-border bg-card px-6 py-4">
              <h1 className="text-lg font-semibold text-foreground">
                カウカウ 管理画面
              </h1>
            </header>
            <main className="px-6 py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
