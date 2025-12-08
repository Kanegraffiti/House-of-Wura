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
          black: '#1C0B0B',
          white: '#FFF8F3',
          gold: '#FF990B',
          wine: '#672025'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif']
      },
      backgroundImage: {
        'rich-gradient': 'linear-gradient(135deg, #FF990B 0%, #672025 100%)'
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
        glow: '0 10px 30px rgba(255, 153, 11, 0.22)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0 rgba(255,153,11,0)' },
          '50%': { boxShadow: '0 0 24px rgba(255,153,11,0.22)' }
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
