"use client";
import { useEffect, useState } from "react";
import CarrierSelector from "@/app/components/account/CarrierSelector";
import { getCarriers, ApiCarrier } from "@/lib/api";

interface CheckoutCarrierStepProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function CheckoutCarrierStep({ selectedId, onSelect, onNext, onBack, loading }: CheckoutCarrierStepProps) {
  const [carriers, setCarriers] = useState<ApiCarrier[]>([]);
  const [carriersLoading, setCarriersLoading] = useState(true);

  useEffect(() => {
    getCarriers()
      .then((data) => {
        setCarriers(data);
      })
      .catch((err) => {
        console.error("Error fetching carriers:", err);
      })
      .finally(() => {
        setCarriersLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <CarrierSelector 
        carriers={carriers} 
        loading={carriersLoading || loading} 
        selectedId={selectedId} 
        onSelect={onSelect} 
      />
      
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button onClick={onBack} className="text-slate-500 font-semibold text-sm hover:text-navy transition-colors">
          Back
        </button>
        <button 
          onClick={onNext}
          disabled={!selectedId || loading}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
