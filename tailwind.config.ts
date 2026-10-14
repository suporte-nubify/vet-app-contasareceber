import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        teal: {
          50: "#effef8",
          100: "#d7fbea",
          200: "#b2f5d8",
          300: "#76ebc0",
          400: "#3ad9a4",
          500: "#16c48b",
          600: "#0ca876",
          700: "#0b8660",
          800: "#086b4d",
          900: "#06543e",
          950: "#033328",
        },
        coral: {
          50: "#fff1f4",
          100: "#ffe0e7",
          200: "#ffc2d0",
          300: "#ff94ad",
          400: "#ff6b8a",
          500: "#f43f68",
          600: "#e11d55",
          700: "#be1248",
          800: "#9f1242",
          900: "#88143d",
          950: "#4c051d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
