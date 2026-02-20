import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { useCart, useOrders } from "@/lib/store";
import { Order } from "@/lib/types";
import { useState, useCallback } from "react";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import CartPage from "@/pages/cart";
import CheckoutComplete from "@/pages/checkout-complete";
import OrdersPage from "@/pages/orders";
import RankingPage from "@/pages/ranking";
import TimeSalePage from "@/pages/timesale";
import DealsPage from "@/pages/deals";
import NotFound from "@/pages/not-found";
import { useToast } from "@/hooks/use-toast";

function AppContent() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { orders, placeOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleAddToCart = useCallback((productId: string) => {
    addToCart(productId);
    toast({
      title: "カートに追加しました",
    });
  }, [addToCart, toast]);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    const order = placeOrder(cart);
    setLastOrder(order);
    clearCart();
    navigate("/checkout-complete");
  }, [cart, placeOrder, clearCart, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Switch>
        <Route path="/">
          <Home searchQuery={searchQuery} onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/product/:id">
          <ProductDetail onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/cart">
          <CartPage
            cart={cart}
            cartTotal={cartTotal}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
          />
        </Route>
        <Route path="/checkout-complete">
          <CheckoutComplete order={lastOrder} />
        </Route>
        <Route path="/orders">
          <OrdersPage orders={orders} />
        </Route>
        <Route path="/ranking">
          <RankingPage onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/timesale">
          <TimeSalePage onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/deals">
          <DealsPage onAddToCart={handleAddToCart} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
