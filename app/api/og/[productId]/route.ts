export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generateOgImage } from "@/server/og-image";
import { getProductById } from "@/server/product-data";

const ogCache = new Map<string, { png: Buffer; ts: number }>();
const OG_CACHE_TTL = 1000 * 60 * 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const cached = ogCache.get(productId);
    if (cached && Date.now() - cached.ts < OG_CACHE_TTL) {
      return new Response(cached.png, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const png = await generateOgImage(product);
    ogCache.set(productId, { png, ts: Date.now() });

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("OG image generation error:", error);
    return NextResponse.json({ message: "Failed to generate image" }, { status: 500 });
  }
}
