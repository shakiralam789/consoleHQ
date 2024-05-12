/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#1E4D57',
        'secondary': '#FF6C3E',
        'default-green': '#27AE60',
        'gray-dark': '#082020',
        'gray-light': '#64676D'
      }
    },
  },
  plugins: [],
}