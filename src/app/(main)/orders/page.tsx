"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Loader2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { ApiOrder, getOrders } from "@/lib/api";

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    } else if (isAuthenticated) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (stateId: number) => {
    // Basic mapping based on PS states
    switch (stateId) {
      case 2: // Payment accepted
      case 3: // Processing
      case 4: // Shipped
      case 5: // Delivered
        return "bg-green-100 text-green-700";
      case 6: // Canceled
      case 8: // Error
        return "bg-red-100 text-red-700";
      default: // Awaiting check/bank wire
        return "bg-orange-100 text-orange-700";
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

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/account" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-navy">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-navy">Order History</h1>
              <p className="text-slate-500">Check the status of recent orders, manage returns, and discover similar products.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header/Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="hidden sm:block text-sm text-slate-500 font-medium">
              {orders.length} Order{orders.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 size={32} className="animate-spin text-slate-300" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Package size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">No orders found</h3>
              <p className="text-slate-500 mb-6">Looks like you haven't made any purchases yet.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-navy">Order {order.reference}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.current_state)}`}>
                        {getStatusText(order.current_state)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 flex flex-wrap gap-x-6 gap-y-2 mb-4">
                      <p>Placed on: <span className="font-semibold text-slate-700">{new Date(order.date_add).toLocaleDateString()}</span></p>
                      <p>Total: <span className="font-semibold text-slate-700">{order.total_paid.toFixed(2)} €</span></p>
                      <p>Payment: <span className="font-semibold text-slate-700">{order.payment}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center md:justify-end gap-3 shrink-0">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors">
                      View Invoice
                    </button>
                    <Link 
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary font-semibold text-sm rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
