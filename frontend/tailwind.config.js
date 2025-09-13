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
                    'sans': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                    'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
                    'display': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                  },
                  fontSize: {
                    'xs': ['0.75rem', { lineHeight: '1rem' }],
                    'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                    'base': ['1rem', { lineHeight: '1.5rem' }],
                    'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                    'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                    '2xl': ['1.5rem', { lineHeight: '2rem' }],
                    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                    '5xl': ['3rem', { lineHeight: '1' }],
                    '6xl': ['3.75rem', { lineHeight: '1' }],
                  },
                  fontWeight: {
                    'normal': '400',
                    'medium': '500',
                    'semibold': '600',
                    'bold': '700',
                  },
                  lineHeight: {
                    'none': '1',
                    'tight': '1.25',
                    'relaxed': '1.625',
                  },
                  letterSpacing: {
                    'tight': '-0.025em',
                    'widest': '0.1em',
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



