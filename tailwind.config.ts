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
        "bg-hero": "linear-gradient(135deg, #EEF3FF 0%, #F5F0FF 100%)",
      },
      colors: {
        primary: "#2B7FFF",
        "primary-dark": "#1A6FEF",
        accent: "#F59E0B",
        surface: "#FFFFFF",
        "bg-base": "#F8FAFF",
        "text-primary": "#0F172A",
        "text-muted": "#64748B",
        "border-soft": "#E8EEFB",
        
        // Keeping previous colors for backward compatibility in case they are used in Navbar/etc
        CartRed: "#E43023",
        "primary-blue": "#2B7FFF",
        navy: "#0F172A",
        "slate-gray": "#64748B",
        "orange-accent": "#F97316",
        "bg-gradient-start": "#F0F4FF",
        "bg-gradient-end": "#EEF2FF",
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
