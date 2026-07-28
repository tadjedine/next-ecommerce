import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        "bg-hero": "linear-gradient(135deg, var(--color-bg-gradient-start) 0%, var(--color-bg-gradient-end) 100%)",
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        "bg-base": "var(--color-bg-base)",
        "text-primary": "var(--color-text-primary)",
        "text-muted": "var(--color-text-muted)",
        "border-soft": "var(--color-border-soft)",
        
        // Keeping previous colors for backward compatibility in case they are used in Navbar/etc
        CartRed: "#E43023",
        "primary-blue": "#2B7FFF",
        navy: "#0F172A",
        "slate-gray": "#64748B",
        "orange-accent": "#F97316",
        "bg-gradient-start": "var(--color-bg-gradient-start)",
        "bg-gradient-end": "var(--color-bg-gradient-end)",
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
