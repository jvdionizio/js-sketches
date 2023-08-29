/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'fira-code': ['"Fira Code"', 'monospace'],
        'jost': ['"Jost"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
