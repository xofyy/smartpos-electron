/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#0F172A', // Deep Navy Blue
          emerald: '#10B981', // Vibrant Emerald Green
          dark: '#020617', // Darker Navy
          light: '#F0FDF4', // Light Emerald tint
        }
      }
    },
  },
  plugins: [],
}
