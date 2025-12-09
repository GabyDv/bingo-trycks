import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  generateBingoId, 
  getMinWords, 
  saveBingo, 
  exportBingo, 
  importBingo, 
  downloadJSON,
  readJSONFile 
} from '../utils/bingoUtils'
import './Editor.css'

function Editor() {
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('Mi Bingo')
  const [size, setSize] = useState(5)
  const [freeCenter, setFreeCenter] = useState(true)
  const [victoryTypes, setVictoryTypes] = useState(['line', 'column', 'diagonal', 'full'])
  const [wordsText, setWordsText] = useState('')
  const [words, setWords] = useState([])
  const [color, setColor] = useState('#667eea')
  const [emoji, setEmoji] = useState('🎯')
  const fileInputRef = useRef(null)

  const minWords = getMinWords(size)

  const handleAddWord = () => {
    const word = wordsText.trim()
    if (word && !words.includes(word)) {
      setWords([...words, word])
      setWordsText('')
    }
  }

  const handleRemoveWord = (index) => {
    setWords(words.filter((_, i) => i !== index))
  }

  const handlePasteWords = () => {
    const pasted = wordsText.split('\n')
      .map(w => w.trim())
      .filter(w => w.length > 0)
    
    const unique = [...new Set([...words, ...pasted])]
    setWords(unique)
    setWordsText('')
  }

  const toggleVictoryType = (type) => {
    if (victoryTypes.includes(type)) {
      setVictoryTypes(victoryTypes.filter(t => t !== type))
    } else {
      setVictoryTypes([...victoryTypes, type])
    }
  }

  const handleSave = () => {
    if (words.length < minWords) {
      alert(`Necesitas al menos ${minWords} palabras para un bingo ${size}x${size}`)
      return
    }

    if (victoryTypes.length === 0) {
      alert('Selecciona al menos un tipo de victoria')
      return
    }

    const bingo = {
      id: generateBingoId(),
      title,
      size,
      freeCenter,
      victoryTypes,
      words,
      color,
      emoji,
      createdAt: new Date().toISOString()
    }

    saveBingo(bingo)
    
    // Navegar al juego
    navigate(`/bingo/${bingo.id}`)
  }

  const handleExport = () => {
    if (words.length < minWords) {
      alert(`Necesitas al menos ${minWords} palabras para exportar`)
      return
    }

    const bingo = {
      id: generateBingoId(),
      title,
      size,
      freeCenter,
      victoryTypes,
      words,
      color,
      emoji,
      createdAt: new Date().toISOString()
    }

    const json = exportBingo(bingo)
    const filename = `${title.replace(/[^a-z0-9]/gi, '_')}_bingo.json`
    downloadJSON(json, filename)
    alert('Bingo exportado correctamente!')
  }

  const handleImport = async () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await readJSONFile(file)
      // Pasar el objeto directamente, no stringify
      const importedBingo = importBingo(data)
      
      // Validar que tenga los campos necesarios
      if (!importedBingo.title || !importedBingo.words || !Array.isArray(importedBingo.words)) {
        throw new Error('El bingo importado no tiene la estructura correcta (falta title o words)')
      }
      
      // Cargar datos importados
      setTitle(importedBingo.title || 'Mi Bingo')
      setSize(importedBingo.size || 5)
      setFreeCenter(importedBingo.freeCenter !== undefined ? importedBingo.freeCenter : true)
      setVictoryTypes(importedBingo.victoryTypes || ['line', 'column', 'diagonal', 'full'])
      setWords(importedBingo.words || [])
      setColor(importedBingo.color || '#667eea')
      setEmoji(importedBingo.emoji || '🎯')
      
      alert('Bingo importado correctamente!')
    } catch (error) {
      alert(`Error al importar: ${error.message}\n\nAsegúrate de que el archivo sea un bingo exportado desde esta aplicación.`)
      console.error('Error de importación:', error)
    }

    // Limpiar input
    e.target.value = ''
  }

  return (
    <div className="editor">
      <div className="editor-container">
        <h1 className="editor-title">🎨 Crear Bingo</h1>

        {/* Configuración básica */}
        <section className="editor-section">
          <h2>Título y Estilo</h2>
          <div className="form-group">
            <label>Emoji (opcional)</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🎯"
              maxLength={2}
            />
          </div>
          <div className="form-group">
            <label>Título del bingo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mi Bingo"
            />
          </div>
          <div className="form-group">
            <label>Color principal</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </section>

        {/* Configuración del tablero */}
        <section className="editor-section">
          <h2>Configuración del Tablero</h2>
          <div className="form-group">
            <label>Tamaño</label>
            <div className="size-options">
              {[3, 4, 5].map(s => (
                <button
                  key={s}
                  className={`size-btn ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}×{s}
                </button>
              ))}
            </div>
            <p className="help-text">
              Necesitas mínimo {minWords} palabras para un tablero {size}×{size}
            </p>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={freeCenter}
                onChange={(e) => setFreeCenter(e.target.checked)}
              />
              <span className="checkbox-text">🎯 Casilla central libre</span>
            </label>
          </div>
        </section>

        {/* Tipos de victoria */}
        <section className="editor-section">
          <h2>Tipos de Victoria</h2>
          <div className="victory-types">
            {[
              { id: 'line', label: 'Línea horizontal', icon: '➖' },
              { id: 'column', label: 'Columna vertical', icon: '⬇️' },
              { id: 'diagonal', label: 'Diagonal', icon: '↘️' },
              { id: 'full', label: 'Cartón completo', icon: '✅' }
            ].map(type => (
              <label key={type.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={victoryTypes.includes(type.id)}
                  onChange={() => toggleVictoryType(type.id)}
                />
                <span className="checkbox-text">
                  <span className="checkbox-icon">{type.icon}</span>
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Palabras */}
        <section className="editor-section">
          <h2>Palabras / Eventos</h2>
          <p className="help-text">
            Agrega las palabras o situaciones que aparecerán en los cartones
          </p>
          
          <div className="words-input-container">
            <div className="words-input-wrapper">
              <label className="words-input-label">
                <span className="input-icon">✏️</span>
                Escribe o pega palabras (una por línea)
              </label>
              <textarea
                className="words-textarea"
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                placeholder="Playa&#10;Sauna&#10;Flashback triste&#10;Poder oculto&#10;Transformación"
                rows={6}
              />
            </div>
            <div className="words-input-actions">
              <button 
                className="btn btn-action btn-add" 
                onClick={handleAddWord}
                disabled={!wordsText.trim()}
              >
                <span className="btn-icon">➕</span>
                Agregar una
              </button>
              <button 
                className="btn btn-action btn-paste" 
                onClick={handlePasteWords}
                disabled={!wordsText.trim()}
              >
                <span className="btn-icon">📋</span>
                Pegar todas
              </button>
            </div>
          </div>

          <div className="words-list-container">
            <div className="words-count-header">
              <div className="words-count-info">
                <span className="words-count-number">{words.length}</span>
                <span className="words-count-separator">/</span>
                <span className="words-count-min">{minWords}</span>
                <span className="words-count-label">palabras</span>
              </div>
              <div className={`words-count-status ${words.length >= minWords ? 'valid' : 'warning'}`}>
                {words.length >= minWords ? '✅ Suficientes' : `⚠️ Faltan ${minWords - words.length}`}
              </div>
            </div>
            
            {words.length === 0 ? (
              <div className="words-empty">
                <span className="empty-icon">📝</span>
                <p>No hay palabras agregadas aún</p>
                <p className="empty-hint">Escribe palabras arriba y haz clic en "Agregar una" o "Pegar todas"</p>
              </div>
            ) : (
              <div className="words-tags">
                {words.map((word, index) => (
                  <span key={index} className="word-tag">
                    <span className="word-tag-text">{word}</span>
                    <button
                      className="word-remove"
                      onClick={() => handleRemoveWord(index)}
                      title="Eliminar palabra"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Acciones */}
        <div className="editor-actions">
          <div className="editor-actions-left">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              🏠 Menú principal
            </button>
            <button className="btn btn-secondary" onClick={handleImport}>
              📥 Importar bingo
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleExport}
              disabled={words.length < minWords}
            >
              📤 Exportar bingo
            </button>
          </div>
          <div className="editor-actions-right">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={words.length < minWords || victoryTypes.length === 0}
            >
              Crear Bingo 🎉
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default Editor

