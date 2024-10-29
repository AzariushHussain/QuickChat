/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: 'rgb(121, 134, 69)', 
        customCream: 'rgb(254, 250, 224)',
        customDarkCream: 'rgb(242, 238, 215)',
        customDarkGreen: 'rgb(98, 111, 71)'
      },
    },
  },
  plugins: [],
}

