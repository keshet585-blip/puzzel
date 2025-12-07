import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import Confetti from 'react-confetti'
import GameHeader from './GameHeader'
import GameStats from './GameStats'
import ProgressBar from './ProgressBar'
import PuzzleGrid from './PuzzleGrid'
import GameMessage from './GameMessage'
import ActionButtons from './ActionButtons'
import {
  initializeBoardTiles,
  checkWinCondition,
  getEmptyPosition,
  isMovable,
  swapTiles,
  findNextBestMove,
  type Position,
} from '../utils/puzzleLogic'
import { saveScore } from '../utils/highScores'
import { soundManager } from '../utils/soundEffect'

interface GameBoardProps {
  levelId: number
  levelDifficulty: string
  boardSize: number
  maxMoves: number
  timeLimit: number
  hintLimit: number
  imageUrl: string | null
  onBack: () => void
}

export default function GameBoard({
  levelId,
  levelDifficulty,
  boardSize,
  maxMoves,
  timeLimit,
  hintLimit,
  imageUrl,
  onBack,
}: GameBoardProps) {
  const [tiles, setTiles] = useState<(number | null)[]>([])
  const [emptyPos, setEmptyPos] = useState<Position>({ row: 0, col: 0 })
  const [gameState, setGameState] = useState({
    moves: 0,
    timeElapsed: 0,
    hintsRemaining: hintLimit,
    isWon: false,
    isLost: false,
    showConfetti: false
  })
  const [highlightedTile, setHighlightedTile] = useState<Position | null>(null)

  const isGameOver = gameState.isWon || gameState.isLost

  // Initialize the puzzle board
  useEffect(() => {
    initializeBoard()
  }, [levelId, boardSize])

  // Timer
  useEffect(() => {
    if (isGameOver) return

    const interval = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeElapsed + 1
        if (newTime >= timeLimit) {
          return { ...prev, timeElapsed: timeLimit, isLost: true }
        }
        const timeLeft = timeLimit - newTime
        if (timeLeft <= 10 && timeLeft > 0) {
          soundManager.playTick()
        }
        return { ...prev, timeElapsed: newTime }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isGameOver, timeLimit])

  // Check if puzzle is solved
  useEffect(() => {
    if (tiles.length === 0 || gameState.isWon) return
    
    if (checkWinCondition(tiles)) {
      soundManager.playWin()
      setGameState(prev => ({ ...prev, isWon: true, showConfetti: true }))
      
      saveScore({
        levelId,
        moves: gameState.moves,
        time: gameState.timeElapsed,
        date: new Date().toISOString(),
        imageUrl: imageUrl || undefined,
      })
      
      setTimeout(() => setGameState(prev => ({ ...prev, showConfetti: false })), 5000)
    }
  }, [tiles, gameState.isWon, gameState.moves, gameState.timeElapsed, levelId, imageUrl])

  // Check if game is lost
  useEffect(() => {
    if (gameState.moves >= maxMoves && !gameState.isWon) {
      setGameState(prev => ({ ...prev, isLost: true }))
    }
  }, [gameState.moves, gameState.isWon, maxMoves])

  const initializeBoard = useCallback(() => {
    const shuffled = initializeBoardTiles(boardSize)
    setTiles(shuffled)
    setEmptyPos(getEmptyPosition(shuffled, boardSize))
    setGameState({
      moves: 0,
      timeElapsed: 0,
      hintsRemaining: hintLimit,
      isWon: false,
      isLost: false,
      showConfetti: false
    })
    setHighlightedTile(null)
  }, [boardSize, hintLimit])

  const handleTileClick = useCallback((row: number, col: number) => {
    if (isGameOver || !isMovable(row, col, emptyPos, boardSize)) return

    soundManager.playTileMove()
    const newTiles = swapTiles(tiles, row, col, emptyPos, boardSize)
    setTiles(newTiles)
    setEmptyPos(getEmptyPosition(newTiles, boardSize))
    setGameState(prev => ({ ...prev, moves: prev.moves + 1 }))
    setHighlightedTile(null)
  }, [tiles, emptyPos, boardSize, isGameOver])

  // Keyboard controls
  useEffect(() => {
    if (isGameOver) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, [number, number]> = {
        ArrowUp: [emptyPos.row + 1, emptyPos.col],
        ArrowDown: [emptyPos.row - 1, emptyPos.col],
        ArrowLeft: [emptyPos.row, emptyPos.col + 1],
        ArrowRight: [emptyPos.row, emptyPos.col - 1]
      }

      const target = keyMap[e.key]
      if (!target) return

      const [row, col] = target
      if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
        handleTileClick(row, col)
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [emptyPos, boardSize, handleTileClick, isGameOver])

  const handleUseHint = useCallback(() => {
    if (gameState.hintsRemaining <= 0 || isGameOver) return

    const nextMove = findNextBestMove(tiles, boardSize)
    if (nextMove) {
      soundManager.playHint()
      setHighlightedTile(nextMove)
      setGameState(prev => ({
        ...prev,
        hintsRemaining: prev.hintsRemaining - 1,
        timeElapsed: Math.min(prev.timeElapsed + 10, timeLimit)
      }))
      
      setTimeout(() => setHighlightedTile(null), 3000)
    }
  }, [gameState.hintsRemaining, isGameOver, tiles, boardSize, timeLimit])

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto'
      }}
    >
      {gameState.showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <GameHeader boardSize={boardSize} onBack={onBack} />
      <GameStats
        levelDifficulty={levelDifficulty}
        moves={gameState.moves}
        movesRemaining={Math.max(0, maxMoves - gameState.moves)}
        timeElapsed={gameState.timeElapsed}
        timeRemaining={Math.max(0, timeLimit - gameState.timeElapsed)}
        hintsRemaining={gameState.hintsRemaining}
      />
      <ProgressBar moves={gameState.moves} maxMoves={maxMoves} />
      <PuzzleGrid
        tiles={tiles}
        boardSize={boardSize}
        onTileClick={handleTileClick}
        isMovable={(row, col) => !isGameOver && isMovable(row, col, emptyPos, boardSize)}
        imageUrl={imageUrl}
        highlightedTile={highlightedTile}
      />

      {gameState.isWon && (
        <GameMessage type="win" moves={gameState.moves} maxMoves={maxMoves} />
      )}

      {gameState.isLost && (
        <GameMessage type="lose" moves={gameState.moves} maxMoves={maxMoves} />
      )}

      <ActionButtons 
        onRetry={initializeBoard} 
        onUseHint={handleUseHint}
        hintsRemaining={gameState.hintsRemaining}
        disabled={isGameOver}
      />
    </Box>
  )
}
