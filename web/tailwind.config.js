/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary - Gold/Amber (Dark Theme)
        primary: {
          50: 'rgba(216,181,71,0.1)',
          100: 'rgba(216,181,71,0.2)',
          200: 'rgba(216,181,71,0.3)',
          300: 'rgba(216,181,71,0.4)',
          400: 'rgba(216,181,71,0.5)',
          500: '#D8B547',  // Main brand color - Gold
          600: '#E8C55A',
          700: '#C9A03D',
          800: '#B8941F',
          900: '#9A7A1A',
        },
        // Brand Secondary - Gold (Dark Theme)
        secondary: {
          50: 'rgba(216,181,71,0.1)',
          100: 'rgba(216,181,71,0.2)',
          200: 'rgba(216,181,71,0.3)',
          300: 'rgba(216,181,71,0.4)',
          400: 'rgba(216,181,71,0.5)',
          500: '#D8B547',  // Main brand color - Gold
          600: '#E8C55A',
          700: '#C9A03D',
          800: '#B8941F',
          900: '#9A7A1A',
        },
        // Legacy accent (maps to secondary)
        accent: {
          50: 'rgba(216,181,71,0.1)',
          100: 'rgba(216,181,71,0.2)',
          200: 'rgba(216,181,71,0.3)',
          300: 'rgba(216,181,71,0.4)',
          400: 'rgba(216,181,71,0.5)',
          500: '#D8B547',
          600: '#E8C55A',
          700: '#C9A03D',
          800: '#B8941F',
          900: '#9A7A1A',
        },
        // Neutral grays for dark theme
        neutral: {
          50: '#7E8AAE',
          100: '#B6C2E2',
          200: '#F5F7FF',
          300: '#F5F7FF',
          400: '#B6C2E2',
          500: '#7E8AAE',
          600: '#5A6B8A',
          700: '#0F1A2E',
          800: '#0B1220',
          900: '#070A0F',
          950: '#070A0F',
        },
        // Legacy dark (now used for text/contrast)
        dark: {
          50: '#7E8AAE',
          100: '#B6C2E2',
          200: '#F5F7FF',
          300: '#F5F7FF',
          400: '#B6C2E2',
          500: '#7E8AAE',
          600: '#5A6B8A',
          700: '#0F1A2E',
          800: '#0B1220',
          900: '#070A0F',
          950: '#070A0F',
        },
        // Semantic colors harmonized with brand
        success: {
          50: 'rgba(34,197,94,0.1)',
          100: 'rgba(34,197,94,0.2)',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          50: 'rgba(245,158,11,0.1)',
          100: 'rgba(245,158,11,0.2)',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          50: 'rgba(239,68,68,0.1)',
          100: 'rgba(239,68,68,0.2)',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(216, 181, 71, 0.3)',
        'glow-secondary': '0 0 20px rgba(216, 181, 71, 0.3)',
        'glow-primary-lg': '0 0 30px rgba(216, 181, 71, 0.4)',
        'glow-secondary-lg': '0 0 30px rgba(216, 181, 71, 0.4)',
      },
    },
  },
  plugins: [],
}

