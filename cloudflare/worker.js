/**
 * Cloudflare Worker: RSC-aware cache for Next.js App Router
 *
 * Next.js App Router adds `Vary: rsc, next-router-*` headers which
 * prevent Cloudflare from caching HTML. This Worker strips Vary and
 * creates separate cache keys for RSC payloads vs full HTML.
 */

const STATIC_TTL = 31536000; // 1 year
const HTML_TTL = 3600; // 1 hour

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 診断用エンドポイント (Worker が動いているか確認)
    if (url.pathname === "/__worker_check") {
      return new Response("Worker is running!", {
        headers: { "Content-Type": "text/plain", "X-Worker-Test": "active" },
      });
    }

    // Pass through non-GET requests
    if (request.method !== "GET") {
      return fetch(request);
    }

    // Pass through API routes (DB-backed, must not be cached)
    if (url.pathname.startsWith("/api/")) {
      return fetch(request);
    }

    // Build cache key that distinguishes RSC variants
    const isRSC = request.headers.get("RSC") === "1";
    const isPrefetch = request.headers.get("Next-Router-Prefetch") === "1";

    const cacheUrl = new URL(request.url);
    if (isRSC) cacheUrl.searchParams.set("__cf_rsc", "1");
    if (isPrefetch) cacheUrl.searchParams.set("__cf_prefetch", "1");

    const cacheKey = new Request(cacheUrl.toString());
    const cache = caches.default;

    // Return cached response if available
    const cached = await cache.match(cacheKey);
    if (cached) {
      const res = new Response(cached.body, cached);
      res.headers.set("X-CF-Cache", "HIT");
      res.headers.set("X-Worker-Running", "true");
      return res;
    }

    // Fetch from origin (Vercel)
    const response = await fetch(request);

    if (response.status !== 200) {
      return response;
    }

    // Determine TTL
    const isStaticAsset = url.pathname.startsWith("/_next/static/");
    const ttl = isStaticAsset ? STATIC_TTL : HTML_TTL;

    // Strip Vary (prevents caching) and set explicit Cache-Control
    const headers = new Headers(response.headers);
    headers.delete("vary");
    headers.set("Cache-Control", `public, max-age=${ttl}`);
    headers.set("X-CF-Cache", "MISS");
    headers.set("X-Worker-Running", "true");

    const responseToCache = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));

    return responseToCache;
  },
};
