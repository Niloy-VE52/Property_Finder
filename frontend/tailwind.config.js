/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4fbf7',
          100: '#e7f7ed',
          200: '#c3ebdb',
          300: '#90d7bf',
          400: '#54ba9b',
          500: '#349e80', // premium teal-green
          600: '#257f68',
          700: '#1d6554',
          800: '#165044',
          900: '#114138',
          950: '#082520',
        },
        gold: {
          50: '#fdfbe7',
          100: '#fbf4c3',
          200: '#f6e783',
          300: '#eecf3f',
          400: '#e3b516',
          500: '#ca970b', // premium gold accent
          600: '#a57307',
          700: '#805207',
          800: '#67410c',
          900: '#58360f',
          950: '#331c04',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
