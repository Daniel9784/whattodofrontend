import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Presmerovanie API requestov na backend
      '/login': 'http://localhost:8080',
      '/register': 'http://localhost:8080',
      '/me': 'http://localhost:8080',
      // Prípadne aj všeobecne pre všetky API endpointy
       '/api': 'http://localhost:8080'
    }
  }
})
