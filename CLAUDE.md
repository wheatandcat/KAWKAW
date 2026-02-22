# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

カウカウ (KauKau) は買い物依存症防止を目的とした架空の日本語ECサイトシミュレーション。実際の決済は発生しない。

## コマンド

```bash
npm run dev       # 開発サーバー起動 (port 5000, Vite HMR付き)
npm run build     # プロダクションビルド (Replit向け: Vite+esbuild)
npm run start     # プロダクション起動
npm run check     # TypeScript型チェック
npm run db:push   # DBスキーマをPostgreSQLに反映
npx vite build    # フロントエンドのみビルド (Vercel用)
```

lint・テストコマンドは未定義。

## アーキテクチャ

### ディレクトリ構成

```
client/src/    # フロントエンド (React + TypeScript + Vite)
server/        # バックエンド (Express 5 + TypeScript)
shared/        # フロントとバックエンドで共有するコード
```

パスエイリアス: `@` → `client/src/`、`@shared` → `shared/`

### データフロー

- **商品データ**: `client/src/lib/products.ts` にハードコード (118商品)。APIは使用しない。
- **カート・注文**: localStorage で永続化。サーバー通信なし。`client/src/lib/store.ts` の `useCart` / `useOrders` フックで管理。
- **レビュー**: PostgreSQL (Drizzle ORM) に保存。`/api/reviews/:productId` で GET/POST。
- **OG画像**: `/api/og/:productId` でsatori + resvgにより動的生成 (1200×630px、1時間インメモリキャッシュ)。

### OGミドルウェア

SNSボットが `/product/:id` にアクセスすると `server/og-middleware.ts` が検知し、OGメタタグ付きHTMLを返す。

### ビルド

- フロントエンド: Vite → `dist/public/`
- サーバー: esbuild (CJS) → `dist/index.cjs`
- ビルドスクリプト: `script/build.ts`

### Storage パターン

`server/storage.ts` の `IStorage` インターフェースで抽象化し、`DatabaseStorage` (Drizzle + PostgreSQL) を実装。

## デプロイ構成 (Vercel + Neon)

- **ホスティング**: Vercel (Hobby プラン無料)
- **DB**: Neon PostgreSQL (Singapore リージョン、無料枠 0.5GB)
- **ルーティング**:
  - `/api/reviews/:productId` → `api/reviews/[productId].ts` (Serverless Function)
  - `POST /api/reviews` → `api/reviews.ts` (Serverless Function)
  - `/api/og/:productId` → `api/og/[productId].ts` (Serverless Function)
  - `/product/:id` のボットアクセス → `middleware.ts` (Edge Middleware、OG HTML返却)
  - その他 → `dist/public/index.html` (SPA fallback)

## 環境変数

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | PostgreSQL接続文字列 (必須)。Neon の接続文字列を設定 |
| `PORT` | ローカル開発時のサーバーポート (デフォルト: 5000) |

## 技術スタック

- **フロントエンド**: React 18, TypeScript, Tailwind CSS, shadcn/ui (new-yorkスタイル), wouter (ルーティング)
- **バックエンド**: Node.js, Express 5, tsx
- **DB**: PostgreSQL + Drizzle ORM
- **OG画像**: satori + @resvg/resvg-js
