/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["retro", "corporate", "lemonade", "winter"],
  },
  darkMode: ["class", '[data-theme="night"]'],
};
