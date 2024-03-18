export default defineNuxtConfig({
    ssr: false,
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        '@nuxt/test-utils/module',
        '@nuxtjs/i18n',
    ],
    i18n: {
        vueI18n: './i18n.config.ts',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root'
        },
        locales: [
            {
              code: 'en-US',
              file: 'en-US.ts',
              name: 'English (US)'
            },
            {
              code: 'es-ES',
              file: 'es-ES.ts',
              name: 'Español (España)',
            },
            {
              code: 'fr-FR',
              file: 'fr-FR.ts',
              name: 'Français (France)',
            },
            {
                code: 'zh-CN',
                file: 'zh-CN.ts',
                name: '中文 (中国)',
            }
          ],
          lazy: true,
          langDir: 'locales',
          defaultLocale: 'en-US',
          strategy: 'no_prefix',
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
                    crossorigin: "anonymous",
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