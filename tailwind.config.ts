import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#161416",
        surface: "#1E201F",
        "surface-2": "#252725",
        border: "#2A2D2B",
        "border-subtle": "#222422",
        green: {
          DEFAULT: "#47B76E",
          dark: "#223B31",
          mid: "#2E5A42",
          light: "#A4EDBE",
          glow: "rgba(71,183,110,0.15)",
        },
        violet: {
          DEFAULT: "#7B2D8B",
          light: "#A855C8",
          glow: "rgba(123,45,139,0.2)",
        },
        fg: "#F0F2F0",
        muted: "#8A9188",
        subtle: "#5A6358",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem,7vw,6rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.2rem,5vw,4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.6rem,3.5vw,2.8rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.2rem,2.5vw,2rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "6px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
      },
      animation: {
        "marquee-left": "marquee-left 30s linear infinite",
        "marquee-right": "marquee-right 30s linear infinite",
        "fade-up": "fade-up 0.6s ease forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        "marquee-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "noise": "url('/noise.svg')",
        "grid-lines": "linear-gradient(rgba(71,183,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(71,183,110,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
