/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--token-accent)',
          50: 'var(--token-accent-soft)',
          100: 'var(--token-accent-soft)',
          200: 'var(--token-accent-soft)',
          300: 'var(--token-accent)',
          400: 'var(--token-accent)',
          500: 'var(--token-accent)',
          600: 'var(--token-accent)',
          700: 'var(--token-accent-hover)',
          800: 'var(--token-accent-hover)',
          900: 'var(--token-accent-hover)',
          950: '#1e1b4b',
        },
        token: {
          bg: 'var(--token-bg)',
          card: 'var(--token-card)',
          'card-hover': 'var(--token-card-hover)',
          border: 'var(--token-border)',
          text: 'var(--token-text)',
          muted: 'var(--token-muted)',
          accent: 'var(--token-accent)',
          'accent-hover': 'var(--token-accent-hover)',
          'accent-soft': 'var(--token-accent-soft)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px var(--token-accent-soft)',
      }
    },
  },
  plugins: [],
}
