import { useState } from 'react'
import LevelSelector from './components/LevelSelector'
import GameBoard from './components/GameBoard'
import { getDefaultImage } from './utils/defaultImages'

interface Level {
  id: number
  name: string
  difficulty: string
  description: string
  moves: number
  boardSize: number
  timeLimit: number
  hintLimit: number
}

function App() {
  const [gameState, setGameState] = useState<'levelSelect' | 'playing'>('levelSelect')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleSelectLevel = (level: Level, image?: string) => {
    setSelectedLevel(level)
    const finalImage = image || getDefaultImage(level.id)
    setImageUrl(finalImage)
    setGameState('playing')
  }

  const handleBackToLevelSelect = () => {
    setGameState('levelSelect')
    setSelectedLevel(null)
    setImageUrl(null)
  }

  return (
    <>
      {gameState === 'levelSelect' && (
        <LevelSelector onSelectLevel={handleSelectLevel} />
      )}
      {gameState === 'playing' && selectedLevel && (
        <GameBoard
          levelId={selectedLevel.id}
          levelDifficulty={selectedLevel.difficulty}
          boardSize={selectedLevel.boardSize}
          maxMoves={selectedLevel.moves}
          timeLimit={selectedLevel.timeLimit}
          hintLimit={selectedLevel.hintLimit}
          imageUrl={imageUrl}
          onBack={handleBackToLevelSelect}
        />
      )}
    </>
  )
}

export default App
