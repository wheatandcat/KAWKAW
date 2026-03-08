import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "カウカウ 管理画面",
  description: "KawKaw 管理画面",
};

const NAV_ITEMS = [
  { href: "/reviews", label: "レビュー管理" },
  { href: "/scan", label: "スパムスキャン" },
  { href: "/ng-words", label: "NGワード" },
];

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
            <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">
                カウカウ 管理画面
              </h1>
              <LogoutButton />
            </header>
            <nav className="border-b border-border bg-card px-6 flex gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <main className="px-6 py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
