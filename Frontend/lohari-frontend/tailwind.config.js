/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand Colors (updated to cyan/indigo) ───
        primary: '#0f172a',      // slate-900 (dark base)
        secondary: '#22d3ee',    // cyan-400 (was orange)
        accent: '#6366f1',       // indigo-500
        dark: '#020617',         // slate-950
        light: '#f1f5f9',        // slate-100
        success: '#10b981',      // emerald-500
        danger: '#f43f5e',       // rose-500
        warning: '#f59e0b',      // amber-500

        // ─── Extra brand tokens (optional) ───
        brand: {
          cyan: '#22d3ee',
          indigo: '#6366f1',
          violet: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        glow: '0 0 30px -6px rgba(34, 211, 238, 0.6)',
        'glow-lg': '0 0 50px -4px rgba(34, 211, 238, 0.8)',
        'glow-indigo': '0 0 30px -6px rgba(99, 102, 241, 0.6)',
      },
    },
  },
  plugins: [],
}