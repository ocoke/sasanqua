import colors from 'tailwindcss/colors'
export default {
    content: [
      "./dashboard/index.html",
      "./dashboard/**/*.{vue,js,ts,jsx,tsx}",
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