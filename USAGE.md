# 📖 Guía de Uso - Bingo Trycks

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 3. Abrir en el navegador
Abre `http://localhost:5173` (o el puerto que indique Vite)

---

## 🎮 Cómo usar el sistema

### Crear un Bingo

1. Haz clic en **"Crear un bingo"**
2. Configura:
   - **Emoji y título**: Personaliza el nombre
   - **Color**: Elige el color principal
   - **Tamaño**: 3×3, 4×4 o 5×5
   - **Casilla libre**: Activa/desactiva casilla central libre
   - **Tipos de victoria**: Selecciona qué cuenta como ganar
3. Agrega palabras:
   - Escribe una por una y haz clic en "Agregar una"
   - O pega una lista (una por línea) y haz clic en "Pegar todas"
   - Necesitas mínimo: **9 palabras** (3×3), **16** (4×4), **25** (5×5)
4. Haz clic en **"Crear Bingo"**

### Jugar

1. Al crear un bingo, serás redirigido al **Modo Anfitrión**
2. Comparte el link con los jugadores (botón "Compartir bingo")
3. Los jugadores pueden:
   - Hacer clic en casillas para marcarlas
   - Ver palabras marcadas por el anfitrión (con 👑)
   - Regenerar su cartón si quieren uno nuevo
   - El sistema detecta automáticamente cuando ganas

### Modo Anfitrión

1. Desde el juego, haz clic en **"Modo anfitrión"**
2. Marca las palabras/eventos que han ocurrido
3. Todos los jugadores verán estas palabras resaltadas en sus cartones
4. Ideal para:
   - Streams en vivo
   - Maratones de anime/series
   - Eventos presenciales
   - Watch parties

### Exportar e Importar Bingos

#### Exportar un Bingo

1. En el **Editor**, después de configurar tu bingo
2. Haz clic en **"📤 Exportar bingo"**
3. Se descargará un archivo JSON con toda la configuración
4. Puedes compartir este archivo con otros o guardarlo como respaldo

#### Importar un Bingo

1. En el **Editor**, haz clic en **"📥 Importar bingo"**
2. Selecciona el archivo JSON del bingo
3. El editor se llenará automáticamente con la configuración
4. Puedes modificarlo y crear un nuevo bingo

#### Exportar Todos los Bingos

1. En la **página principal**, haz clic en **"📋 Ver bingos guardados"**
2. Haz clic en **"📤 Exportar todos"**
3. Se descargará un archivo con todos tus bingos guardados
4. Útil para hacer respaldo completo

#### Importar Múltiples Bingos

1. En la **página principal**, haz clic en **"📥 Importar bingos"**
2. Selecciona un archivo JSON con múltiples bingos
3. Todos los bingos se importarán y estarán disponibles para jugar

---

## 💡 Ejemplos de uso

### Maratón de Anime
```
Palabras sugeridas:
- Playa
- Baño termal
- Poder oculto
- Flashback triste
- Transformación
- Comida exagerada
- Nariz sangrante
- Tsundere moment
- Power-up épico
- Muerte de personaje
```

### Bingo de Clases
```
Palabras sugeridas:
- "Esto es importante"
- "Pregunta en el examen"
- "¿Alguna pregunta?"
- "Como vimos la clase pasada"
- "Tarea para la próxima"
```

### Stream de Twitch
```
Palabras sugeridas:
- Donación
- Sub nuevo
- Raid
- Clip viral
- Técnico falla
- Chat spamea
- Meme del día
```

---

## 🔧 Características Técnicas

### Persistencia
- Los bingos se guardan en `localStorage`
- Cada cartón tiene un ID único
- El progreso se guarda automáticamente

### Compartir
- Cada bingo tiene un ID único en la URL
- Comparte el link completo para que otros se unan
- Los cartones son independientes por jugador
- **Exporta/Importa**: Guarda tus bingos como archivos JSON

### Sincronización
- El modo anfitrión sincroniza cada segundo
- Las palabras marcadas aparecen en todos los cartones
- No requiere conexión a internet (después de cargar)

### Formato de Exportación

Los archivos JSON exportados tienen este formato:

```json
{
  "version": "1.0",
  "bingo": {
    "title": "Mi Bingo",
    "size": 5,
    "freeCenter": true,
    "victoryTypes": ["line", "column", "diagonal", "full"],
    "words": ["Palabra1", "Palabra2", ...],
    "color": "#667eea",
    "emoji": "🎯",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

Para múltiples bingos:

```json
{
  "version": "1.0",
  "exportDate": "2024-01-01T00:00:00.000Z",
  "bingos": [...]
}
```

---

## 🐛 Solución de Problemas

### "Bingo no encontrado"
- Verifica que tengas el ID correcto
- Asegúrate de que el bingo fue creado en el mismo navegador
- Los bingos se guardan localmente (no se comparten entre dispositivos sin el link)

### Las palabras del anfitrión no aparecen
- Verifica que el anfitrión haya marcado palabras
- Recarga la página del jugador
- Asegúrate de estar usando el mismo ID de bingo

### El cartón no se guarda
- Verifica que tu navegador permita `localStorage`
- No uses modo incógnito (puede borrar datos al cerrar)

---

## 📝 Notas Importantes

- ⚠️ Los datos se guardan **localmente** en tu navegador
- 🔗 Comparte el **link completo** para que otros se unan
- 💾 Cada cartón es **independiente** por jugador
- 🎲 Puedes **regenerar** tu cartón cuando quieras
- 👑 El modo anfitrión es **opcional** pero muy útil
- 📤 **Exporta tus bingos** para hacer respaldo o compartirlos
- 📥 **Importa bingos** creados por otros o desde respaldos

---

## 🎯 Próximos Pasos

1. Crea tu primer bingo
2. Comparte el link con amigos
3. ¡Disfruta del juego!

¿Necesitas ayuda? Revisa el código o crea un issue en el repositorio.

