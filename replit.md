# Overview

KauKau (カウカウ) is a fake Japanese e-commerce shopping site built as a full-stack web application. It simulates an online shopping experience with fictional/humorous products — users can browse products, search/filter by category, view product details, add items to a cart, "checkout" (no real payment), and view order history. All product data is hardcoded on the client side, and cart/order state is persisted via localStorage. The backend is a minimal Express server that currently serves the frontend and has a basic user storage interface, but no API routes are actively used by the frontend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React SPA)

- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight React router)
- **State Management**: Custom React hooks (`useCart`, `useOrders` in `client/src/lib/store.ts`) using `useState` with `localStorage` persistence. No Redux or Zustand.
- **Data Fetching**: `@tanstack/react-query` is installed and configured (`client/src/lib/queryClient.ts`) but not actively used since all product data is hardcoded client-side in `client/src/lib/products.ts`
- **UI Components**: shadcn/ui component library (new-york style) with Radix UI primitives. Components live in `client/src/components/ui/`. Tailwind CSS for styling with CSS variables for theming (light/dark mode support).
- **Icons**: Lucide React icons, mapped to products via `client/src/components/product-icon.tsx`
- **Language**: UI text is in Japanese

**Key frontend files:**
- `client/src/App.tsx` — Main app component with routing and global state
- `client/src/lib/products.ts` — Hardcoded product catalog (18 fictional products)
- `client/src/lib/store.ts` — Cart and order state management with localStorage
- `client/src/lib/types.ts` — TypeScript interfaces for Product, CartItem, Order
- `client/src/pages/` — Page components (home, product-detail, cart, checkout-complete, orders, not-found)

### Backend (Express)

- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via `tsx`
- **Entry point**: `server/index.ts`
- **Routes**: `server/routes.ts` — Currently empty, placeholder for API routes prefixed with `/api`
- **Storage**: `server/storage.ts` — Defines an `IStorage` interface with user CRUD methods. Currently uses `MemStorage` (in-memory Map). Designed to be swapped for a database-backed implementation.
- **Static serving**: In production, serves the built frontend from `dist/public`. In development, uses Vite dev server middleware with HMR (`server/vite.ts`).

### Database Schema

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema file**: `shared/schema.ts` — Currently defines only a `users` table with `id` (UUID), `username`, and `password` fields
- **Validation**: `drizzle-zod` generates Zod schemas from Drizzle table definitions
- **Migrations**: Drizzle Kit configured to output to `./migrations` directory. Push schema with `npm run db:push`
- **Connection**: Requires `DATABASE_URL` environment variable for PostgreSQL

**Important**: The database is configured but not actively connected in the running app — the storage layer uses in-memory storage. When adding database support, replace `MemStorage` with a Drizzle-based implementation using the PostgreSQL connection.

### Build System

- **Development**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Production build**: Custom build script (`script/build.ts`) that:
  1. Builds the React frontend with Vite (output to `dist/public`)
  2. Bundles the server with esbuild (output to `dist/index.cjs`)
  3. Selectively bundles certain dependencies to reduce cold start times
- **Production start**: `node dist/index.cjs`

### Path Aliases

- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

### Key Design Decisions

1. **Client-side data**: Products are hardcoded rather than fetched from an API. Cart and orders use localStorage. This makes the app work without any backend API but limits scalability.
2. **Storage interface pattern**: The `IStorage` interface in `server/storage.ts` provides an abstraction layer, making it easy to swap in a database implementation later.
3. **Shared schema**: The `shared/` directory contains code used by both frontend and backend (currently just the database schema and Zod types).

## External Dependencies

### Database
- **PostgreSQL** — Required via `DATABASE_URL` environment variable. Used with Drizzle ORM. Schema management via Drizzle Kit.

### Key NPM Packages
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui (Radix UI primitives), wouter, @tanstack/react-query, lucide-react, embla-carousel-react, react-day-picker, recharts, vaul, cmdk, react-hook-form, zod
- **Backend**: Express 5, Drizzle ORM, drizzle-zod, connect-pg-simple, express-session, passport/passport-local
- **Build**: esbuild, tsx, Vite

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in development
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)

### External Services
- No active external API integrations. Dependencies for OpenAI, Stripe, Google Generative AI, Nodemailer, and Multer are listed in the build allowlist but not currently used in the codebase.