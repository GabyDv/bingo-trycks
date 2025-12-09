import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Editor from './pages/Editor'
import Game from './pages/Game'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Editor />} />
        <Route path="/bingo/:id" element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App

