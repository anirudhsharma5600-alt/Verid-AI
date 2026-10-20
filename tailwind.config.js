/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#FFD400",
          hover: "#E6BE00",
          foreground: "#000000",
        },
        surface: {
          DEFAULT: "#121212",
          card: "#18181B",
          border: "#27272A",
        },
        accent: {
          DEFAULT: "#FFD400",
          foreground: "#000000",
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#000000",
        },
      },
      fontSize: {
        "2xs": "0.625rem",
        "huge": "2.25rem",
      },
      minHeight: {
        "16": "4rem",
        "20": "5rem",
      },
    },
  },
  plugins: [],
};
