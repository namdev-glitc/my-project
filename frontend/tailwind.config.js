/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EXP Techno Logy Theme Colors
        'exp': {
          'primary': '#00bcd4',      // Cyan
          'secondary': '#3f51b5',    // Indigo
          'accent': '#e91e63',       // Magenta
          'dark': '#0a0e27',         // Dark blue background
          'light': '#f8f9fa',        // Light background
        },
        'gradient': {
          'start': '#00bcd4',        // Cyan start
          'middle': '#3f51b5',       // Indigo middle
          'end': '#e91e63',          // Magenta end
        }
      },
      backgroundImage: {
        'exp-gradient': 'linear-gradient(135deg, #00bcd4 0%, #3f51b5 50%, #e91e63 100%)',
        'exp-gradient-radial': 'radial-gradient(circle, #00bcd4 0%, #3f51b5 50%, #e91e63 100%)',
        'exp-gradient-conic': 'conic-gradient(from 180deg at 50% 50%, #00bcd4 0deg, #3f51b5 120deg, #e91e63 240deg, #00bcd4 360deg)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'exp': '0 4px 20px rgba(0, 188, 212, 0.3)',
        'exp-lg': '0 10px 40px rgba(0, 188, 212, 0.4)',
        'exp-xl': '0 20px 60px rgba(0, 188, 212, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}



