/**
 * Utilidades para manejar bingos, cartones y detección de victorias
 */

/**
 * Genera un ID único para el bingo
 */
export function generateBingoId() {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Calcula el mínimo de palabras necesarias según el tamaño
 */
export function getMinWords(size) {
  return size * size
}

/**
 * Genera un cartón aleatorio basado en las palabras y tamaño
 */
export function generateCard(words, size, freeCenter = false) {
  const shuffled = [...words].sort(() => Math.random() - 0.5)
  const card = []
  let wordIndex = 0

  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      const isCenter = freeCenter && i === Math.floor(size / 2) && j === Math.floor(size / 2)
      if (isCenter) {
        row.push({ text: '🎯 LIBRE', isFree: true, marked: true })
      } else {
        row.push({ 
          text: shuffled[wordIndex % shuffled.length], 
          isFree: false, 
          marked: false 
        })
        wordIndex++
      }
    }
    card.push(row)
  }

  return card
}

/**
 * Detecta si hay una línea completa (horizontal)
 */
export function checkLine(card, rowIndex) {
  return card[rowIndex].every(cell => cell.marked)
}

/**
 * Detecta si hay una columna completa (vertical)
 */
export function checkColumn(card, colIndex) {
  return card.every(row => row[colIndex].marked)
}

/**
 * Detecta si hay una diagonal completa
 */
export function checkDiagonal(card, isMain = true) {
  const size = card.length
  if (isMain) {
    // Diagonal principal (de arriba-izquierda a abajo-derecha)
    return card.every((row, i) => row[i].marked)
  } else {
    // Diagonal secundaria (de arriba-derecha a abajo-izquierda)
    return card.every((row, i) => row[size - 1 - i].marked)
  }
}

/**
 * Detecta si el cartón está completo
 */
export function checkFullCard(card) {
  return card.every(row => row.every(cell => cell.marked))
}

/**
 * Detecta todas las victorias posibles en el cartón
 */
export function detectWins(card, victoryTypes) {
  const wins = []
  const size = card.length

  // Líneas horizontales
  if (victoryTypes.includes('line')) {
    for (let i = 0; i < size; i++) {
      if (checkLine(card, i)) {
        wins.push({ type: 'line', index: i, direction: 'horizontal' })
      }
    }
  }

  // Columnas verticales
  if (victoryTypes.includes('column')) {
    for (let i = 0; i < size; i++) {
      if (checkColumn(card, i)) {
        wins.push({ type: 'column', index: i, direction: 'vertical' })
      }
    }
  }

  // Diagonales
  if (victoryTypes.includes('diagonal')) {
    if (checkDiagonal(card, true)) {
      wins.push({ type: 'diagonal', direction: 'main' })
    }
    if (checkDiagonal(card, false)) {
      wins.push({ type: 'diagonal', direction: 'secondary' })
    }
  }

  // Cartón completo
  if (victoryTypes.includes('full')) {
    if (checkFullCard(card)) {
      wins.push({ type: 'full' })
    }
  }

  return wins
}

/**
 * Guarda un bingo en localStorage
 */
export function saveBingo(bingo) {
  const bingos = getSavedBingos()
  bingos[bingo.id] = bingo
  localStorage.setItem('bingos', JSON.stringify(bingos))
}

/**
 * Obtiene un bingo guardado por ID
 */
export function getBingo(id) {
  const bingos = getSavedBingos()
  return bingos[id] || null
}

/**
 * Obtiene todos los bingos guardados
 */
export function getSavedBingos() {
  const stored = localStorage.getItem('bingos')
  return stored ? JSON.parse(stored) : {}
}

/**
 * Elimina un bingo guardado
 */
export function deleteBingo(id) {
  const bingos = getSavedBingos()
  if (bingos[id]) {
    delete bingos[id]
    localStorage.setItem('bingos', JSON.stringify(bingos))
    return true
  }
  return false
}

/**
 * Elimina todos los cartones asociados a un bingo
 */
export function deleteBingoCards(bingoId) {
  const keysToDelete = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith(`card_${bingoId}_`) || key.startsWith(`currentCardId_${bingoId}`) || key.startsWith(`lastPlayed_${bingoId}_`))) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(key => localStorage.removeItem(key))
}

/**
 * Guarda el estado de un cartón
 */
export function saveCardState(bingoId, cardId, card) {
  const key = `card_${bingoId}_${cardId}`
  localStorage.setItem(key, JSON.stringify(card))
  saveLastPlayed(bingoId, cardId)
}

/**
 * Obtiene el estado guardado de un cartón
 */
export function getCardState(bingoId, cardId) {
  const key = `card_${bingoId}_${cardId}`
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

/**
 * Genera un ID único para un cartón
 */
export function generateCardId() {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Obtiene todos los juegos inacabados (cartones con progreso)
 */
export function getIncompleteGames() {
  const games = []
  const bingos = getSavedBingos()
  
  // Buscar todos los cartones guardados
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('card_')) {
      const parts = key.split('_')
      if (parts.length >= 3) {
        const bingoId = parts[1]
        const cardId = parts.slice(2).join('_')
        const bingo = bingos[bingoId]
        
        if (bingo) {
          const card = getCardState(bingoId, cardId)
          if (card) {
            // Verificar si el juego está incompleto (tiene casillas marcadas pero no completo)
            const markedCount = card.flat().filter(cell => cell.marked && !cell.isFree).length
            const totalCells = bingo.size * bingo.size
            const freeCells = bingo.freeCenter ? 1 : 0
            const maxMarked = totalCells - freeCells
            
            if (markedCount > 0 && markedCount < maxMarked) {
              // Verificar si hay victorias
              const wins = detectWins(card, bingo.victoryTypes)
              const isComplete = wins.length > 0 && wins.some(w => w.type === 'full')
              
              if (!isComplete) {
                games.push({
                  bingoId,
                  cardId,
                  bingo,
                  card,
                  markedCount,
                  lastPlayed: localStorage.getItem(`lastPlayed_${bingoId}_${cardId}`) || new Date().toISOString()
                })
              }
            }
          }
        }
      }
    }
  }
  
  // Ordenar por última vez jugado (más reciente primero)
  return games.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
}

/**
 * Guarda la fecha de última vez jugado
 */
export function saveLastPlayed(bingoId, cardId) {
  const key = `lastPlayed_${bingoId}_${cardId}`
  localStorage.setItem(key, new Date().toISOString())
}

/**
 * Exporta un cartón para compartir/guardar
 */
export function exportCard(bingo, card, cardId) {
  const exportData = {
    version: '1.0',
    type: 'card',
    bingoId: bingo.id,
    cardId: cardId,
    bingo: {
      title: bingo.title,
      size: bingo.size,
      freeCenter: bingo.freeCenter,
      victoryTypes: bingo.victoryTypes,
      words: bingo.words,
      color: bingo.color,
      emoji: bingo.emoji
    },
    card: card,
    exportedAt: new Date().toISOString()
  }
  return JSON.stringify(exportData, null, 2)
}

/**
 * Importa un cartón desde JSON
 */
export function importCard(jsonString) {
  try {
    const data = JSON.parse(jsonString)
    
    if (data.version === '1.0' && data.type === 'card' && data.bingo && data.card) {
      // Guardar el bingo si no existe
      const existingBingo = getBingo(data.bingoId)
      if (!existingBingo) {
        const newBingo = {
          ...data.bingo,
          id: data.bingoId || generateBingoId(),
          createdAt: new Date().toISOString()
        }
        saveBingo(newBingo)
      }
      
      // Guardar el cartón
      const cardId = data.cardId || generateCardId()
      saveCardState(data.bingoId || data.bingo.id, cardId, data.card)
      saveLastPlayed(data.bingoId || data.bingo.id, cardId)
      
      return {
        bingoId: data.bingoId || data.bingo.id,
        cardId: cardId
      }
    }
    
    throw new Error('Formato de cartón inválido')
  } catch (error) {
    throw new Error(`Error al importar cartón: ${error.message}`)
  }
}

/**
 * Exporta un bingo a JSON
 */
export function exportBingo(bingo) {
  const exportData = {
    version: '1.0',
    bingo: {
      title: bingo.title,
      size: bingo.size,
      freeCenter: bingo.freeCenter,
      victoryTypes: bingo.victoryTypes,
      words: bingo.words,
      color: bingo.color,
      emoji: bingo.emoji,
      createdAt: bingo.createdAt
    }
  }
  return JSON.stringify(exportData, null, 2)
}

/**
 * Importa un bingo desde JSON
 */
export function importBingo(jsonString) {
  try {
    // Si ya es un objeto, usarlo directamente
    let data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
    
    // Si es un array de bingos (formato exportAllBingos), tomar el primero
    if (Array.isArray(data)) {
      if (data.length === 0) {
        throw new Error('El archivo está vacío')
      }
      data = data[0]
    }
    
    // Compatibilidad con formato antiguo (sin versión)
    if (!data.version) {
      // Si es un objeto bingo directo
      if (data.title && data.words) {
        return {
          ...data,
          id: generateBingoId(),
          createdAt: data.createdAt || new Date().toISOString()
        }
      }
      
      // Si tiene estructura de múltiples bingos pero sin versión
      if (data.bingos && Array.isArray(data.bingos) && data.bingos.length > 0) {
        const firstBingo = data.bingos[0]
        return {
          ...firstBingo,
          id: generateBingoId(),
          createdAt: firstBingo.createdAt || new Date().toISOString()
        }
      }
      
      throw new Error('Formato de bingo inválido. El archivo debe contener un bingo con "title" y "words"')
    }

    // Formato versión 1.0 con un solo bingo
    if (data.version === '1.0' && data.bingo) {
      return {
        ...data.bingo,
        id: generateBingoId(),
        createdAt: data.bingo.createdAt || new Date().toISOString()
      }
    }

    // Formato versión 1.0 con múltiples bingos (tomar el primero)
    if (data.version === '1.0' && data.bingos && Array.isArray(data.bingos)) {
      if (data.bingos.length === 0) {
        throw new Error('El archivo no contiene bingos')
      }
      const firstBingo = data.bingos[0]
      return {
        ...firstBingo,
        id: generateBingoId(),
        createdAt: firstBingo.createdAt || new Date().toISOString()
      }
    }

    // Si es un cartón, extraer el bingo
    if (data.version === '1.0' && data.type === 'card' && data.bingo) {
      return {
        ...data.bingo,
        id: generateBingoId(),
        createdAt: data.bingo.createdAt || new Date().toISOString()
      }
    }

    throw new Error(`Versión de formato no soportada o estructura inválida. Versión: ${data.version || 'sin versión'}`)
  } catch (error) {
    // Si el error ya tiene un mensaje descriptivo, usarlo
    if (error.message.includes('Error al importar')) {
      throw error
    }
    // Si es un error de parseo JSON
    if (error instanceof SyntaxError) {
      throw new Error('El archivo no es un JSON válido. Verifica que el archivo no esté corrupto.')
    }
    throw new Error(`Error al importar bingo: ${error.message}`)
  }
}

/**
 * Descarga un archivo JSON
 */
export function downloadJSON(data, filename) {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Lee un archivo JSON
 */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result))
      } catch (error) {
        reject(new Error('Archivo JSON inválido'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })
}

/**
 * Exporta todos los bingos guardados
 */
export function exportAllBingos() {
  const bingos = getSavedBingos()
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    bingos: Object.values(bingos).map(bingo => ({
      title: bingo.title,
      size: bingo.size,
      freeCenter: bingo.freeCenter,
      victoryTypes: bingo.victoryTypes,
      words: bingo.words,
      color: bingo.color,
      emoji: bingo.emoji,
      createdAt: bingo.createdAt
    }))
  }
  return JSON.stringify(exportData, null, 2)
}

/**
 * Importa múltiples bingos
 */
export function importBingos(jsonString) {
  try {
    const data = JSON.parse(jsonString)
    
    if (data.version === '1.0' && data.bingos && Array.isArray(data.bingos)) {
      const imported = []
      const existingBingos = getSavedBingos()
      
      data.bingos.forEach(bingoData => {
        const newBingo = {
          ...bingoData,
          id: generateBingoId(),
          createdAt: bingoData.createdAt || new Date().toISOString()
        }
        existingBingos[newBingo.id] = newBingo
        imported.push(newBingo)
      })
      
      localStorage.setItem('bingos', JSON.stringify(existingBingos))
      return imported
    }

    throw new Error('Formato de archivo no válido')
  } catch (error) {
    throw new Error(`Error al importar bingos: ${error.message}`)
  }
}

