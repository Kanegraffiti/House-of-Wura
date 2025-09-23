import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        wura: {
          black: '#0B0B0B',
          white: '#FFFFFF',
          gold: '#C9A227',
          wine: '#7B002C'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif']
      },
      backgroundImage: {
        'rich-gradient': 'linear-gradient(135deg, #C9A227 0%, #7B002C 100%)'
      },
      transitionTimingFunction: {
        luxurious: 'cubic-bezier(0.19, 1, 0.22, 1)',
        std: 'var(--ease-std)',
        emph: 'var(--ease-emph)',
        out: 'var(--ease-out)',
        in: 'var(--ease-in)'
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        250: '250ms',
        300: '300ms'
      },
      boxShadow: {
        glow: '0 10px 30px rgba(201, 162, 39, 0.25)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0 rgba(201,162,39,0)' },
          '50%': { boxShadow: '0 0 24px rgba(201,162,39,0.25)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.75s linear infinite',
        glow: 'glow 2.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
