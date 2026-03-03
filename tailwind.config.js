/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4ce619",
        "background-light": "#f6f8f6",
        "background-dark": "#152111",
        "sage": {
            "50": "#f4f7f4",
            "100": "#eaf3e7",
            "200": "#d5e7d0",
            "600": "#60974e",
            "900": "#111b0e",
        },
        "steel": {
            "100": "#e2e8f0",
            "500": "#64748b",
        }
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Manrope", "sans-serif"]
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}
