"use client";
import { CreditCard, Banknote, Building2, CheckCircle2 } from "lucide-react";

interface PaymentSelectorProps {
  selectedMethod: string | null;
  onSelect: (method: string) => void;
}

export const PAYMENT_METHODS = [
  { id: "cash_on_delivery", name: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive the order" },
  { id: "online_pre_payment", name: "Online Payment", icon: CreditCard, desc: "Pay now securely" },
  { id: "online_post_payment", name: "Pay Later", icon: Building2, desc: "Online payment after order confirmation" },
];

export default function PaymentSelector({ selectedMethod, onSelect }: PaymentSelectorProps) {
  return (
    <div className="space-y-3">
      {PAYMENT_METHODS.map(method => (
        <div 
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedMethod === method.id ? 'border-primary bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedMethod === method.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
            <method.icon size={20} />
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-navy">{method.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
          </div>

          {selectedMethod === method.id && (
            <div className="absolute -top-2.5 -right-2.5 bg-white rounded-full text-primary">
              <CheckCircle2 size={24} className="fill-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
