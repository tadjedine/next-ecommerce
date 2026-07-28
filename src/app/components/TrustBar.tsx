"use client";
import { ShieldCheck, Zap, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrustBar() {
  const { t } = useLanguage();
  return (
    <div className="bg-bg-base py-6 border-y border-border-soft">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
        <div className="flex items-center gap-3 text-text-muted">
          <ShieldCheck size={20} />
          <span className="text-sm font-medium tracking-wide">{t("trust.payments")}</span>
        </div>
        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border-soft"></div>
        <div className="flex items-center gap-3 text-text-muted">
          <Zap size={20} />
          <span className="text-sm font-medium tracking-wide">{t("trust.delivery")}</span>
        </div>
        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border-soft"></div>
        <div className="flex items-center gap-3 text-text-muted">
          <Award size={20} />
          <span className="text-sm font-medium tracking-wide">{t("trust.customers")}</span>
        </div>
      </div>
    </div>
  );
}
