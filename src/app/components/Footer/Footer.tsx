import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { IconBrandInstagram, IconBrandFacebook, IconBrandTwitter } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                S
              </div>
              <span className="font-extrabold text-2xl tracking-tight">Store</span>
            </div>
            <p className="text-white/60 mb-8 max-w-xs leading-relaxed">
              The most innovative shopping experience. Quality products for a better everyday life.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors">
                <IconBrandInstagram size={20} />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors">
                <IconBrandFacebook size={20} />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors">
                <IconBrandTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-wide">Shop</h3>
            <ul className="space-y-4">
              <li><Link href="/shop/new" className="text-white/60 hover:text-white text-sm transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop/bestsellers" className="text-white/60 hover:text-white text-sm transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop/sale" className="text-white/60 hover:text-white text-sm transition-colors">Sale</Link></li>
              <li><Link href="/shop" className="text-white/60 hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link href="/gift-cards" className="text-white/60 hover:text-white text-sm transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-wide">Help</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-white/60 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-white/60 hover:text-white text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-white/60 hover:text-white text-sm transition-colors">Return Policy</Link></li>
              <li><Link href="/track" className="text-white/60 hover:text-white text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-white text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-wide">Contact</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <span className="text-white/60 text-sm">support@store.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <span className="text-white/60 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0" />
                <span className="text-white/60 text-sm leading-relaxed">
                  123 Commerce Avenue<br/>
                  New York, NY 10001
                </span>
              </li>
            </ul>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors w-full sm:w-auto">
              Chat on WhatsApp
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Store Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 opacity-60">
            <span className="font-bold text-lg">VISA</span>
            <span className="font-bold text-lg">Mastercard</span>
            <span className="font-bold text-lg italic">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}