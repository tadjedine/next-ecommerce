"use client";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { ApiAddress } from "@/lib/api";

interface CheckoutAddressStepProps {
  addresses: ApiAddress[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
  onNext: () => void;
  loading: boolean;
}

export default function CheckoutAddressStep({ addresses, selectedId, onSelect, onAddNew, onNext, loading }: CheckoutAddressStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div 
            key={addr.id}
            onClick={() => onSelect(addr.id)}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedId === addr.id ? 'border-primary bg-blue-50/50 shadow-sm' : 'border-border-soft hover:border-slate-300 bg-surface'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-text-primary text-sm">{addr.alias}</h4>
            </div>
            <div className="text-xs text-text-muted space-y-0.5">
              <p className="font-medium text-text-primary">{addr.firstname} {addr.lastname}</p>
              <p>{addr.address1}</p>
              <p>{addr.postcode} {addr.city}</p>
            </div>
            {selectedId === addr.id && (
              <div className="absolute top-4 right-4 text-primary">
                <Check size={20} className="stroke-[3]" />
              </div>
            )}
          </div>
        ))}
        
        <div 
          onClick={onAddNew}
          className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary cursor-pointer transition-colors flex flex-col items-center justify-center text-text-muted hover:text-primary bg-bg-base min-h-[140px]"
        >
          <Plus size={24} className="mb-2" />
          <span className="font-semibold text-sm">Add New Address</span>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border-soft">
        <button 
          onClick={onNext}
          disabled={!selectedId || loading}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Continue to Delivery
        </button>
      </div>
    </div>
  );
}
