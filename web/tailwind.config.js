/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary - Orange #F58320
        primary: {
          50: '#FDE3CC',   // Lightest tint
          100: '#FAC597',  // Light tint
          200: '#F7A762',
          300: '#F4892D',
          400: '#F58320',  // Base brand color
          500: '#F58320',  // Main brand color
          600: '#C46919',
          700: '#934F13',
          800: '#62350C',
          900: '#311B06',
        },
        // Brand Secondary - Green #A4CD39
        secondary: {
          50: '#E2EFC1',   // Lightest tint
          100: '#CFE597',  // Light tint
          200: '#BCD76D',
          300: '#A9C943',
          400: '#A4CD39',  // Base brand color
          500: '#A4CD39',  // Main brand color
          600: '#83A42E',
          700: '#627B22',
          800: '#425217',
          900: '#21290B',
        },
        // Legacy accent (maps to secondary)
        accent: {
          50: '#E2EFC1',
          100: '#CFE597',
          200: '#BCD76D',
          300: '#A9C943',
          400: '#A4CD39',
          500: '#A4CD39',
          600: '#83A42E',
          700: '#627B22',
          800: '#425217',
          900: '#21290B',
        },
        // Neutral grays for light theme
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Legacy dark (now used for text/contrast)
        dark: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Semantic colors harmonized with brand
        success: {
          50: '#E2EFC1',
          100: '#CFE597',
          500: '#A4CD39',
          600: '#83A42E',
        },
        warning: {
          50: '#FDE3CC',
          100: '#FAC597',
          500: '#F58320',
          600: '#C46919',
        },
        danger: {
          50: '#FEE2E2',
          100: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(245, 131, 32, 0.3)',
        'glow-secondary': '0 0 20px rgba(164, 205, 57, 0.3)',
        'glow-primary-lg': '0 0 30px rgba(245, 131, 32, 0.4)',
        'glow-secondary-lg': '0 0 30px rgba(164, 205, 57, 0.4)',
      },
    },
  },
  plugins: [],
}

