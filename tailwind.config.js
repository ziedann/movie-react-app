/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(3 0 20)",
        'light-100': "rgb(206 206 251)",
        'light-200': "rgb(168 181 219)",
        'gray-100': "rgb(156 164 171)",
        'dark-100': "rgb(15 13 35)",
      },
      screens: {
        'xs': '480px',
      },
      opacity: {
        '5': '0.05',
      },
    },
  },
  plugins: [],
}

