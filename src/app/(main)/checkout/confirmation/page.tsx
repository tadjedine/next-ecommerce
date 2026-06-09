"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const reference = searchParams.get("ref");
  const router = useRouter();
  const { refreshCart } = useCart();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!id || !reference) {
      router.push("/");
    } else {
      // Clear cart on frontend after successful order
      refreshCart();
    }
  }, [id, reference, router, refreshCart]);

  if (!mounted || !id || !reference) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 to-emerald-500"></div>
      
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 size={48} className="text-green-500" />
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">Thank you for your order!</h1>
      <p className="text-lg text-slate-500 mb-8">
        Your order has been placed successfully. We'll send you an email confirmation shortly.
      </p>

      <div className="bg-slate-50 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-center gap-6 border border-slate-100">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Order Reference</p>
          <p className="text-xl font-bold text-navy font-mono">{reference}</p>
        </div>
        <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
          <p className="text-xl font-bold text-navy font-mono">#{id}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/orders" 
          className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-navy px-8 py-3.5 rounded-full font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <Package size={20} /> View Order History
        </Link>
        <Link 
          href="/shop" 
          className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          Continue Shopping <ArrowRight size={20} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center px-6">
      <Suspense fallback={<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>}>
        <ConfirmationContent />
      </Suspense>
    </main>
  );
}
