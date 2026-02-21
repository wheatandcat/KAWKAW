interface ServerProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

let productsCache: ServerProduct[] | null = null;

export async function getProducts(): Promise<ServerProduct[]> {
  if (productsCache) return productsCache;
  const mod = await import("../client/src/lib/products");
  productsCache = mod.products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    category: p.category,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge,
  }));
  return productsCache!;
}

export async function getProductById(id: string): Promise<ServerProduct | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
