import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sasanqua Analytics",
  description: "Sasanqua Analytics: Simple, privacy-friendly, real-time traffic insight at the edge.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'General',
        items: [
          { text: 'Getting Started', link: '/guide/get-started' },
          { text: 'Reference API', link: '/api' }
        ]
      },
      {
        text: 'Usage',
        items: [
          { text: 'Users', link: '/guide/usage/users' },
          { text: 'Add Websites', link: '/guide/usage/sites' },
          { text: 'Dashboard', link: '/guide/usage/dashboard' },
          { text: 'Settings', link: '/guide/usage/settings' },
          {
            text: 'Clients & Plugins',
            link: '/guide/clients/',
          },
        ]
      },
      {
        text: 'Deployment',
        items: [
          { text: 'Supported Providers', link: '/guide/deploy/providers' },
          { text: 'Vercel & Vercel KV', link: '/guide/deploy/vercel-and-vercel-kv' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
