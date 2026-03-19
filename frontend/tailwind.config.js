/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ── Paleta OTIUM (espeja variables.css) ────────────────────────
      colors: {
        cyan: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
        bg: {
          base: '#050e1a',
          sidebar: '#081422',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        base: '12px',
        pill: '50px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      // ── Breakpoints del proyecto ───────────────────────────────────
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
