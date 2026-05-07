/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'construct-orange': '#ff8c32',
        'construct-dark': '#08060d',
      },
    },
  },
  plugins: [],
}