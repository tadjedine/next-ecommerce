"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, X, Loader2, ShoppingBag, User, MapPin, Mail, Phone, Receipt, CreditCard, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { ApiGuestOrderDetails, getOrderByReference, getStripeSessionStatus } from "@/lib/api";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const id = searchParams.get("id");
  const reference = searchParams.get("ref");
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [orderDetails, setOrderDetails] = useState<ApiGuestOrderDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  // Stripe-specific state
  const [orderReference, setOrderReference] = useState<string | null>(reference);
  const [orderId, setOrderId] = useState<string | null>(id);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (sessionId) {
      // Stripe flow: poll for order creation
      clearCart();
      setIsProcessing(true);
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds max

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const result = await getStripeSessionStatus(sessionId);
          if (result.status === "complete" && result.data) {
            clearInterval(pollInterval);
            setOrderReference(result.data.reference);
            setOrderId(String(result.data.id));
            setOrderDetails(result.data);
            setIsProcessing(false);
          } else if (result.status === "unpaid") {
            clearInterval(pollInterval);
            router.push("/checkout");
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setIsProcessing(false);
            // Order will eventually be created by webhook — show a fallback message
          }
        } catch (err) {
          console.error("Failed to poll session status:", err);
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setIsProcessing(false);
          }
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    } else if (id && reference) {
      // COD flow: order already exists
      clearCart();
    } else {
      router.push("/");
    }
  }, [sessionId, id, reference, router, clearCart]);

  const handleViewSummary = async () => {
    if (!orderId || !orderReference) return;
    setShowSummary(true);

    if (!orderDetails) {
      setDetailsLoading(true);
      try {
        const data = await getOrderByReference(Number(orderId), orderReference);
        setOrderDetails(data);
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setDetailsLoading(false);
      }
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
      case 14: return "Awaiting Payment";
      default: return `Status #${stateId}`;
    }
  };

  const getStatusColor = (stateId: number) => {
    switch (stateId) {
      case 2: case 3: case 4: case 5:
        return "bg-green-100 text-green-700 border-green-200";
      case 6: case 8:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  if (!mounted) return null;
  
  // Redirect if no valid params
  if (!sessionId && (!id || !reference)) return null;

  // Processing state — waiting for webhook to create order
  if (isProcessing) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">Processing your payment...</h1>
        <p className="text-lg text-slate-500 mb-8">
          Your payment was successful! We&apos;re creating your order now. This will only take a moment.
        </p>
      </motion.div>
    );
  }

  // Show the reference from either flow
  const displayReference = orderReference || reference;
  if (!displayReference) return null;

  return (
    <>
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
          Your order has been placed successfully. We&apos;ll send you an email confirmation shortly.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-10 flex items-center justify-center border border-slate-100">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Order Reference</p>
            <p className="text-xl font-bold text-navy font-mono">{displayReference}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleViewSummary}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-navy px-8 py-3.5 rounded-full font-bold hover:border-primary hover:text-primary hover:shadow-md hover:shadow-primary/10 transition-all"
          >
            <Receipt size={20} /> Order Summary
          </button>
          <Link 
            href="/shop" 
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>

      {/* Order Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                  <Receipt size={22} className="text-primary" /> Order Summary
                </h3>
                <button 
                  onClick={() => setShowSummary(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {detailsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={32} className="animate-spin text-primary" />
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-6">
                    {/* Status & Reference */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(orderDetails.current_state)}`}>
                        {getStatusText(orderDetails.current_state)}
                      </span>
                      <span className="text-sm text-slate-500 font-mono">
                        Ref: {orderDetails.reference}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 ml-auto">
                        <Calendar size={14} />
                        {new Date(orderDetails.date_add).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Customer & Address Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Customer Info */}
                      {orderDetails.customer && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <User size={14} /> Customer
                          </h4>
                          <p className="font-semibold text-navy text-sm">
                            {orderDetails.customer.firstname} {orderDetails.customer.lastname}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Mail size={12} /> {orderDetails.customer.email}
                          </p>
                        </div>
                      )}

                      {/* Delivery Address */}
                      {orderDetails.delivery_address && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <MapPin size={14} /> Delivery Address
                          </h4>
                          <p className="font-semibold text-navy text-sm">
                            {orderDetails.delivery_address.firstname} {orderDetails.delivery_address.lastname}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{orderDetails.delivery_address.address1}</p>
                          {orderDetails.delivery_address.address2 && (
                            <p className="text-xs text-slate-500">{orderDetails.delivery_address.address2}</p>
                          )}
                          <p className="text-xs text-slate-500">
                            {orderDetails.delivery_address.postcode} {orderDetails.delivery_address.city}
                          </p>
                          {orderDetails.delivery_address.phone && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Phone size={12} /> {orderDetails.delivery_address.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                      <CreditCard size={16} className="text-slate-400" />
                      <span className="font-semibold">Payment:</span>
                      <span>{orderDetails.payment}</span>
                    </div>

                    {/* Products */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-bold text-navy text-sm flex items-center gap-1.5">
                          <ShoppingBag size={16} className="text-primary" /> Products Ordered
                        </h4>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          {orderDetails.details.reduce((acc, d) => acc + d.quantity, 0)} items
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {orderDetails.details.map((item, index) => (
                          <div key={index} className="px-4 py-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 shrink-0 flex items-center justify-center">
                              <ShoppingBag size={14} className="text-slate-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-navy text-sm line-clamp-1">{item.product_name}</h5>
                              <p className="text-xs text-slate-400">Qty: {item.quantity} × {item.unit_price.toFixed(2)} €</p>
                            </div>
                            <div className="font-bold text-primary text-sm shrink-0">
                              {item.total_price.toFixed(2)} €
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Products Subtotal</span>
                        <span className="font-semibold text-navy">{orderDetails.total_products.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Shipping</span>
                        <span className="font-semibold text-navy">
                          {orderDetails.total_shipping > 0 ? `${orderDetails.total_shipping.toFixed(2)} €` : <span className="text-green-600">Free</span>}
                        </span>
                      </div>
                      {orderDetails.total_discounts > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discounts</span>
                          <span className="font-semibold">-{orderDetails.total_discounts.toFixed(2)} €</span>
                        </div>
                      )}
                      <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between items-end">
                        <span className="font-bold text-navy">Total Paid</span>
                        <span className="font-extrabold text-xl text-primary">{orderDetails.total_paid.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <p>Could not load order details.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
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
