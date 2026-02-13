import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07090d",
        panel: "#0f1420",
        glow: "#7a8cff"
      },
      boxShadow: {
        glow: "0 0 30px rgba(122, 140, 255, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
