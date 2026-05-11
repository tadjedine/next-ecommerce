"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mockCatalogProducts } from "@/lib/mock/dummyData";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState(
    mockCatalogProducts.slice(0, 3).map((p, i) => ({
      ...p,
      cartId: `cart-${i}`,
      quantity: 1,
      selectedVariant: { size: p.variants?.sizes[0] || "M", color: p.variants?.colors[0].name || "Default" }
    }))
  );

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-soft">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-text-primary">Your Cart</h2>
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-bold">
                  {cartItems.length}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-bg-base rounded-full transition-colors text-text-muted"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">Your cart is empty</h3>
                  <p className="text-text-muted">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.cartId}
                      layout
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border-soft">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-text-primary line-clamp-1">{item.name}</h4>
                          <button 
                            onClick={() => removeItem(item.cartId)}
                            className="text-text-muted hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="text-xs text-text-muted mb-2">
                          {item.selectedVariant.color} / {item.selectedVariant.size}
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="font-bold text-primary">${item.price.toFixed(2)}</div>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQty(item.cartId, -1)}
                              className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center text-text-primary hover:bg-bg-base transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item.cartId, 1)}
                              className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-sm"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border-soft bg-surface">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-semibold text-text-muted">Subtotal</span>
                  <span className="text-xl font-extrabold text-text-primary">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button className="w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
                    Checkout
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full py-3 text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
