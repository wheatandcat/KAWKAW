export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
}
