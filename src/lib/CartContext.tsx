"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  ApiCart,
  ApiCartItem,
  getOrCreateCart,
  addCartItem as apiAddItem,
  updateCartItem as apiUpdateItem,
  removeCartItem as apiRemoveItem,
} from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface CartContextValue {
  cart: ApiCart | null;
  items: ApiCartItem[];
  totalQuantity: number;
  subtotal: number;
  loading: boolean;
  addItem: (productId: number, quantity?: number, productAttributeId?: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getOrCreateCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [authLoading, refreshCart]);

  const addItem = useCallback(async (productId: number, quantity: number = 1, productAttributeId: number = 0) => {
    if (!isAuthenticated) throw new Error("Must be logged in to add to cart");
    try {
      const data = await apiAddItem(productId, quantity, productAttributeId);
      setCart(data);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      throw err;
    }
  }, [isAuthenticated]);

  const updateItem = useCallback(async (productId: number, quantity: number) => {
    if (!isAuthenticated) throw new Error("Must be logged in to update cart");
    try {
      const data = await apiUpdateItem(productId, quantity);
      setCart(data);
    } catch (err) {
      console.error("Failed to update cart item:", err);
      throw err;
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (productId: number) => {
    if (!isAuthenticated) throw new Error("Must be logged in to remove cart item");
    try {
      const data = await apiRemoveItem(productId);
      setCart(data);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      throw err;
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items ?? [],
        totalQuantity: cart?.total_quantity ?? 0,
        subtotal: cart?.subtotal ?? 0,
        loading: loading || authLoading,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
