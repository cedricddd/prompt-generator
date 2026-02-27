import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 4749,
    strictPort: true,
    hmr: process.env.HMR_HOST
      ? { host: process.env.HMR_HOST, protocol: 'wss', clientPort: 443 }
      : true,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
