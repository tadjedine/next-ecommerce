"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe, Moon, ShoppingCart, Shirt, Gem, Tag, ArrowRight, User, LogOut, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./cart/CartDrawer";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";

const MegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }: { isOpen: boolean; onMouseEnter: () => void; onMouseLeave: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.95 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ originY: 0 }}
          className="absolute top-full left-0 w-full bg-surface border-b border-border-soft shadow-sm"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 py-8 flex gap-12">
            <div className="w-1/3 bg-bg-base rounded-2xl p-8 flex flex-col items-start justify-center">
              <h3 className="text-xl font-bold text-text-primary mb-2">New Arrivals 2026</h3>
              <p className="text-text-muted mb-6 text-sm">Discover our latest collections with exclusive designs.</p>
              <Link href="/shop" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Explore <ArrowRight size={16} />
              </Link>
            </div>
            <div className="w-2/3 grid grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-6">Women</h4>
                <div className="space-y-6">
                  <Link href="/shop/women" className="group flex items-start gap-4">
                    <div className="p-2 bg-bg-base rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-text-muted">
                      <Shirt size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">Dresses</div>
                      <div className="text-xs text-text-muted">Casual & evening styles</div>
                    </div>
                  </Link>
                  <Link href="/shop/women" className="group flex items-start gap-4">
                    <div className="p-2 bg-bg-base rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-text-muted">
                      <Gem size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">Tops & Blouses</div>
                      <div className="text-xs text-text-muted">Everyday essentials</div>
                    </div>
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-6">Men</h4>
                <div className="space-y-6">
                  <Link href="/shop/men" className="group flex items-start gap-4">
                    <div className="p-2 bg-bg-base rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-text-muted">
                      <Shirt size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">Jackets & Coats</div>
                      <div className="text-xs text-text-muted">Outerwear for every season</div>
                    </div>
                  </Link>
                  <Link href="/shop/men" className="group flex items-start gap-4">
                    <div className="p-2 bg-bg-base rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-text-muted">
                      <Gem size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">Shirts</div>
                      <div className="text-xs text-text-muted">Casual & formal fits</div>
                    </div>
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-6">On Sale</h4>
                <div className="space-y-6">
                  <Link href="/shop/sale" className="group flex items-start gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors text-orange-500">
                      <Tag size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-accent transition-colors">Flash Sales</div>
                      <div className="text-xs text-text-muted">Up to 50% off</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { totalQuantity } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-surface/80 backdrop-blur-md border-b border-border-soft" : "bg-surface border-b border-border-soft"}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-bold text-xl text-text-primary">Store</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 h-full">
            <div 
              className="flex items-center gap-1 text-text-muted hover:text-text-primary font-medium cursor-pointer h-full border-b-2 border-transparent hover:border-primary transition-colors"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              Shop <ChevronDown size={16} />
            </div>
            <Link href="/shop/sale" className="text-text-muted hover:text-text-primary font-medium transition-colors">Sale</Link>
            <Link href="/" className="text-text-muted hover:text-text-primary font-medium transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4 text-text-muted relative">
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm font-medium">EUR</span>
              <Globe size={20} className="cursor-pointer hover:text-text-primary transition-colors" />
              <Moon size={20} className="cursor-pointer hover:text-text-primary transition-colors" />
              <div className="w-px h-6 bg-border-soft"></div>
            </div>
            <div 
              className="relative cursor-pointer hover:text-text-primary transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalQuantity}</span>
              )}
            </div>
            
            {isAuthenticated ? (
              <div className="relative ml-4" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-primary font-bold shadow-sm border border-slate-200"
                >
                  {user?.firstname ? user.firstname.charAt(0).toUpperCase() : <User size={20} />}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <p className="font-bold text-navy text-sm">Hi, {user?.firstname}!</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2 flex flex-col">
                        <Link 
                          href="/account" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-primary hover:bg-blue-50 transition-colors"
                        >
                          <User size={16} /> My Account
                        </Link>
                        <Link 
                          href="/orders" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-primary hover:bg-blue-50 transition-colors"
                        >
                          <FileText size={16} /> Orders
                        </Link>
                        <div className="h-px bg-slate-100 my-1 mx-2"></div>
                        <button 
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth" className="hidden sm:flex ml-4 bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
        <MegaMenu isOpen={megaMenuOpen} onMouseEnter={() => setMegaMenuOpen(true)} onMouseLeave={() => setMegaMenuOpen(false)} />
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
