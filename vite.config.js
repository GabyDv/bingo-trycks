import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path: '/' para Vercel/Netlify, '/bingo-trycks/' para GitHub Pages
  base: '/',
})