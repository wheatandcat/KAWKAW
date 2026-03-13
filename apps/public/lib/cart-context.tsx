"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useCart, useOrders } from "@/lib/store";
import { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CartContextValue {
  cart: ReturnType<typeof useCart>["cart"];
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  lastOrder: Order | null;
  searchQuery: string;
  isCheckingOut: boolean;
  setSearchQuery: (q: string) => void;
  handleAddToCart: (productId: string) => void;
  handleCheckout: () => void;
  resetCheckingOut: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();
  const { orders, placeOrder } = useOrders();
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = useCallback(
    (productId: string) => {
      addToCart(productId);
      toast({ title: "カートに追加しました" });
    },
    [addToCart, toast],
  );

  const resetCheckingOut = useCallback(() => setIsCheckingOut(false), []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    const order = placeOrder(cart);
    setLastOrder(order);
    setIsCheckingOut(true);
    clearCart();
    setTimeout(() => {
      router.push("/checkout-complete");
    }, 500);
  }, [cart, placeOrder, clearCart, router]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        orders,
        lastOrder,
        searchQuery,
        isCheckingOut,
        resetCheckingOut,
        setSearchQuery,
        handleAddToCart,
        handleCheckout,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
