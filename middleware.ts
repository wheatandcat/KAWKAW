import { products } from "./client/src/lib/products";

const BOT_UA =
  /bot|crawler|spider|facebook|twitter|slack|discord|telegram|line|whatsapp|linkedin|preview|embed|fetch|curl/i;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const match = url.pathname.match(/^\/product\/(\d+)$/);
  if (!match) return;

  const ua = req.headers.get("user-agent") || "";
  if (!BOT_UA.test(ua)) return;

  const productId = match[1];
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const baseUrl = `${url.protocol}//${url.host}`;
  const ogImageUrl = `${baseUrl}/api/og/${productId}`;
  const pageUrl = `${baseUrl}/product/${productId}`;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const title = `${product.name} - カウカウ`;
  const description = `¥${product.price.toLocaleString()} (-${discount}%) | ${product.category} | ${product.description.substring(0, 100)}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="カウカウ" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <p>リダイレクト中...</p>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export const config = {
  matcher: ["/product/:id*"],
};
