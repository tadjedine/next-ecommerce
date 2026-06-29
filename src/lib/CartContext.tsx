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
  updateItem: (productId: number, quantity: number, productAttributeId?: number) => Promise<void>;
  removeItem: (productId: number, productAttributeId?: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    // Only auto-load cart for authenticated users.
    // For guests, the cart is populated on the first addItem call.
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getOrCreateCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Reload cart when auth state changes (e.g., after login, the cart
  // may have been merged and we need the updated version)
  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [authLoading, isAuthenticated, refreshCart]);

  const addItem = useCallback(async (productId: number, quantity: number = 1, productAttributeId: number = 0) => {
    try {
      const data = await apiAddItem(productId, quantity, productAttributeId);
      setCart(data);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (productId: number, quantity: number, productAttributeId: number = 0) => {
    try {
      const data = await apiUpdateItem(productId, quantity, productAttributeId);
      setCart(data);
    } catch (err) {
      console.error("Failed to update cart item:", err);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (productId: number, productAttributeId: number = 0) => {
    try {
      const data = await apiRemoveItem(productId, productAttributeId);
      setCart(data);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      throw err;
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
  }, []);

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
        clearCart,
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

