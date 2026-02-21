import type { Request, Response, NextFunction } from "express";
import { getProductById } from "./product-data";

export function ogMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const match = req.path.match(/^\/product\/(\d+)$/);
    if (!match) return next();

    const ua = req.headers["user-agent"] || "";
    const isBot =
      /bot|crawler|spider|facebook|twitter|slack|discord|telegram|line|whatsapp|linkedin|preview|embed|fetch|curl/i.test(
        ua
      );

    if (!isBot) return next();

    const productId = match[1];
    const product = await getProductById(productId);

    if (!product) return next();

    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
    const baseUrl = `${protocol}://${host}`;
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

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
