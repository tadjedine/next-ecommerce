"use client";

import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import { HoverLift } from "./motion/HoverLift";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeatureCards() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Truck size={24} />,
      title: t("features.shipping.title"),
      desc: t("features.shipping.desc")
    },
    {
      icon: <ShieldCheck size={24} />,
      title: t("features.payment.title"),
      desc: t("features.payment.desc")
    },
    {
      icon: <RotateCcw size={24} />,
      title: t("features.returns.title"),
      desc: t("features.returns.desc")
    },
    {
      icon: <Headphones size={24} />,
      title: t("features.support.title"),
      desc: t("features.support.desc")
    },
  ];

  return (
    <div className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t("features.title")}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </FadeUpOnScroll>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <HoverLift className="h-full bg-surface border border-border-soft rounded-2xl p-8 flex flex-col items-start transition-shadow hover:shadow-md">
                <div className="w-14 h-14 bg-primary rounded-[14px] flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
