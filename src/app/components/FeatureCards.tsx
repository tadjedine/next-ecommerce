"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import { HoverLift } from "./motion/HoverLift";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      icon: <Truck size={24} />,
      title: "Fast Shipping",
      desc: "Free delivery on orders over $49. All orders shipped within 24 hours for a seamless experience."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Payment",
      desc: "Transactions protected by SSL encryption. Visa, Mastercard, PayPal and installment payments accepted."
    },
    {
      icon: <RotateCcw size={24} />,
      title: "Free Returns",
      desc: "You have 30 days to change your mind. Simple and free returns and refunds, no questions asked."
    },
    {
      icon: <Headphones size={24} />,
      title: "24/7 Customer Support",
      desc: "Our team is here to help via chat, email, or phone to answer all your questions anytime."
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Why Choose Us?</h2>
          <p className="text-slate-gray max-w-2xl mx-auto">
            Real benefits for a no-compromise shopping experience. Your satisfaction is our top priority.
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
