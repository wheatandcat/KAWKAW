"use client";

import { useState, useEffect, useCallback } from "react";
import { CartItem, Order } from "./types";
import { products } from "./products";

const CART_KEY = "kaukau-cart";
const ORDERS_KEY = "kaukau-orders";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(CART_KEY, [])
  );

  useEffect(() => {
    saveToStorage(CART_KEY, cart);
  }, [cart]);

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const product = products.find((p) => p.id === productId);
      if (!product) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>(ORDERS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders);
  }, [orders]);

  const placeOrder = useCallback((cart: CartItem[]): Order => {
    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      total: cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      date: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  return { orders, placeOrder };
}
