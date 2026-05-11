"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Gamepad2, Music, Gift, EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "../../components/motion/PageTransition";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <PageTransition className="flex min-h-screen">
      {/* LEFT HALF */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#EEF2FF] to-[#DBEAFE] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Floating circles */}
        <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-white/40 rounded-full animate-float" style={{ animationDuration: "5s" }} />
        <div className="absolute top-[60%] left-[10%] w-16 h-16 bg-white/30 rounded-full animate-float" style={{ animationDuration: "7s", animationDelay: "1s" }} />
        <div className="absolute top-[30%] right-[20%] w-48 h-48 bg-white/20 rounded-full animate-float" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        <div className="absolute bottom-[20%] right-[15%] w-24 h-24 bg-white/50 rounded-full animate-float" style={{ animationDuration: "8s", animationDelay: "0.5s" }} />

        {/* Floating Icons */}
        <div className="absolute top-[25%] left-[30%] text-slate-400 opacity-50 animate-float" style={{ animationDuration: "6s" }}>
          <Gamepad2 size={40} />
        </div>
        <div className="absolute bottom-[35%] left-[25%] text-slate-400 opacity-50 animate-float" style={{ animationDuration: "5s", animationDelay: "1.5s" }}>
          <Music size={32} />
        </div>
        <div className="absolute top-[45%] right-[25%] text-slate-400 opacity-50 animate-float" style={{ animationDuration: "7s", animationDelay: "0.8s" }}>
          <Gift size={48} />
        </div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-primary-blue rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl">
            S
          </div>
          <h1 className="text-5xl font-extrabold text-navy mb-4 tracking-tight">Store</h1>
          <p className="text-xl text-slate-gray max-w-md mx-auto leading-relaxed">
            L'expérience d'achat la plus innovante au monde.
          </p>
        </div>
      </div>

      {/* RIGHT HALF */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 md:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-gray hover:text-navy font-medium transition-colors">
          ← Retour
        </Link>
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-navy mb-2">Bon Retour</h2>
          <p className="text-slate-gray mb-8">Veuillez vous connecter pour continuer.</p>

          {/* Tabs */}
          <div className="flex relative border-b border-slate-200 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${activeTab === "login" ? "text-primary-blue" : "text-slate-500 hover:text-navy"}`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${activeTab === "register" ? "text-primary-blue" : "text-slate-500 hover:text-navy"}`}
            >
              Inscription
            </button>
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 h-0.5 bg-primary-blue w-1/2"
              animate={{ x: activeTab === "login" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push('/'); }}>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-navy">Mot de passe</label>
                {activeTab === "login" && (
                  <Link href="#" className="text-sm font-medium text-primary-blue hover:text-blue-700 transition-colors">
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-primary-blue text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              {activeTab === "login" ? "Se connecter" : "S'inscrire"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">ou continuer avec</span>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-navy hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-navy hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}