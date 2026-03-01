import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@/lib/products";
import ProductDetailClient from "./product-detail-client";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return { title: "商品が見つかりません - カウカウ" };
  }
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const title = `${product.name} - カウカウ`;
  const description = `¥${product.price.toLocaleString()} (-${discount}%) | ${product.category} | ${product.description.substring(0, 100)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/api/og/${id}`],
      type: "website",
      siteName: "カウカウ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/${id}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <ProductDetailClient id={id} />
    </Suspense>
  );
}
