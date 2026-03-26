/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fef7ff',
        primary: '#e040a0',
        secondary: '#7c52aa',
        tertiary: '#0096cc',
        surface_container_lowest: '#ffffff',
        surface_container_low: '#fbf2fb',
        surface_container: '#f8eef8',
        surface_container_high: '#f2e8f2',
        surface_container_highest: '#ece2ec',
        on_surface: '#2e1a28',
        on_primary: '#ffffff',
        error: '#e53e3e',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'tinted-primary': '0 4px 16px rgba(224, 64, 160, 0.2)',
        'tinted-secondary': '0 4px 16px rgba(124, 82, 170, 0.2)',
      },
      borderRadius: {
        'card': '16px',
      }
    },
  },
  plugins: [],
}
