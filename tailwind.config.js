import colors from 'tailwindcss/colors'
export default {
    content: [
      "./dash/index.html",
      "./dash/**/*.{vue,js,ts,jsx,tsx}",
    ],
    plugins: [],
    theme: {
      extend: {
        colors: {
          primary: colors.blue,
        }
      }
    },
    darkMode: 'class'
}