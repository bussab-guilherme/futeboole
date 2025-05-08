import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8080',
    },
  },
  test: {
    environment: 'jsdom', // simula o navegador para testes
    setupFiles: './src/setupTests.js', // configura o jest-dom
    globals: true,
  },
})

