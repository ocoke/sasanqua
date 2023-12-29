import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
    root: './dash',
    base: '/',
    build: {
        outDir: '../public'
    },
    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./dash/src', import.meta.url))
        }
    },
    plugins: [vue()]
})