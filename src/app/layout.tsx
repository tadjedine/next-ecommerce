import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store — Premium Fashion & Clothing",
  description: "Discover premium fashion, clothing, and accessories. Shop the latest collections with fast shipping and free returns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-lang-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var match = document.cookie.match(new RegExp('(^| )theme=([^;]+)'));
              var theme = match ? match[2] : 'light';
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              
              var matchLang = document.cookie.match(new RegExp('(^| )locale=([^;]+)'));
              var lang = matchLang ? matchLang[2] : 'en';
              document.documentElement.lang = lang;
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
