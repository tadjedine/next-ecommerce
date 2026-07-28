"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, User, MapPin, Truck, CreditCard, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ApiAddress, ApiCarrier, getAddresses, getCarriers, createAddress, updateAddress, deleteAddress } from "@/lib/api";
import AddressCard from "@/app/components/account/AddressCard";
import AddressForm from "@/app/components/account/AddressForm";
import CarrierSelector from "@/app/components/account/CarrierSelector";
import PaymentSelector from "@/app/components/account/PaymentSelector";

export default function AccountPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"addresses" | "carrier" | "payment">("addresses");
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [carriers, setCarriers] = useState<ApiCarrier[]>([]);
  const [carriersLoading, setCarriersLoading] = useState(true);
  
  // Forms
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ApiAddress | undefined>(undefined);

  // Preferences
  const [prefCarrier, setPrefCarrier] = useState<number | null>(null);
  const [prefPayment, setPrefPayment] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
      loadCarriers();
      // Load preferences from localStorage
      const savedCarrier = localStorage.getItem("pref_carrier");
      const savedPayment = localStorage.getItem("pref_payment");
      if (savedCarrier) setPrefCarrier(parseInt(savedCarrier));
      if (savedPayment) setPrefPayment(savedPayment);
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCarriers = async () => {
    try {
      setCarriersLoading(true);
      const data = await getCarriers();
      setCarriers(data);
      // Auto-select first carrier if none selected
      const savedCarrier = localStorage.getItem("pref_carrier");
      if (!savedCarrier && data.length > 0) {
        handleCarrierChange(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarriersLoading(false);
    }
  };

  const handleSaveAddress = async (data: Partial<ApiAddress>) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      await loadAddresses();
      setShowAddressForm(false);
      setEditingAddress(undefined);
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  const handleCarrierChange = (id: number) => {
    setPrefCarrier(id);
    localStorage.setItem("pref_carrier", id.toString());
  };

  const handlePaymentChange = (method: string) => {
    setPrefPayment(method);
    localStorage.setItem("pref_payment", method);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-bg-base">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-bg-base">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-surface rounded-2xl shadow-sm border border-border-soft flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">{t("account.title")}</h1>
            <p className="text-text-muted">Manage your addresses and checkout preferences.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-surface rounded-2xl shadow-sm border border-border-soft p-2 space-y-1">
              <button 
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === "addresses" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-muted hover:bg-bg-base"}`}
              >
                <MapPin size={18} /> Addresses
              </button>
              <button 
                onClick={() => setActiveTab("carrier")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === "carrier" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-muted hover:bg-bg-base"}`}
              >
                <Truck size={18} /> Delivery Carrier
              </button>
              <button 
                onClick={() => setActiveTab("payment")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === "payment" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-muted hover:bg-bg-base"}`}
              >
                <CreditCard size={18} /> Payment Method
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-surface rounded-2xl shadow-sm border border-border-soft p-6 md:p-8 min-h-[400px]">
              
              <AnimatePresence mode="wait">
                {activeTab === "addresses" && (
                  <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-text-primary">{t("account.addresses")}</h2>
                      <button 
                        onClick={() => { setEditingAddress(undefined); setShowAddressForm(true); }}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                      >
                        <Plus size={16} /> Add New
                      </button>
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2].map(i => <div key={i} className="animate-pulse bg-border-soft h-40 rounded-xl"></div>)}
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-12 px-4 bg-bg-base rounded-xl border border-dashed border-slate-300">
                        <MapPin size={32} className="mx-auto text-text-muted mb-3" />
                        <h3 className="text-base font-bold text-text-primary">No addresses yet</h3>
                        <p className="text-sm text-text-muted mt-1">Add an address to make your checkout faster.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <AddressCard 
                            key={addr.id} 
                            address={addr} 
                            onEdit={(a) => { setEditingAddress(a); setShowAddressForm(true); }}
                            onDelete={handleDeleteAddress}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "carrier" && (
                  <motion.div key="carrier" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-md">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary mb-1">Preferred Carrier</h2>
                      <p className="text-sm text-text-muted">This carrier will be pre-selected during checkout.</p>
                    </div>
                    <CarrierSelector carriers={carriers} loading={carriersLoading} selectedId={prefCarrier} onSelect={handleCarrierChange} />
                  </motion.div>
                )}

                {activeTab === "payment" && (
                  <motion.div key="payment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-md">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary mb-1">Preferred Payment Method</h2>
                      <p className="text-sm text-text-muted">This payment method will be pre-selected during checkout.</p>
                    </div>
                    <PaymentSelector selectedMethod={prefPayment} onSelect={handlePaymentChange} />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

      </div>

      {showAddressForm && (
        <AddressForm 
          initialData={editingAddress} 
          onSave={handleSaveAddress} 
          onCancel={() => { setShowAddressForm(false); setEditingAddress(undefined); }} 
        />
      )}
    </main>
  );
}
