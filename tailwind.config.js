/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0F172A',
          secondary: '#1E293B',
        },
        card: {
          DEFAULT: '#1F2937',
          hover: '#243044',
        },
        brand: {
          primary: '#2563EB',
          accent: '#3B82F6',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        alinma: {
          navy: '#0B1A3D',
          gold: '#C9A24B',
        },
        border: {
          subtle: 'rgba(148, 163, 184, 0.12)',
          DEFAULT: 'rgba(148, 163, 184, 0.18)',
          strong: 'rgba(148, 163, 184, 0.28)',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"IBM Plex Sans Arabic"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(0, 0, 0, 0.35)',
        card: '0 8px 30px -8px rgba(0, 0, 0, 0.5)',
        glow: '0 0 0 1px rgba(59, 130, 246, 0.15), 0 8px 24px -4px rgba(37, 99, 235, 0.35)',
        'glow-danger': '0 0 0 1px rgba(239, 68, 68, 0.2), 0 8px 24px -4px rgba(239, 68, 68, 0.35)',
        'glow-success': '0 0 0 1px rgba(16, 185, 129, 0.2), 0 8px 24px -4px rgba(16, 185, 129, 0.35)',
        'glow-warning': '0 0 0 1px rgba(245, 158, 11, 0.2), 0 8px 24px -4px rgba(245, 158, 11, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'live-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.35s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
        'live-blink': 'live-blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
