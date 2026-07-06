"use client";
import { ApiCheckoutSummary, ApiCartItem } from "@/lib/api";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface CheckoutSummaryProps {
  summary: ApiCheckoutSummary | null;
  items: ApiCartItem[];
}

export default function CheckoutSummary({ summary, items }: CheckoutSummaryProps) {
  const { t } = useLanguage();
  const calculatedSubtotal = summary?.subtotal ?? items.reduce((acc, item) => acc + item.line_subtotal, 0);
  const calculatedTotal = summary?.total ?? calculatedSubtotal;

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border-soft p-6 sticky top-24">
      <h3 className="text-xl font-bold text-text-primary mb-6">{t("checkout.summary")}</h3>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        {items.map(item => (
          <div key={`${item.product_id}-${item.product_attribute_id}`} className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-bg-base border border-border-soft flex items-center justify-center shrink-0 overflow-hidden relative">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name || `Product #${item.product_id}`}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              ) : (
                <ShoppingBag size={20} className="text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-text-primary line-clamp-2 leading-tight mb-1">{item.name || `Product #${item.product_id}`}</h4>
              <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
              <div className="font-bold text-primary mt-1">{item.line_subtotal.toFixed(2)} €</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border-soft pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{t("cart.subtotal")}</span>
          <span className="font-semibold text-text-primary">{calculatedSubtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{t("checkout.shipping_cost")}</span>
          <span className="font-semibold text-text-primary">
            {summary?.shipping_cost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : summary?.shipping_cost ? (
              `${summary.shipping_cost.toFixed(2)} €`
            ) : (
              t("checkout.calc_next")
            )}
          </span>
        </div>
        {summary && summary.total_discounts > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discounts</span>
            <span className="font-semibold">-{summary.total_discounts.toFixed(2)} €</span>
          </div>
        )}
      </div>

      <div className="border-t border-border-soft mt-4 pt-4 flex justify-between items-end">
        <span className="font-bold text-text-primary text-lg">{t("checkout.total")}</span>
        <span className="font-extrabold text-2xl text-primary">{calculatedTotal.toFixed(2)} €</span>
      </div>
      
      {summary?.validation_errors && summary.validation_errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
          <ul className="list-disc list-inside">
            {summary.validation_errors.map((err: any, i) => (
              <li key={i}>{typeof err === 'object' && err !== null ? err.message : err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
