"use client";
import PaymentSelector from "@/app/components/account/PaymentSelector";

interface CheckoutPaymentStepProps {
  selectedMethod: string | null;
  onSelect: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function CheckoutPaymentStep({ selectedMethod, onSelect, onNext, onBack, loading }: CheckoutPaymentStepProps) {
  return (
    <div className="space-y-6">
      <PaymentSelector selectedMethod={selectedMethod} onSelect={onSelect} />
      
      <div className="flex justify-between items-center pt-4 border-t border-border-soft">
        <button onClick={onBack} className="text-text-muted font-semibold text-sm hover:text-text-primary transition-colors">
          Back
        </button>
        <button 
          onClick={onNext}
          disabled={!selectedMethod || loading}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Place Order
        </button>
      </div>
    </div>
  );
}
