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
        /* Tokens semânticos — reagem a data-theme (IVIDA vs IFORTE) */
        accent: {
          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          muted: "var(--accent-muted)",
          border: "var(--accent-border)",
          focus: "var(--accent-focus)",
        },
        ivida: {
          red: "#E02020",
          redhover: "#c71a1a",
        },
        iforte: {
          blue: "#102E66",
          bluehover: "#1a3d7a",
          blueaccent: "#2a5aa0",
          /* Design system IFORTE (uso dentro de .iforte-scope) */
          bg: "var(--iforte-bg)",
          surface: "var(--iforte-surface)",
          text: "var(--iforte-text)",
          "text-muted": "var(--iforte-text-muted)",
          border: "var(--iforte-border)",
          "blue-primary": "var(--iforte-blue)",
          "blue-hover": "var(--iforte-blue-hover)",
          "border-blue": "var(--iforte-border-blue)",
          glow: "var(--iforte-glow)",
        },
        surface: {
          dark: "#0B0B0B",
          darkAlt: "#0E0E0E",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "card-in": "cardIn 0.5s ease-out forwards",
        "blob-float-1": "blobFloat1 35s ease-in-out infinite",
        "blob-float-2": "blobFloat2 40s ease-in-out infinite",
      },
      keyframes: {
        cardIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blobFloat1: {
          "0%, 100%": { left: "-25%", top: "-25%" },
          "25%": { left: "100%", top: "-20%" },
          "50%": { left: "105%", top: "95%" },
          "75%": { left: "-20%", top: "100%" },
        },
        blobFloat2: {
          "0%, 100%": { right: "-25%", bottom: "-25%" },
          "25%": { right: "100%", bottom: "95%" },
          "50%": { right: "105%", bottom: "-20%" },
          "75%": { right: "-20%", bottom: "100%" },
        },
      },
      backgroundImage: {
        "blob-red": "radial-gradient(circle, rgba(224, 32, 32, 0.12) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
