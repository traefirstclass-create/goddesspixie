import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0f",
        panel: "#15151d",
        panel2: "#1d1d28",
        accent: "#ff3d81",
        accent2: "#ffb86b",
        muted: "#9a97a8",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 61, 129, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
