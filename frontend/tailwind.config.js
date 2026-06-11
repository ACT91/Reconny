/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#fdfbfa',
          yellow: '#FFD966',
          dark: '#2B2B2B',
          text: '#1A1A1A',
          muted: '#8A8A8A',
        },
        sidebar: {
          bg: '#0A0A0A',
          hover: '#1A1A1A',
          active: '#FFD966',
        },
      },
      boxShadow: {
        'card': '0 10px 40px -10px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 40px -10px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
