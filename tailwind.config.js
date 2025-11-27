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
        success: 'rgb(34 197 94 / <alpha-value>)',
        warning: 'rgb(234 179 8 / <alpha-value>)',
        danger: 'rgb(239 68 68 / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
