/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#090909'
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('rx-checked', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `[data-state='checked'] + .${e(
            `rx-checked${separator}${className}`
          )}`
        })
      })
    }),
  ],
}
