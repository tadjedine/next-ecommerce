"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Gamepad2, Music, Gift, EyeOff, Eye, User, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "../../components/motion/PageTransition";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const endpoint = activeTab === "login" ? "/v1/auth/login" : "/v1/auth/register";
      const payload = activeTab === "login" 
        ? { email, password }
        : { 
            email, 
            password, 
            password_confirmation: passwordConfirmation,
            firstname, 
            lastname, 
          };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
           const firstErrorKey = Object.keys(errorData.errors)[0];
           throw new Error(errorData.errors[firstErrorKey][0]);
        }
        throw new Error(errorData.message || `Failed to ${activeTab}`);
      }

      const data = await response.json();
      console.log(`${activeTab} successful:`, data);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push('/');
      
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="flex h-[100dvh] w-full overflow-hidden bg-white">
      {/* LEFT HALF */}
      <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-[#EEF2FF] to-[#DBEAFE] relative overflow-hidden flex-col items-center justify-center p-12 shrink-0">
        <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-white/40 rounded-full animate-float" style={{ animationDuration: "5s" }} />
        <div className="absolute top-[60%] left-[10%] w-16 h-16 bg-white/30 rounded-full animate-float" style={{ animationDuration: "7s", animationDelay: "1s" }} />
        <div className="absolute top-[30%] right-[20%] w-48 h-48 bg-white/20 rounded-full animate-float" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        <div className="absolute bottom-[20%] right-[15%] w-24 h-24 bg-white/50 rounded-full animate-float" style={{ animationDuration: "8s", animationDelay: "0.5s" }} />

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
          <p className="text-lg text-slate-gray max-w-md mx-auto leading-relaxed">
            L'expérience d'achat la plus innovante au monde.
          </p>
        </div>
      </div>

      {/* RIGHT HALF */}
      <div className="w-full lg:w-1/2 h-full relative bg-white">
        {/* Absolute Return Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/" className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-50 transition-all text-xs font-medium hover:scale-105 active:scale-95">
            <ArrowLeft size={14} /> Retour
          </Link>
        </div>

        {/* Scrollable Container */}
        <div className="w-full h-full overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-6 md:p-8">
            <motion.div layout className="w-full max-w-[360px]">
              
              <motion.div layout="position" className="mb-6">
                <h2 className="text-2xl font-extrabold text-navy mb-1.5">
                  {activeTab === "login" ? "Bon Retour" : "Créer un compte"}
                </h2>
                <p className="text-sm text-slate-gray">
                  {activeTab === "login" ? "Veuillez vous connecter pour continuer." : "Rejoignez-nous pour une expérience unique."}
                </p>
              </motion.div>

              {/* Tabs */}
              <motion.div layout="position" className="flex relative border-b border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === "login" ? "text-primary-blue" : "text-slate-500 hover:text-navy"}`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === "register" ? "text-primary-blue" : "text-slate-500 hover:text-navy"}`}
                >
                  Inscription
                </button>
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-blue w-1/2"
                  animate={{ x: activeTab === "login" ? "0%" : "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.div>

              <form className="space-y-3.5" onSubmit={handleSubmit}>
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                      animate={{ opacity: 1, height: "auto", marginBottom: 14 }} 
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }} 
                      className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100 overflow-hidden"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {activeTab === "register" && (
                    <motion.div
                      key="name-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 overflow-hidden"
                    >
                      <div className="flex-1 pb-1">
                        <label className="block text-[13px] font-semibold text-navy mb-1">Prénom</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            placeholder="Jean"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            className="w-full pl-9 pr-3 h-11 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                            required={activeTab === "register"}
                          />
                        </div>
                      </div>
                      <div className="flex-1 pb-1">
                        <label className="block text-[13px] font-semibold text-navy mb-1">Nom</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            placeholder="Dupont"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            className="w-full pl-9 pr-3 h-11 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                            required={activeTab === "register"}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div layout="position">
                  <label className="block text-[13px] font-semibold text-navy mb-1">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      placeholder="nom@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 h-11 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div layout="position">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[13px] font-semibold text-navy">Mot de passe</label>
                    {activeTab === "login" && (
                      <Link href="#" className="text-[13px] font-medium text-primary-blue hover:text-blue-700 transition-colors">
                        Mot de passe oublié ?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 h-11 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                      required
                      minLength={activeTab === "register" ? 8 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {activeTab === "register" && (
                    <motion.div
                      key="password-confirm-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1 pb-1">
                        <label className="block text-[13px] font-semibold text-navy mb-1">Confirmer le mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type={showPasswordConfirm ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full pl-9 pr-10 h-11 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all placeholder:text-slate-400 text-navy"
                            required={activeTab === "register"}
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  layout="position"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-primary-blue text-white h-11 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {activeTab === "login" ? "Se connecter" : "S'inscrire"} <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div layout="position" className="my-5 flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-100 after:h-px after:flex-1 after:bg-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">ou avec</span>
              </motion.div>

              <motion.div layout="position" className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 h-11 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-navy hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 h-11 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-navy hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </button>
              </motion.div>

              <motion.div layout="position" className="mt-6 text-center">
                <Link href="/" className="text-[13px] font-semibold text-slate-500 hover:text-primary-blue transition-colors underline-offset-4 hover:underline">
                  Continuer en tant qu'invité
                </Link>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}