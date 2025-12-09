# 🚀 Guía de Despliegue - Bingo Trycks

## 📋 Sobre el Proyecto

**Bingo Trycks es un proyecto estático** que funciona completamente en el cliente (frontend). No requiere servidor backend ni base de datos.

### ✅ Características del Proyecto Estático

- **100% Frontend**: Todo funciona en el navegador
- **Sin Backend**: No necesita servidor Node.js en producción
- **LocalStorage**: Los datos se guardan localmente en el navegador
- **Desplegable en cualquier hosting estático**: GitHub Pages, Netlify, Vercel, etc.

---

## 🛠️ Desarrollo Local

### Requisitos

- **Node.js** 16+ (para desarrollo)
- **npm** o **yarn**

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

---

## 📦 Build para Producción

### Generar archivos estáticos

```bash
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos estáticos listos para desplegar.

### Previsualizar el build

```bash
npm run preview
```

---

## 🌐 Opciones de Despliegue

### 1. GitHub Pages (Gratis)

#### Configuración automática con GitHub Actions

1. Crea un archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. En tu repositorio de GitHub:
   - Ve a **Settings** → **Pages**
   - Selecciona **Source**: `gh-pages` branch
   - Tu sitio estará en: `https://tuusuario.github.io/bingo-trycks`

#### Configuración manual

```bash
# 1. Build del proyecto
npm run build

# 2. Instalar gh-pages
npm install --save-dev gh-pages

# 3. Agregar script en package.json
# "deploy": "gh-pages -d dist"

# 4. Desplegar
npm run deploy
```

---

### 2. Netlify (Gratis y Fácil)

#### Opción A: Arrastrar y soltar

1. Ejecuta `npm run build`
2. Ve a [netlify.com](https://netlify.com)
3. Arrastra la carpeta `dist/` a Netlify
4. ¡Listo! Tu sitio estará en línea

#### Opción B: Conectando GitHub

1. Conecta tu repositorio de GitHub a Netlify
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Netlify detectará automáticamente los cambios y desplegará

#### Opción C: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Desplegar
netlify deploy --prod --dir=dist
```

---

### 3. Vercel (Gratis)

#### Con GitHub

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Vercel detectará automáticamente Vite
3. Configuración automática:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

---

### 4. Surge.sh (Gratis y Simple)

```bash
# Instalar Surge
npm install -g surge

# Build
npm run build

# Desplegar
cd dist
surge
# Sigue las instrucciones para crear tu dominio
```

---

### 5. Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar (si es primera vez)
firebase init hosting

# Build
npm run build

# Desplegar
firebase deploy --only hosting
```

---

### 6. Servidor Web Tradicional (Apache/Nginx)

1. Ejecuta `npm run build`
2. Copia el contenido de `dist/` a tu servidor web
3. Configura tu servidor para servir `index.html` en todas las rutas (SPA)

#### Nginx ejemplo:

```nginx
server {
    listen 80;
    server_name tudominio.com;
    root /ruta/a/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache ejemplo (.htaccess):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ⚙️ Configuración de Vite para Rutas

Si usas rutas con React Router, asegúrate de que `vite.config.js` tenga:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './' // Importante para GitHub Pages
})
```

O si tienes un dominio personalizado:

```js
export default defineConfig({
  plugins: [react()],
  base: '/' // Para Netlify, Vercel, etc.
})
```

---

## 📝 Notas Importantes

### ⚠️ Limitaciones del Proyecto Estático

1. **LocalStorage es local**: Los bingos solo se guardan en el navegador del usuario
2. **No hay sincronización entre dispositivos**: Cada dispositivo tiene sus propios datos
3. **Compartir requiere el link**: Los jugadores necesitan el link del bingo para unirse

### ✅ Ventajas

- **Gratis**: Puedes desplegar en servicios gratuitos
- **Rápido**: No hay servidor que mantener
- **Escalable**: Puede manejar muchos usuarios simultáneos
- **Simple**: Solo archivos estáticos

---

## 🔧 Troubleshooting

### Las rutas no funcionan después del deploy

- Asegúrate de que tu servidor esté configurado para servir `index.html` en todas las rutas (SPA)
- Verifica la configuración de `base` en `vite.config.js`

### Los bingos no se guardan

- Verifica que el navegador permita `localStorage`
- No uses modo incógnito (puede borrar datos)

### El build falla

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Recursos

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment)
- [GitHub Pages](https://pages.github.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎯 Recomendación

Para empezar rápido, usa **Netlify** o **Vercel**:
- ✅ Configuración automática
- ✅ HTTPS incluido
- ✅ Dominio personalizado gratis
- ✅ Deploy automático desde GitHub

¡Tu bingo estará en línea en minutos! 🎉

