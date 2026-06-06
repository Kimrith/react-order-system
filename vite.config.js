import { defineConfig } from 'vite'
import react from '@vitejs/react-viteapp' // or your standard react plugin

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