import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  getBingo, 
  generateCard, 
  generateCardId, 
  saveCardState, 
  getCardState,
  detectWins,
  exportCard,
  importCard,
  downloadJSON,
  readJSONFile
} from '../utils/bingoUtils'
import './Game.css'

function Game() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [bingo, setBingo] = useState(null)
  const [card, setCard] = useState(null)
  const [cardId, setCardId] = useState(null)
  const [wins, setWins] = useState([])
  const [showWinModal, setShowWinModal] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const bingoData = getBingo(id)
    if (!bingoData) {
      alert('Bingo no encontrado. Asegúrate de tener el ID correcto o crea uno nuevo.')
      navigate('/')
      return
    }

    setBingo(bingoData)

    // Verificar si hay un cartón específico en la URL
    const urlParams = new URLSearchParams(window.location.search)
    const cardParam = urlParams.get('card')

    // Intentar cargar cartón guardado o generar uno nuevo
    const savedCardId = cardParam || localStorage.getItem(`currentCardId_${id}`) || generateCardId()
    
    if (!cardParam && !localStorage.getItem(`currentCardId_${id}`)) {
      localStorage.setItem(`currentCardId_${id}`, savedCardId)
    }

    setCardId(savedCardId)

    const savedCard = getCardState(id, savedCardId)
    if (savedCard) {
      setCard(savedCard)
      // Verificar victorias al cargar
      const detectedWins = detectWins(savedCard, bingoData.victoryTypes)
      setWins(detectedWins)
    } else {
      const newCard = generateCard(bingoData.words, bingoData.size, bingoData.freeCenter)
      setCard(newCard)
      saveCardState(id, savedCardId, newCard)
    }
  }, [id, navigate])

  const handleCellClick = (rowIndex, colIndex) => {
    if (!card || card[rowIndex][colIndex].isFree) return

    const newCard = card.map((row, r) =>
      row.map((cell, c) => {
        if (r === rowIndex && c === colIndex) {
          return { ...cell, marked: !cell.marked }
        }
        return cell
      })
    )

    setCard(newCard)
    saveCardState(bingo.id, cardId, newCard)

    // Detectar victorias
    const detectedWins = detectWins(newCard, bingo.victoryTypes)
    setWins(detectedWins)

    if (detectedWins.length > 0 && !showWinModal) {
      setShowWinModal(true)
      // Sonido opcional (comentado por ahora)
      // const audio = new Audio('/bingo-sound.mp3')
      // audio.play().catch(() => {})
    }
  }

  const handleRegenerate = () => {
    if (!bingo) return
    const newCard = generateCard(bingo.words, bingo.size, bingo.freeCenter)
    const newCardId = generateCardId()
    setCard(newCard)
    setCardId(newCardId)
    setWins([])
    setShowWinModal(false)
    localStorage.setItem(`currentCardId_${bingo.id}`, newCardId)
    saveCardState(bingo.id, newCardId, newCard)
  }

  const handleExportCard = () => {
    if (!bingo || !card) return
    const json = exportCard(bingo, card, cardId)
    const filename = `${bingo.title.replace(/[^a-z0-9]/gi, '_')}_carton_${cardId}.json`
    downloadJSON(json, filename)
    alert('Cartón exportado correctamente!')
  }

  const handleImportCard = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await readJSONFile(file)
      const result = importCard(JSON.stringify(data))
      // Recargar la página con el nuevo cartón
      navigate(`/bingo/${result.bingoId}?card=${result.cardId}`)
    } catch (error) {
      alert(`Error al importar cartón: ${error.message}`)
    }

    e.target.value = ''
  }

  if (!bingo || !card) {
    return <div className="loading">Cargando...</div>
  }

  const markedCount = card.flat().filter(cell => cell.marked).length
  const totalCells = bingo.size * bingo.size

  return (
    <div className="game" style={{ '--primary-color': bingo.color }}>
      <div className="game-header">
        <h1 className="game-title">
          {bingo.emoji} {bingo.title}
        </h1>
        <div className="game-stats">
          <span>Marcadas: {markedCount}/{totalCells}</span>
          {wins.length > 0 && (
            <span className="wins-badge">🎉 {wins.length} victoria{wins.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="game-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          🏠 Menú principal
        </button>
        <button className="btn btn-secondary" onClick={handleRegenerate}>
          🎲 Regenerar cartón
        </button>
        <button className="btn btn-secondary" onClick={handleExportCard}>
          💾 Exportar cartón
        </button>
        <button className="btn btn-secondary" onClick={handleImportCard}>
          📥 Importar cartón
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="card-container">
        <div className="bingo-card" style={{ gridTemplateColumns: `repeat(${bingo.size}, 1fr)` }}>
          {card.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`card-cell ${cell.marked ? 'marked' : ''} ${cell.isFree ? 'free' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell.text}
              </div>
            ))
          )}
        </div>
      </div>

      {wins.length > 0 && (
        <div className="wins-info">
          <h3>Victorias detectadas:</h3>
          <ul>
            {wins.map((win, index) => (
              <li key={index}>
                {win.type === 'line' && `Línea ${win.index + 1} (horizontal)`}
                {win.type === 'column' && `Columna ${win.index + 1} (vertical)`}
                {win.type === 'diagonal' && `Diagonal ${win.direction === 'main' ? 'principal' : 'secundaria'}`}
                {win.type === 'full' && 'Cartón completo'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showWinModal && (
        <div className="win-modal-overlay" onClick={() => setShowWinModal(false)}>
          <div className="win-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 ¡BINGO! 🎉</h2>
            <p>¡Felicidades! Has completado:</p>
            <ul>
              {wins.map((win, index) => (
                <li key={index}>
                  {win.type === 'line' && `Línea ${win.index + 1}`}
                  {win.type === 'column' && `Columna ${win.index + 1}`}
                  {win.type === 'diagonal' && `Diagonal`}
                  {win.type === 'full' && 'Cartón completo'}
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={() => setShowWinModal(false)}>
              Continuar jugando
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game

