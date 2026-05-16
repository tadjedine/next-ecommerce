"use client";
import { motion } from "framer-motion";
import { Flame, GraduationCap, Sparkles, TrendingUp, Users, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bg-gradient-end via-white to-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-8 shadow-sm"
        >
          <Sparkles size={16} className="text-primary-blue" />
          <span className="text-sm font-medium text-slate-gray">Nouvelle collection d'été disponible</span>
        </motion.div>

        {/* Heading */}
        <div className="max-w-4xl mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-navy leading-tight tracking-tight">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="block"
            >
              L'expérience d'achat
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="block"
            >
              la plus <span className="text-primary-blue">innovante</span> au monde
            </motion.span>
          </h1>
        </div>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="text-lg text-slate-gray max-w-xl mb-12"
        >
          Découvrez une sélection rigoureuse de produits premium. Qualité exceptionnelle, livraison ultra-rapide et service client dévoué.
        </motion.p>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 mb-16"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-primary-blue mb-1">
              <Users size={24} />
            </div>
            <div className="text-2xl font-bold text-navy">2M+</div>
            <div className="text-sm text-slate-gray font-medium">Clients Actifs</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-slate-200"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-primary-blue mb-1">
              <TrendingUp size={24} />
            </div>
            <div className="text-2xl font-bold text-navy">50k+</div>
            <div className="text-sm text-slate-gray font-medium">Produits Vendus</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-slate-200"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-primary-blue mb-1">
              <ShieldCheck size={24} />
            </div>
            <div className="text-2xl font-bold text-navy">99.9%</div>
            <div className="text-sm text-slate-gray font-medium">Satisfaction</div>
          </div>
        </motion.div>

        {/* Promo Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.34 }}
          className="inline-flex flex-col sm:flex-row items-center p-1.5 pr-1.5 pl-6 bg-white border border-slate-200 rounded-full shadow-lg"
        >
          <div className="flex items-center gap-3 mr-6 mb-3 sm:mb-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-accent animate-pulse">
              <Flame size={16} className="mr-[-6px] z-10" />
              <GraduationCap size={18} />
            </div>
            <span className="font-semibold text-navy">Exclusif : Masterclass à 99€</span>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 bg-orange-accent text-white font-medium rounded-full hover:bg-orange-600 transition-colors shadow-sm">
            Profiter de l'offre
          </button>
        </motion.div>

      </div>
    </div>
  );
}
