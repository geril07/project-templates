import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE')

  return {
    define: {
      global: 'globalThis',
    },
    plugins: [tanstackRouter({ autoCodeSplitting: true }), viteReact(), svgr()],
    server: {
      host: true,
      port: 3000,
      // -----------------------------------------------------------------
      // Proxy configuration
      // -----------------------------------------------------------------
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // e.g. https://api.myapp.com
          // changeOrigin: true, // needed for virtual hosted sites
          secure: false, // set to true if you use https with a valid cert
          rewrite: (path) => path.replace(/^\/api/, ''), // strip `/api` prefix
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  }
})
