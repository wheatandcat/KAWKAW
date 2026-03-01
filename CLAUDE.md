# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

カウカウ (KauKau) は買い物依存症防止を目的とした架空の日本語ECサイトシミュレーション。実際の決済は発生しない。

## モノレポ構成 (npm workspaces)

```
apps/public/        # ユーザー向け Next.js アプリ
apps/admin/         # 管理画面 (未実装)
packages/database/  # 共通 Drizzle ORM + スキーマ (@kawkaw/database)
```

## コマンド

```bash
# ルートから実行
npm run dev          # apps/public の開発サーバー起動
npm run build:public # apps/public のプロダクションビルド
npm run db:push      # DBスキーマを PostgreSQL に反映

# apps/public 内で実行
npm run dev          # next dev
npm run build        # next build
npm run start        # next start
npm run check        # TypeScript 型チェック

# packages/database 内で実行
npm run db:push      # drizzle-kit push
```

lint・テストコマンドは未定義。

## アーキテクチャ

### ディレクトリ構成

```
apps/public/
  app/                          # Next.js App Router
    api/reviews/route.ts        # POST /api/reviews
    api/reviews/[productId]/    # GET /api/reviews/:productId
    api/og/[productId]/         # GET /api/og/:productId (OG画像生成)
    product/[id]/               # 商品詳細ページ
    cart/, orders/, ranking/, timesale/, deals/, new-arrivals/
  components/                   # React コンポーネント
  hooks/                        # カスタムフック
  lib/
    cart-context.tsx            # CartProvider + useCartContext
    store.ts                    # useCart + useOrders (localStorage)
    products.ts                 # 商品データ 218件 (ハードコード)
  server/                       # サーバーサイドユーティリティ (DB系を除く)
    og-image.ts                 # OG画像生成 (satori + resvg)
    moderation.ts               # テキストモデレーション (OpenAI)
    lucide-svg-data.ts
    product-data.ts
  next.config.ts
  package.json
  vercel.json

packages/database/              # 共通パッケージ (name: @kawkaw/database)
  src/
    schema.ts                   # Drizzle スキーマ定義
    db.ts                       # DB接続 (pg.Pool + drizzle)
    storage.ts                  # IStorage インターフェース + DatabaseStorage
    index.ts                    # 全エクスポート
  drizzle.config.ts
```

パスエイリアス: `@/*` → `apps/public/` 起点

### データフロー

- **商品データ**: `apps/public/lib/products.ts` にハードコード (218商品)。API不使用。
- **カート・注文**: localStorage で永続化。サーバー通信なし。`useCart` / `useOrders` フックで管理。
- **レビュー**: PostgreSQL (Drizzle ORM) に保存。`/api/reviews/:productId` で GET/POST。
- **OG画像**: `/api/og/:productId` で satori + resvg により動的生成 (1200×630px、1時間インメモリキャッシュ)。

### DB パッケージの使用方法

```ts
import { storage, insertReviewSchema } from "@kawkaw/database";
```

`@kawkaw/database` は npm workspaces により `node_modules/@kawkaw/database` に symlink される。

### Storage パターン

`packages/database/src/storage.ts` の `IStorage` インターフェースで抽象化し、`DatabaseStorage` (Drizzle + PostgreSQL) を実装。`export const storage = new DatabaseStorage()` として singleton でエクスポート。

## デプロイ構成 (Vercel + Neon)

- **ホスティング**: Vercel (apps/public・apps/admin それぞれ別プロジェクト)
- **DB**: Neon PostgreSQL (Singapore リージョン、無料枠 0.5GB)
- **Vercel 設定**: Root Directory = `apps/public`
- **ルーティング** (Next.js App Router):
  - `GET /api/reviews/:productId` → `app/api/reviews/[productId]/route.ts`
  - `POST /api/reviews` → `app/api/reviews/route.ts`
  - `GET /api/og/:productId` → `app/api/og/[productId]/route.ts` (Node.js runtime)
  - その他 → SPA フォールバック

## 環境変数

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 接続文字列 (必須)。Neon の接続文字列を設定 |
| `OPENAI_API_KEY` | レビュー投稿時のテキストモデレーション用 |

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **スタイル**: React 18, TypeScript, Tailwind CSS v3, shadcn/ui (new-york)
- **状態管理**: TanStack Query + CartContext (localStorage)
- **DB**: PostgreSQL + Drizzle ORM (Neon)
- **OG画像**: satori + @resvg/resvg-js (`export const runtime = "nodejs"` 必須)
- **モノレポ**: npm workspaces
