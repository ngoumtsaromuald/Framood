import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.688rem', { lineHeight: '1.4', letterSpacing: '0.03em' }],
        'sm':   ['0.75rem',  { lineHeight: '1.5' }],
        'base': ['0.875rem', { lineHeight: '1.6' }],
        'md':   ['1rem',     { lineHeight: '1.5' }],
        'lg':   ['1.125rem', { lineHeight: '1.4' }],
        'xl':   ['1.25rem',  { lineHeight: '1.3' }],
        '2xl':  ['1.5rem',   { lineHeight: '1.25' }],
        '3xl':  ['2rem',     { lineHeight: '1.15' }],
        '4xl':  ['2.5rem',   { lineHeight: '1.1' }],
        'hero': ['clamp(3rem, 8vw, 5.75rem)', { lineHeight: '1.0' }],
      },
      colors: {
        gold: {
          DEFAULT: '#C8A050',
          light: '#E8C878',
          dark: '#8A6020',
          dim: 'rgba(200, 160, 80, 0.15)',
        },
        bg: '#0A0906',
        card: {
          DEFAULT: '#131109',
          2: '#181510',
        },
        cream: '#F0E8D0',
        success: '#50C070',
        warning: '#E8A020',
        error: '#E05040',
        info: '#5080E0',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,0.4)',
        md: '0 8px 24px rgba(0,0,0,0.6)',
        lg: '0 20px 48px rgba(0,0,0,0.8)',
        gold: '0 0 24px rgba(200,160,80,0.15)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
