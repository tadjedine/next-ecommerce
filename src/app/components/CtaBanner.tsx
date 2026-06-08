"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";

export default function CtaBanner() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="bg-bg-gradient-start rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          {/* Decorative blur circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-blue rounded-full mix-blend-overlay filter blur-3xl opacity-10 transform translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-navy mb-6 tracking-tight">Ready to elevate your everyday?</h2>
            <p className="text-lg text-slate-gray mb-10">
              Join thousands of happy customers and get exclusive deals today.
            </p>
            <button className="px-8 py-4 bg-primary-blue text-white rounded-full font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-lg shadow-blue-500/30">
              Create your free account
            </button>
          </div>
        </FadeUpOnScroll>
      </div>
    </div>
  );
}
