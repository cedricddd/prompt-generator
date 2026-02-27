import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    hmr: {
      host: 'prompt-generator.ced-it.be',
      protocol: 'wss',
      clientPort: 443
    },
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
