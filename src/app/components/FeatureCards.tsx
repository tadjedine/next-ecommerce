"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import { HoverLift } from "./motion/HoverLift";
import { Zap, Shield, Smartphone, Globe2 } from "lucide-react";

export default function FeatureCards() {
  const features = [
    { icon: <Zap size={24} />, title: "Vitesse Éclair", desc: "Performance optimisée pour un chargement instantané de toutes nos pages." },
    { icon: <Shield size={24} />, title: "Sécurité Maximale", desc: "Vos données sont chiffrées et protégées par les meilleurs standards." },
    { icon: <Smartphone size={24} />, title: "100% Responsive", desc: "Une expérience parfaite sur mobile, tablette et ordinateur de bureau." },
    { icon: <Globe2 size={24} />, title: "Livraison Globale", desc: "Nous expédions nos produits dans plus de 150 pays à travers le monde." },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Pourquoi nous choisir ?</h2>
          <p className="text-slate-gray max-w-2xl mx-auto">
            Nous avons repensé chaque détail pour vous offrir la meilleure expérience possible. Découvrez ce qui nous rend uniques.
          </p>
        </FadeUpOnScroll>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <HoverLift className="h-full bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-start transition-shadow hover:shadow-md">
                <div className="w-14 h-14 bg-primary-blue rounded-[14px] flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
                <p className="text-slate-gray leading-relaxed">
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
