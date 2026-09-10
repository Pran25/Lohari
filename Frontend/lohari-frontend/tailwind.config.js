/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        secondary: '#E67E22',
        accent: '#F39C12',
        dark: '#1a1a2e',
        light: '#ECF0F1',
        success: '#27AE60',
        danger: '#E74C3C',
        warning: '#F1C40F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}