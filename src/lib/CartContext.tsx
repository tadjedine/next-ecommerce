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

// Hardcoded customer ID until auth integration
const CUSTOMER_ID = 8;

interface CartContextValue {
  cart: ApiCart | null;
  items: ApiCartItem[];
  totalQuantity: number;
  subtotal: number;
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getOrCreateCart(CUSTOMER_ID);
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId: number, quantity: number = 1) => {
    try {
      const data = await apiAddItem(CUSTOMER_ID, productId, quantity);
      setCart(data);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (productId: number, quantity: number) => {
    try {
      const data = await apiUpdateItem(CUSTOMER_ID, productId, quantity);
      setCart(data);
    } catch (err) {
      console.error("Failed to update cart item:", err);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (productId: number) => {
    try {
      const data = await apiRemoveItem(CUSTOMER_ID, productId);
      setCart(data);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      throw err;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items ?? [],
        totalQuantity: cart?.total_quantity ?? 0,
        subtotal: cart?.subtotal ?? 0,
        loading,
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
