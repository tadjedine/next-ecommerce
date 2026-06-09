"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { 
  ApiAddress, 
  ApiCheckoutSummary, 
  getAddresses, 
  getCheckoutSummary, 
  setCheckoutAddresses, 
  setCheckoutCarrier, 
  confirmCheckout,
  createAddress
} from "@/lib/api";

import CheckoutAddressStep from "@/app/components/checkout/CheckoutAddressStep";
import CheckoutCarrierStep from "@/app/components/checkout/CheckoutCarrierStep";
import CheckoutPaymentStep from "@/app/components/checkout/CheckoutPaymentStep";
import CheckoutSummary from "@/app/components/checkout/CheckoutSummary";
import AddressForm from "@/app/components/account/AddressForm";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, totalQuantity } = useCart();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [summary, setSummary] = useState<ApiCheckoutSummary | null>(null);

  // Selections
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    } else if (isAuthenticated) {
      if (totalQuantity === 0) {
        router.push("/cart"); // redirect if empty cart
      } else {
        initCheckout();
      }
    }
  }, [authLoading, isAuthenticated, totalQuantity, router]);

  const initCheckout = async () => {
    try {
      const [addrs, sum] = await Promise.all([
        getAddresses(),
        getCheckoutSummary()
      ]);
      setAddresses(addrs);
      setSummary(sum);

      // Pre-fill from summary or local storage or first item
      if (sum.delivery_address) {
        setSelectedAddress(sum.delivery_address.id);
      } else if (addrs.length > 0) {
        setSelectedAddress(addrs[0].id);
      }

      if (sum.carrier) {
        setSelectedCarrier(sum.carrier.id);
      } else {
        const prefC = localStorage.getItem("pref_carrier");
        if (prefC) setSelectedCarrier(parseInt(prefC));
      }

      const prefP = localStorage.getItem("pref_payment");
      if (prefP) setSelectedPayment(prefP);

    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddressSave = async (data: Partial<ApiAddress>) => {
    const newAddr = await createAddress(data);
    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr.id);
    setShowAddressForm(false);
  };

  const submitAddress = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    try {
      await setCheckoutAddresses(selectedAddress);
      const sum = await getCheckoutSummary();
      setSummary(sum);
      setCurrentStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitCarrier = async () => {
    if (!selectedCarrier) return;
    setLoading(true);
    try {
      await setCheckoutCarrier(selectedCarrier);
      const sum = await getCheckoutSummary();
      setSummary(sum);
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderClick = () => {
    if (!selectedPayment) return;
    setShowConfirmModal(true);
  };

  const submitOrder = async () => {
    if (!selectedPayment) return;
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const res = await confirmCheckout(selectedPayment);
      router.push(`/checkout/confirmation?id=${res.order_id}&ref=${res.reference}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to place order.");
      setLoading(false); // only disable loading if failed
    }
  };

  if (authLoading || !isAuthenticated || initialLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Shipping Address" },
    { num: 2, title: "Delivery Method" },
    { num: 3, title: "Payment" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-navy">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Steps */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;

                return (
                  <div key={step.num} className={`bg-white rounded-2xl border ${isActive ? 'border-primary shadow-md shadow-primary/10' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all duration-300`}>
                    <div 
                      className={`px-6 py-5 flex items-center gap-4 ${isCompleted ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                      onClick={() => { if (isCompleted) setCurrentStep(step.num as Step) }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${isCompleted ? 'bg-primary text-white' : isActive ? 'bg-blue-100 text-primary border-2 border-primary' : 'bg-slate-100 text-slate-400'}`}>
                        {isCompleted ? <Check size={16} className="stroke-[3]" /> : step.num}
                      </div>
                      <h2 className={`text-lg font-bold ${isActive ? 'text-navy' : 'text-slate-500'}`}>
                        {step.title}
                      </h2>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6 pt-2 border-t border-slate-100"
                        >
                          {step.num === 1 && (
                            <CheckoutAddressStep 
                              addresses={addresses} 
                              selectedId={selectedAddress} 
                              onSelect={setSelectedAddress} 
                              onAddNew={() => setShowAddressForm(true)}
                              onNext={submitAddress}
                              loading={loading}
                            />
                          )}
                          {step.num === 2 && (
                            <CheckoutCarrierStep 
                              selectedId={selectedCarrier}
                              onSelect={setSelectedCarrier}
                              onNext={submitCarrier}
                              onBack={() => setCurrentStep(1)}
                              loading={loading}
                            />
                          )}
                          {step.num === 3 && (
                            <CheckoutPaymentStep 
                              selectedMethod={selectedPayment}
                              onSelect={setSelectedPayment}
                              onNext={handlePlaceOrderClick}
                              onBack={() => setCurrentStep(2)}
                              loading={loading}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <CheckoutSummary summary={summary} items={items} />
          </div>
        </div>
      </div>

      {showAddressForm && (
        <AddressForm onSave={handleAddressSave} onCancel={() => setShowAddressForm(false)} />
      )}

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-navy mb-2">Confirm Your Order</h3>
              <p className="text-slate-600 mb-6">Are you sure you want to place this order for {summary?.total?.toFixed(2)} €? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitOrder}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors"
                >
                  Yes, Place Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
