"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Calendar, CreditCard, Receipt, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { ApiOrder, getOrder } from "@/lib/api";

export default function OrderDetailsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    } else if (isAuthenticated && id) {
      fetchOrderDetails();
    }
  }, [authLoading, isAuthenticated, id, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrder(Number(id));
      setOrder(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (stateId: number) => {
    switch (stateId) {
      case 2: // Payment accepted
      case 3: // Processing
      case 4: // Shipped
      case 5: // Delivered
        return "bg-green-100 text-green-700 border-green-200";
      case 6: // Canceled
      case 8: // Error
        return "bg-red-100 text-red-700 border-red-200";
      default: // Awaiting check/bank wire
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  const getStatusText = (stateId: number) => {
    switch (stateId) {
      case 2: return "Payment Accepted";
      case 3: return "Processing";
      case 4: return "Shipped";
      case 5: return "Delivered";
      case 6: return "Canceled";
      case 8: return "Error";
      case 10: return "Awaiting Bank Wire";
      case 13: return "Awaiting Cash on Delivery";
      default: return `Status #${stateId}`;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-navy mb-4">Error Loading Order</h2>
            <p className="text-slate-500 mb-6">{error || "Order details could not be found."}</p>
            <Link 
              href="/orders" 
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft size={16} /> Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Back navigation */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/orders" className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-navy shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Order Details</div>
            <h1 className="text-3xl font-extrabold text-navy">Order : {order.reference}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main order content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Current Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.current_state)}`}>
                    {getStatusText(order.current_state)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={18} className="text-slate-400" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Date Placed</span>
                    <span className="font-semibold text-slate-700">{new Date(order.date_add).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CreditCard size={18} className="text-slate-400" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Payment</span>
                    <span className="font-semibold text-slate-700">{order.payment}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-navy text-lg flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" /> Products Ordered
                </h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                  {order.details?.reduce((acc, curr) => acc + curr.quantity, 0) || 0} items
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.details?.map((item, index) => (
                  <div key={index} className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-lg border border-slate-100 shrink-0 flex items-center justify-center relative overflow-hidden">
                      <ShoppingBag size={18} className="text-slate-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-navy text-sm sm:text-base line-clamp-1">{item.product_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">ID: #{item.product_id}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-slate-700">{item.unit_price.toFixed(2)} €</div>
                      <div className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</div>
                      <div className="text-sm font-bold text-primary mt-1">{item.total_price.toFixed(2)} €</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pricing breakdown sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
                <Receipt size={20} className="text-primary" /> Invoice Summary
              </h3>

              <div className="space-y-3 pb-6 border-b border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Products Subtotal</span>
                  <span className="font-semibold text-navy">{(order.total_products ?? (order.total_paid - (order.total_shipping ?? 0) + (order.total_discounts ?? 0))).toFixed(2)} €</span>
                </div>
                
                {order.total_shipping !== undefined && order.total_shipping > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-semibold text-navy">{order.total_shipping.toFixed(2)} €</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                )}

                {order.total_discounts !== undefined && order.total_discounts > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discounts Applied</span>
                    <span className="font-semibold">-{order.total_discounts.toFixed(2)} €</span>
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-between items-end">
                <div>
                  <span className="block text-xs uppercase font-bold text-slate-400">Total Paid</span>
                  <span className="font-extrabold text-2xl text-primary">{order.total_paid.toFixed(2)} €</span>
                </div>
                
                <span className="text-xs text-slate-400 font-medium">Taxes Included</span>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
              <h4 className="font-bold text-navy text-sm mb-2">Need help with your order?</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                If you have questions about this order, shipping delay or payments, feel free to contact our customer service.
              </p>
              <button 
                onClick={() => alert("Support ticket creation is currently mock in v1.")}
                className="w-full text-center py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
