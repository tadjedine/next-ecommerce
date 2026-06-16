"use client";
import { Truck, CheckCircle2 } from "lucide-react";
import { ApiCarrier } from "@/lib/api";

interface CarrierSelectorProps {
  carriers: ApiCarrier[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function CarrierSelector({ carriers, loading, selectedId, onSelect }: CarrierSelectorProps) {
  if (loading || !carriers) return <div className="animate-pulse h-24 bg-slate-100 rounded-xl w-full"></div>;
  if (carriers.length === 0) return <div className="text-sm text-slate-500">No carriers available.</div>;

  return (
    <div className="space-y-3">
      {carriers.map(carrier => (
        <div 
          key={carrier.id}
          onClick={() => onSelect(carrier.id)}
          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedId === carrier.id ? 'border-primary bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedId === carrier.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
            <Truck size={20} />
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-navy">{carrier.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{carrier.delay}</p>
          </div>

          <div className="text-right">
            {carrier.is_free ? (
              <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Free</span>
            ) : null}
          </div>

          {selectedId === carrier.id && (
            <div className="absolute -top-2.5 -right-2.5 bg-white rounded-full text-primary">
              <CheckCircle2 size={24} className="fill-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
