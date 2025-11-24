/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--destructive)',
        info: 'var(--info)',
      }
    },
  },
  plugins: [],
}
