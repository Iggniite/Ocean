/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1a', // Deep ocean dark
        surface: 'rgba(20, 30, 48, 0.7)', // Glassmorphism surface
        surfaceBorder: 'rgba(255, 255, 255, 0.1)',
        primary: '#0ea5e9', // Oceanic blue
        safe: '#10b981', // Emerald green
        moderate: '#f59e0b', // Amber
        dangerous: '#ef4444', // Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        md: '12px',
      }
    },
  },
  plugins: [],
}
