/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',        // pure matte black background
        blood: '#8B0000',       // deep red rim-light accent
        ember: '#3a0a0a',       // ambient red glow base
        gold: '#D4AF37',        // luxury gold accent
        'gold-soft': '#e8cf87',
        pearl: '#FFFFFF',       // primary text
        ash: '#8A8A8A',         // secondary text
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.35em',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        breathe: 'breathe 9s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
