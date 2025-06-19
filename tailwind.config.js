/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'walmart-blue': '#0071ce',
        'walmart-yellow': '#ffc220',
        'walmart-dark-blue': '#004c91',
        'walmart-light-blue': '#0084ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 4s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'walmart': '0 4px 6px -1px rgba(0, 113, 206, 0.1), 0 2px 4px -1px rgba(0, 113, 206, 0.06)',
        'walmart-lg': '0 10px 15px -3px rgba(0, 113, 206, 0.1), 0 4px 6px -2px rgba(0, 113, 206, 0.05)',
        'walmart-xl': '0 20px 25px -5px rgba(0, 113, 206, 0.1), 0 10px 10px -5px rgba(0, 113, 206, 0.04)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};