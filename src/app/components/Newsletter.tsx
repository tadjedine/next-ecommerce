"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { Mail } from "lucide-react";

export default function Newsletter() {
  return (
    <div className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll>
          <div className="bg-hero rounded-3xl max-w-4xl mx-auto px-8 py-16 md:px-16 md:py-20 text-center shadow-sm border border-border-soft relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full mix-blend-overlay filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
                Join our newsletter
              </h2>
              <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto">
                Get early access to new arrivals, exclusive sales, and tailored style tips straight to your inbox.
              </p>
              
              <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 rounded-full border border-border-soft px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary shadow-sm"
                  required
                />
                <button type="submit" className="rounded-full bg-primary text-white px-8 py-3.5 font-bold hover:bg-primary-dark transition-colors shadow-md whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-text-muted">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </FadeUpOnScroll>
      </div>
    </div>
  );
}
