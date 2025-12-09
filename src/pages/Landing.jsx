import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  getSavedBingos, 
  exportAllBingos, 
  importBingos, 
  downloadJSON,
  readJSONFile,
  getIncompleteGames,
  importCard,
  importBingo,
  deleteBingo,
  deleteBingoCards
} from '../utils/bingoUtils'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()
  const [savedBingos, setSavedBingos] = useState({})
  const [showSaved, setShowSaved] = useState(false)
  const [incompleteGames, setIncompleteGames] = useState([])
  const [showIncomplete, setShowIncomplete] = useState(false)
  const fileInputRef = useRef(null)
  const cardFileInputRef = useRef(null)

  useEffect(() => {
    loadSavedBingos()
    loadIncompleteGames()
  }, [])

  const loadIncompleteGames = () => {
    const games = getIncompleteGames()
    setIncompleteGames(games)
  }

  const loadSavedBingos = () => {
    const bingos = getSavedBingos()
    setSavedBingos(bingos)
  }

  const handleDeleteBingo = (bingoId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este bingo?\n\nEsto eliminará el bingo y todos sus cartones guardados.')) {
      deleteBingo(bingoId)
      deleteBingoCards(bingoId)
      loadSavedBingos()
      loadIncompleteGames() // Recargar juegos inacabados también
      alert('Bingo eliminado correctamente')
    }
  }

  const handleExportAll = () => {
    const json = exportAllBingos()
    const filename = `bingos_export_${new Date().toISOString().split('T')[0]}.json`
    downloadJSON(json, filename)
    alert('Todos los bingos exportados correctamente!')
  }

  const handleImportAll = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await readJSONFile(file)
      // Verificar si es un formato de múltiples bingos o un solo bingo
      let imported
      
      if (data.version === '1.0' && data.bingos && Array.isArray(data.bingos)) {
        // Formato de múltiples bingos
        imported = importBingos(JSON.stringify(data))
      } else {
        // Intentar como un solo bingo
        const singleBingo = importBingo(data)
        const existingBingos = getSavedBingos()
        existingBingos[singleBingo.id] = singleBingo
        localStorage.setItem('bingos', JSON.stringify(existingBingos))
        imported = [singleBingo]
      }
      
      loadSavedBingos()
      alert(`${imported.length} bingo(s) importado(s) correctamente!`)
    } catch (error) {
      alert(`Error al importar: ${error.message}\n\nAsegúrate de que el archivo sea un bingo exportado desde esta aplicación.`)
      console.error('Error de importación:', error)
    }

    e.target.value = ''
  }

  const handleImportCard = () => {
    cardFileInputRef.current?.click()
  }

  const handleCardFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await readJSONFile(file)
      const result = importCard(JSON.stringify(data))
      loadIncompleteGames()
      navigate(`/bingo/${result.bingoId}?card=${result.cardId}`)
    } catch (error) {
      alert(`Error al importar cartón: ${error.message}`)
    }

    e.target.value = ''
  }

  return (
    <div className="landing">
      <div className="landing-container">
        <h1 className="landing-title">🎯 Bingo Trycks</h1>
        <p className="landing-subtitle">
          Crea tu bingo personalizado con las palabras que quieras
        </p>
        <p className="landing-description">
          Perfecto para maratones, eventos, streams, clases y más. 
          Sin registro, sin complicaciones.
        </p>

        <div className="landing-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            ✨ Crear un bingo
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleImportCard}
          >
            📥 Importar cartón
          </button>
        </div>

        <div className="landing-features">
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <span>Personalizable</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🚀</span>
            <span>Rápido</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔗</span>
            <span>Compartible</span>
          </div>
        </div>

        <div className="landing-manage">
          <button 
            className="btn btn-secondary btn-small"
            onClick={() => setShowSaved(!showSaved)}
          >
            {showSaved ? '👁️ Ocultar' : '📋 Ver'} bingos guardados ({Object.keys(savedBingos).length})
          </button>
          
          {incompleteGames.length > 0 && (
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => setShowIncomplete(!showIncomplete)}
            >
              {showIncomplete ? '👁️ Ocultar' : '🎮 Ver'} juegos inacabados ({incompleteGames.length})
            </button>
          )}
          
          {Object.keys(savedBingos).length > 0 && (
            <>
              <button 
                className="btn btn-secondary btn-small"
                onClick={handleExportAll}
              >
                📤 Exportar todos
              </button>
              <button 
                className="btn btn-secondary btn-small"
                onClick={handleImportAll}
              >
                📥 Importar bingos
              </button>
            </>
          )}
        </div>

        {showIncomplete && incompleteGames.length > 0 && (
          <div className="saved-bingos">
            <h3>🎮 Juegos Inacabados</h3>
            <p className="section-description">
              Retoma tus partidas guardadas. Tu progreso se guarda automáticamente.
            </p>
            <div className="bingos-list">
              {incompleteGames.map((game, index) => (
                <div key={`${game.bingoId}_${game.cardId}`} className="bingo-item incomplete-game">
                  <div className="bingo-item-info">
                    <span className="bingo-emoji">{game.bingo.emoji}</span>
                    <div>
                      <div className="bingo-item-title">{game.bingo.title}</div>
                      <div className="bingo-item-meta">
                        {game.bingo.size}×{game.bingo.size} • {game.markedCount} casillas marcadas
                      </div>
                      <div className="game-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${(game.markedCount / (game.bingo.size * game.bingo.size)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bingo-item-actions">
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => navigate(`/bingo/${game.bingoId}?card=${game.cardId}`)}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSaved && Object.keys(savedBingos).length > 0 && (
          <div className="saved-bingos">
            <h3>Bingos Guardados</h3>
            <div className="bingos-list">
              {Object.values(savedBingos).map(bingo => (
                <div key={bingo.id} className="bingo-item">
                  <div className="bingo-item-info">
                    <span className="bingo-emoji">{bingo.emoji}</span>
                    <div>
                      <div className="bingo-item-title">{bingo.title}</div>
                      <div className="bingo-item-meta">
                        {bingo.size}×{bingo.size} • {bingo.words.length} palabras
                      </div>
                    </div>
                  </div>
                  <div className="bingo-item-actions">
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => navigate(`/bingo/${bingo.id}`)}
                    >
                      Jugar
                    </button>
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteBingo(bingo.id)}
                      title="Eliminar bingo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          ref={cardFileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleCardFileChange}
        />
      </div>
    </div>
  )
}

export default Landing

