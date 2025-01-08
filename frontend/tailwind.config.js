/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        svg: "url('/src/assets/background.svg')",
      },
      animation: {
        "loading-bar": "loadingBar 1.5s ease-in-out infinite",
      },
      keyframes: {
        loadingBar: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      colors: {
        grass: {
          50: "#fdfff8",
          100: "#fbfff1",
          200: "#f8ffe2",
          300: "#f4ffd4",
          400: "#f1ffc5",
          500: "#becc92",
          600: "#8e996e",
          700: "#5f6649",
          800: "#2f3325",
          900: "#181912",
        },
      },
    },
  },
  plugins: [],
};
