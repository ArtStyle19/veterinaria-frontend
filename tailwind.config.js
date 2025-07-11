// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Essential for Tailwind to scan your components
  ],
  theme: {
    extend: {
      boxShadow: {
          glass: '0 4px 30px rgba(0,0,0,0.15)',
        },
    },
  },
  plugins: [], // No plugins needed here for @tailwindcss/postcss setup unless you have custom Tailwind plugins
}