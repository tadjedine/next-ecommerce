"use client";

import { motion } from "framer-motion";
import { Flame, GraduationCap, Sparkles, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bg-gradient-end via-surface to-surface">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border-soft mb-8 shadow-sm"
        >
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-muted">{t("hero.badge")}</span>
        </motion.div>

        {/* Heading */}
        <div className="max-w-4xl mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-text-primary leading-tight tracking-tight">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="block"
            >
              {t("hero.title1")}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="block"
            >
              {t("hero.title2")} <span className="text-primary">{t("hero.title3")}</span>
            </motion.span>
          </h1>
        </div>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="text-lg text-text-muted max-w-xl mb-12"
        >
          {t("hero.desc")}
        </motion.p>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 mb-16"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-1">
              <Users size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary">2M+</div>
            <div className="text-sm text-text-muted font-medium">{t("hero.clients")}</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border-soft"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-1">
              <TrendingUp size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary">50k+</div>
            <div className="text-sm text-text-muted font-medium">{t("hero.sold")}</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border-soft"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-1">
              <ShieldCheck size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary">99.9%</div>
            <div className="text-sm text-text-muted font-medium">{t("hero.satisfaction")}</div>
          </div>
        </motion.div>

        {/* Promo Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.34 }}
          className="inline-flex flex-col sm:flex-row items-center p-1.5 pr-1.5 pl-6 bg-surface border border-border-soft rounded-full shadow-lg"
        >
          <div className="flex items-center gap-3 mr-6 mb-3 sm:mb-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-500 animate-pulse">
              <Flame size={16} className="mr-[-6px] z-10" />
              <GraduationCap size={18} />
            </div>
            <span className="font-semibold text-text-primary">{t("hero.offer_badge")}</span>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors shadow-sm">
            {t("hero.offer_btn")}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
