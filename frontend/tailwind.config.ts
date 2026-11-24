import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0A", 2: "#141414", 3: "#1d1d1d" },
        gold: { DEFAULT: "#D4AF37", soft: "#F3E3A3", deep: "#A8841F" },
        paper: "#F7F5F0",
      },
    },
  },
  plugins: [],
};

export default config;
