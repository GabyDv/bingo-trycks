import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path para GitHub Pages (usa el nombre de tu repositorio)
  base: '/bingo-trycks/',
})