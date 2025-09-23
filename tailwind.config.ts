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
        luxurious: 'cubic-bezier(0.19, 1, 0.22, 1)'
      },
      boxShadow: {
        glow: '0 10px 30px rgba(201, 162, 39, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
