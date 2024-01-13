export default defineNuxtConfig({
    ssr: false,
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        head: {
            title: "Sasanqua Analytics",
            htmlAttrs: {
                lang: "en",
            },
            meta: [
                {
                    charset: "utf-8",
                },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    hid: "description",
                    name: "description",
                    content: "",
                },
            ],
            link: [
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: true,
                },
                {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Sometype+Mono:wght@400;500;600;700&display=swap",
                }
            ]
        }
    }
})