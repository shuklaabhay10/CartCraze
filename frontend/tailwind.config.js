/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "grey-stripe":"#d6d0d0",
        "black1":"#263238",

      }
    },
  },
  plugins: [],
}