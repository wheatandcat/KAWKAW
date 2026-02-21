export interface ProductBase {
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
