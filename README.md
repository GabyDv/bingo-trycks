# 🎯 Bingo Trycks

Un sistema de bingo web **editable y reutilizable** para cualquier contexto (anime, streams, eventos, clases, política, lo que sea).

> **Nota**: Sistema 100% offline, funciona completamente sin conexión a internet.

## ✨ Características

- 🎨 **Totalmente personalizable**: Define tus propias palabras/situaciones
- 🚀 **100% Offline**: Funciona completamente sin conexión a internet
- 📱 **Responsive**: Funciona en móvil y desktop
- 💾 **Persistencia local**: Guarda tu progreso automáticamente
- 📤 **Exportar/Importar**: Guarda y comparte tus bingos y cartones como archivos JSON
- 🎮 **Juegos inacabados**: Retoma tus partidas guardadas cuando quieras
- 🌐 **100% Estático**: Desplegable en cualquier hosting estático (Netlify, Vercel, GitHub Pages)

## 🚀 Inicio rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build para producción

```bash
npm run build
```

Esto genera una carpeta `dist/` con archivos estáticos listos para desplegar.

### Previsualizar build

```bash
npm run preview
```

## 📖 Cómo usar

1. **Crear un bingo**: Haz clic en "Crear un bingo"
   - Define el tamaño del tablero (3×3, 4×4, 5×5)
   - Agrega tus palabras/eventos
   - Personaliza el título, color y emoji
   - Selecciona los tipos de victoria

2. **Jugar**: 
   - Cada vez que juegas recibes un cartón aleatorio
   - Haz clic en las casillas para marcarlas
   - El sistema detecta automáticamente cuando ganas
   - Tu progreso se guarda automáticamente

3. **Exportar/Importar**: 
   - **Exportar bingo**: Guarda un bingo como archivo JSON desde el editor
   - **Importar bingo**: Carga un bingo desde un archivo JSON
   - **Exportar cartón**: Guarda tu cartón con progreso para compartirlo o respaldarlo
   - **Importar cartón**: Carga un cartón guardado para continuar jugando
   - **Exportar todos**: Desde la página principal, exporta todos tus bingos guardados
   - **Importar múltiples**: Importa varios bingos a la vez

4. **Retomar juegos**: 
   - Ve a "Juegos inacabados" en el menú principal
   - Retoma cualquier partida guardada con tu progreso intacto

## 🧩 Estructura del proyecto

```
src/
├── pages/
│   ├── Landing.jsx    # Página de inicio
│   ├── Editor.jsx     # Editor de bingo
│   ├── Game.jsx       # Juego interactivo
│   └── Host.jsx       # Modo anfitrión
├── utils/
│   └── bingoUtils.js  # Utilidades (generación, detección, etc.)
├── App.jsx            # Router principal
└── main.jsx           # Entry point
```

## 💡 Casos de uso

- ✅ Maratón de anime
- ✅ Drinking games (responsable 😅)
- ✅ Bingo de frases políticas
- ✅ Clases (palabras que dicen los profes)
- ✅ Conferencias
- ✅ Streams de Twitch
- ✅ Series / reality shows

## 🛠️ Tecnologías

- **React** - Framework UI
- **React Router** - Navegación
- **Vite** - Build tool
- **LocalStorage** - Persistencia local
- **CSS** - Estilos personalizados

## 📝 Notas

- Los bingos se guardan en `localStorage` del navegador
- Cada cartón tiene un ID único
- **100% Offline**: No requiere conexión a internet para funcionar
- No requiere backend (todo funciona en el cliente)
- **Proyecto estático**: Puede desplegarse en cualquier hosting estático
- Similar a un bingo físico: creas tu bingo, juegas solo, guardas tu progreso

## 🌐 Despliegue

Este es un proyecto **100% estático**. Puedes desplegarlo en:

- **Netlify** (recomendado): Arrastra la carpeta `dist/` o conecta GitHub
- **Vercel**: Conecta tu repositorio, detecta Vite automáticamente
- **GitHub Pages**: Ver `DEPLOY.md` para instrucciones
- **Cualquier hosting estático**: Solo sube la carpeta `dist/`

Ver `DEPLOY.md` para instrucciones detalladas de despliegue.

## 🎯 Próximas mejoras (opcional)

- [x] Exportar/importar bingos ✅
- [ ] Sincronización en tiempo real con WebSockets
- [ ] Sonidos personalizados
- [ ] Temas predefinidos
- [ ] Estadísticas de juego
- [ ] Modo multijugador competitivo

---

Hecho con ❤️ para crear bingos personalizados rápidamente

