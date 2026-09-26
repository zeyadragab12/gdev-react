/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        obsidian: '#0A0A0A',
        champagne: '#F5F4F0',
        muted: '#A6A4A3',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderColor: {
        glass: 'rgba(255,255,255,0.1)',
        'glass-strong': 'rgba(255,255,255,0.18)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(245,244,240,0.45)' },
          '70%': { boxShadow: '0 0 0 14px rgba(245,244,240,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245,244,240,0)' },
        },
        drift: {
          to: { transform: 'translate(-40px, -30px)' },
        },
        kenburns: {
          from: { transform: 'scale(1.15)' },
          to: { transform: 'scale(1)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s infinite',
        drift: 'drift 14s ease-in-out infinite alternate',
        kenburns: 'kenburns 9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-up': 'fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 400ms ease both',
      },
    },
  },
  plugins: [],
};
