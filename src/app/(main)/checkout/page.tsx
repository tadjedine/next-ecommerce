"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { 
  ApiAddress, 
  ApiCarrier,
  ApiCheckoutSummary, 
  getAddresses, 
  getCheckoutSummary, 
  setCheckoutAddresses, 
  setCheckoutCarrier, 
  confirmCheckout,
  createAddress,
  getCarriers,
  getCountries,
  ApiCountry,
  guestCheckout,
  GuestCheckoutData,
} from "@/lib/api";

import CheckoutAddressStep from "@/app/components/checkout/CheckoutAddressStep";
import CheckoutCarrierStep from "@/app/components/checkout/CheckoutCarrierStep";
import CheckoutPaymentStep from "@/app/components/checkout/CheckoutPaymentStep";
import CheckoutSummary from "@/app/components/checkout/CheckoutSummary";
import AddressForm from "@/app/components/account/AddressForm";

type CheckoutMode = "choosing" | "guest" | "auth";
type Step = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, totalQuantity } = useCart();
  const router = useRouter();

  const [mode, setMode] = useState<CheckoutMode>("choosing");
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Auth checkout state
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [summary, setSummary] = useState<ApiCheckoutSummary | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Guest checkout state
  const [guestEmail, setGuestEmail] = useState("");
  const [guestFirstname, setGuestFirstname] = useState("");
  const [guestLastname, setGuestLastname] = useState("");
  const [guestAddress1, setGuestAddress1] = useState("");
  const [guestAddress2, setGuestAddress2] = useState("");
  const [guestCity, setGuestCity] = useState("");
  const [guestPostcode, setGuestPostcode] = useState("");
  const [guestCountry, setGuestCountry] = useState<number>(0);
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCarrier, setGuestCarrier] = useState<number | null>(null);
  const [guestPayment, setGuestPayment] = useState<string | null>(null);
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [carriers, setCarriers] = useState<ApiCarrier[]>([]);
  const [carriersLoading, setCarriersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      setMode("auth");
      if (totalQuantity === 0) {
        router.push("/cart");
      } else {
        initAuthCheckout();
      }
    } else {
      if (totalQuantity === 0) {
        router.push("/cart");
      } else {
        setMode("choosing");
        // Pre-fetch countries, carriers, and summary for guest checkout
        Promise.all([getCountries(), getCarriers(), getCheckoutSummary()])
          .then(([c, car, sum]) => {
            setCountries(c);
            setCarriers(car);
            if (c.length > 0) setGuestCountry(c[0].id);
            setSummary(sum);
          })
          .catch(console.error)
          .finally(() => {
            setInitialLoading(false);
            setCarriersLoading(false);
          });
      }
    }
  }, [authLoading, isAuthenticated, totalQuantity, router]);

  // ── Auth Checkout Logic ───────────────────────────────────────

  const initAuthCheckout = async () => {
    try {
      const [addrs, sum] = await Promise.all([
        getAddresses(),
        getCheckoutSummary()
      ]);
      setAddresses(addrs);
      setSummary(sum);
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const submitCarrier = async () => {
    if (!selectedCarrier) return;
    setLoading(true);
    try {
      await setCheckoutCarrier(selectedCarrier);
      const sum = await getCheckoutSummary();
      setSummary(sum);
      setCurrentStep(3);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
      setLoading(false);
    }
  };

  // ── Guest Checkout Logic ──────────────────────────────────────

  const submitGuestOrder = async () => {
    if (!guestPayment || !guestCarrier) return;
    setShowConfirmModal(false);
    setLoading(true);
    setError(null);
    try {
      const data: GuestCheckoutData = {
        email: guestEmail,
        firstname: guestFirstname,
        lastname: guestLastname,
        address1: guestAddress1,
        address2: guestAddress2 || undefined,
        city: guestCity,
        postcode: guestPostcode || undefined,
        id_country: guestCountry,
        phone: guestPhone || undefined,
        id_carrier: guestCarrier,
        payment_method: guestPayment,
      };
      const res = await guestCheckout(data);
      router.push(`/checkout/confirmation?id=${res.order_id}&ref=${res.reference}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  // ── Choosing Mode (Guest vs Auth) ─────────────────────────────

  if (mode === "choosing") {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-slate-50">
        <div className="max-w-lg mx-auto px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-navy">Checkout</h1>
            <p className="text-slate-500 mt-2">How would you like to proceed?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/auth")}
              className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md hover:shadow-primary/10 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <LogIn size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-1">Sign In / Register</h3>
              <p className="text-sm text-slate-500">
                Use your existing account or create a new one to track orders and save addresses.
              </p>
            </button>
            <button
              onClick={() => { setMode("guest"); setCurrentStep(1); }}
              className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md hover:shadow-primary/10 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <UserPlus size={22} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-1">Continue as Guest</h3>
              <p className="text-sm text-slate-500">
                Check out quickly without creating an account. Just provide your email and shipping info.
              </p>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Guest Checkout Flow ───────────────────────────────────────

  if (mode === "guest") {
    const guestSteps = [
      { num: 1, title: "Contact Info" },
      { num: 2, title: "Shipping Address" },
      { num: 3, title: "Delivery Method" },
      { num: 4, title: "Payment" },
    ];

    return (
      <main className="min-h-screen pt-32 pb-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-navy">Guest Checkout</h1>
            <button
              onClick={() => setMode("choosing")}
              className="text-sm text-primary hover:underline mt-2"
            >
              ← Back to checkout options
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {guestSteps.map((step) => {
                  const isActive = currentStep === step.num;
                  const isCompleted = currentStep > step.num;

                  return (
                    <div key={step.num} className={`bg-white rounded-2xl border ${isActive ? 'border-primary shadow-md shadow-primary/10' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all duration-300`}>
                      <div
                        className={`px-6 py-5 flex items-center gap-4 ${isCompleted ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                        onClick={() => { if (isCompleted) setCurrentStep(step.num as Step); }}
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
                            {/* Step 1: Contact Info */}
                            {step.num === 1 && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs font-semibold text-navy mb-1.5">Email Address</label>
                                  <input type="email" required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="your@email.com" className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5">First Name</label>
                                    <input type="text" required value={guestFirstname} onChange={e => setGuestFirstname(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5">Last Name</label>
                                    <input type="text" required value={guestLastname} onChange={e => setGuestLastname(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                  </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                  <button
                                    onClick={() => { if (guestEmail && guestFirstname && guestLastname) setCurrentStep(2); }}
                                    disabled={!guestEmail || !guestFirstname || !guestLastname}
                                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Continue to Address
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Step 2: Shipping Address */}
                            {step.num === 2 && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs font-semibold text-navy mb-1.5">Address Line 1</label>
                                  <input type="text" required value={guestAddress1} onChange={e => setGuestAddress1(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-navy mb-1.5">Address Line 2 (Optional)</label>
                                  <input type="text" value={guestAddress2} onChange={e => setGuestAddress2(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5">City</label>
                                    <input type="text" required value={guestCity} onChange={e => setGuestCity(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5">Postcode</label>
                                    <input type="text" value={guestPostcode} onChange={e => setGuestPostcode(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5">Country</label>
                                    <select required value={guestCountry} onChange={e => setGuestCountry(parseInt(e.target.value))} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                                      {countries.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5">Phone (Optional)</label>
                                    <input type="text" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                  <button onClick={() => setCurrentStep(1)} className="text-slate-500 font-semibold text-sm hover:text-navy transition-colors">Back</button>
                                  <button
                                    onClick={() => { if (guestAddress1 && guestCity && guestCountry) setCurrentStep(3); }}
                                    disabled={!guestAddress1 || !guestCity || !guestCountry}
                                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Continue to Delivery
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Step 3: Carrier */}
                            {step.num === 3 && (
                              <CheckoutCarrierStep
                                selectedId={guestCarrier}
                                onSelect={setGuestCarrier}
                                onNext={() => { if (guestCarrier) setCurrentStep(4); }}
                                onBack={() => setCurrentStep(2)}
                                loading={carriersLoading}
                              />
                            )}

                            {/* Step 4: Payment */}
                            {step.num === 4 && (
                              <CheckoutPaymentStep
                                selectedMethod={guestPayment}
                                onSelect={setGuestPayment}
                                onNext={() => { if (guestPayment) setShowConfirmModal(true); }}
                                onBack={() => setCurrentStep(3)}
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

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-[400px] shrink-0">
              <CheckoutSummary summary={null} items={items} />
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
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
                <p className="text-slate-600 mb-6">Are you sure you want to place this order? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitGuestOrder}
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors flex items-center gap-2"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
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

  // ── Auth Checkout Flow (existing) ─────────────────────────────

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

