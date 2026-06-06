import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Mimic Vercel's api rewrite locally
      '/api': {
        target: 'http://3.27.242.36',
        changeOrigin: true,
      },
      // Mimic Vercel's uploads rewrite locally
      '/uploads': {
        target: 'http://3.27.242.36',
        changeOrigin: true,
      }
    }
  }
})