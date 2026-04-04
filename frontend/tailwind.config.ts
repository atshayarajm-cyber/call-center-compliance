import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "monospace"]
      },
      colors: {
        panel: "rgba(15,23,42,0.75)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,0.35), 0 0 30px rgba(99,102,241,0.22)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,.4), transparent 30%), radial-gradient(circle at 80% 10%, rgba(139,92,246,.4), transparent 25%), radial-gradient(circle at 50% 80%, rgba(14,165,233,.18), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
