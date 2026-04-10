/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        background: "#020617",
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-in-left": "slideInLeft 0.3s ease forwards",
        "scale-in": "scaleIn 0.2s ease forwards",
      },
    },
  },
  plugins: [],
}
