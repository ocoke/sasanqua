import colors from 'tailwindcss/colors'
export default {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./app.vue",
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