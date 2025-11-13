/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb", // example gray border color
        primary: { 
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'hindi': ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        'bengali': ['Noto Sans Bengali', 'system-ui', 'sans-serif'],
        'tamil': ['Noto Sans Tamil', 'system-ui', 'sans-serif'],
        'telugu': ['Noto Sans Telugu', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}