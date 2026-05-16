import { ShieldCheck, Zap, Award } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="bg-slate-50 py-6 border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
        <div className="flex items-center gap-3 text-slate-500">
          <ShieldCheck size={20} />
          <span className="text-sm font-medium tracking-wide">Paiements Sécurisés</span>
        </div>
        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        <div className="flex items-center gap-3 text-slate-500">
          <Zap size={20} />
          <span className="text-sm font-medium tracking-wide">Livraison Instantanée</span>
        </div>
        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        <div className="flex items-center gap-3 text-slate-500">
          <Award size={20} />
          <span className="text-sm font-medium tracking-wide">Plus de 5 000 Clients</span>
        </div>
      </div>
    </div>
  );
}
