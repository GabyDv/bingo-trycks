/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path para rutas (cambiar según tu hosting)
  // './' para GitHub Pages, '/' para Netlify/Vercel
  base: '/',
}) */

  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  
  export default defineConfig({
    plugins: [react()],
    // Base path para GitHub Pages (usa el nombre de tu repositorio)
    base: '/bingo-trycks/',  // Cambia 'bingo-trycks' por el nombre de tu repo
  })