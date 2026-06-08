import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg-hero": "linear-gradient(135deg, #F0EDE8 0%, #EBE8E3 100%)",
      },
      colors: {
        primary: "#2B7FFF",
        "primary-dark": "#1A6FEF",
        accent: "#F59E0B",
        surface: "#FAFAF7",
        "bg-base": "#F5F5F0",
        "text-primary": "#0F172A",
        "text-muted": "#64748B",
        "border-soft": "#E5E3DE",
        
        // Keeping previous colors for backward compatibility in case they are used in Navbar/etc
        CartRed: "#E43023",
        "primary-blue": "#2B7FFF",
        navy: "#0F172A",
        "slate-gray": "#64748B",
        "orange-accent": "#F97316",
        "bg-gradient-start": "#EFEDE8",
        "bg-gradient-end": "#EBE8E3",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
export default config;
