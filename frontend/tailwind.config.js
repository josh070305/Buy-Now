/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
        },
        success: {
          DEFAULT: '#10B981',
          subtle: '#ECFDF5',
          text: '#047857',
        }
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(15, 23, 42, 0.1)',
        highlight: '0 0 0 2px #4F46E5, 0 10px 25px -3px rgba(79, 70, 229, 0.15)',
      },
      borderRadius: {
        'md-lg': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
