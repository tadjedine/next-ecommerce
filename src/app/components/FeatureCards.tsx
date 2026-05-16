"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import { HoverLift } from "./motion/HoverLift";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      icon: <Truck size={24} />,
      title: "Livraison Rapide",
      desc: "Livraison gratuite à partir de 49€ d'achat. Expédition sous 24h pour toutes vos commandes."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Paiement Sécurisé",
      desc: "Transactions protégées par un chiffrement SSL. Visa, Mastercard, PayPal et paiement en 3x acceptés."
    },
    {
      icon: <RotateCcw size={24} />,
      title: "Retours Gratuits",
      desc: "Vous disposez de 30 jours pour changer d'avis. Retour et remboursement simples et sans frais."
    },
    {
      icon: <Headphones size={24} />,
      title: "Service Client 7j/7",
      desc: "Notre équipe vous accompagne par chat, email ou téléphone pour répondre à toutes vos questions."
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Pourquoi nous choisir ?</h2>
          <p className="text-slate-gray max-w-2xl mx-auto">
            Des avantages concrets pour une expérience d&apos;achat sans compromis. Votre satisfaction est notre priorité.
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
