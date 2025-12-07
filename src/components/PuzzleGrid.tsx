import { Card, CardContent } from '@mui/material'
import { motion } from 'framer-motion'
import Tile from './Tile'
import type { Position } from '../utils/puzzleLogic'

interface PuzzleGridProps {
  tiles: (number | null)[]
  boardSize: number
  onTileClick: (row: number, col: number) => void
  isMovable: (row: number, col: number) => boolean
  imageUrl: string | null
  highlightedTile: Position | null
}

export default function PuzzleGrid({
  tiles,
  boardSize,
  onTileClick,
  isMovable,
  imageUrl,
  highlightedTile,
}: PuzzleGridProps) {
  const tileSize = 100
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 4,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gap: 1,
            backgroundColor: '#f5f5f5',
            minWidth: `${boardSize * tileSize}px`,
          }}
        >
          {tiles.map((number, index) => {
            const row = Math.floor(index / boardSize)
            const col = index % boardSize
            const isHighlighted = highlightedTile !== null && 
                                 highlightedTile.row === row && 
                                 highlightedTile.col === col
            return (
              <Tile
                key={`${row}-${col}`}
                number={number}
                row={row}
                col={col}
                boardSize={boardSize}
                tileSize={tileSize}
                imageUrl={imageUrl}
                onClick={() => onTileClick(row, col)}
                isMovable={isMovable(row, col)}
                isHighlighted={isHighlighted}
              />
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
