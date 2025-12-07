export interface Position {
  row: number
  col: number
}

export const shuffleTiles = (array: (number | null)[]): (number | null)[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Count inversions for solvability check
export const countInversions = (tiles: (number | null)[]): number => {
  let inversions = 0
  const filtered = tiles.filter((t) => t !== null) as number[]

  for (let i = 0; i < filtered.length - 1; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) {
        inversions++
      }
    }
  }
  return inversions
}

// Check if puzzle is solvable
export const isSolvable = (
  tiles: (number | null)[],
  boardSize: number
): boolean => {
  const inversions = countInversions(tiles)

  // For odd-sized boards (3x3, 5x5), puzzle is solvable if inversions are even
  if (boardSize % 2 === 1) {
    return inversions % 2 === 0
  }

  // For even-sized boards (4x4), also consider empty tile row from bottom
  const emptyIndex = tiles.indexOf(null)
  const emptyRowFromBottom = boardSize - Math.floor(emptyIndex / boardSize)

  // Puzzle is solvable if (inversions + emptyRowFromBottom) is odd
  return (inversions + emptyRowFromBottom) % 2 === 1
}

// Generate solvable puzzle using controlled shuffling
const generateSolvablePuzzle = (boardSize: number): (number | null)[] => {
  const totalTiles = boardSize * boardSize
  const orderedTiles: (number | null)[] = Array.from(
    { length: totalTiles - 1 },
    (_, i) => i + 1
  )
  orderedTiles.push(null)

  // Try random shuffle with solvability check (max 100 attempts)
  for (let attempt = 0; attempt < 100; attempt++) {
    const shuffled = shuffleTiles([...orderedTiles])
    if (isSolvable(shuffled, boardSize)) {
      return shuffled
    }
  }

  // Fallback: generate solvable puzzle with controlled moves
  const tiles = [...orderedTiles]
  const emptyPos = { row: boardSize - 1, col: boardSize - 1 }

  // Perform random valid moves to shuffle
  for (let i = 0; i < 100; i++) {
    const adjacent = getAdjacentPositions(emptyPos, boardSize)
    const randomPos = adjacent[Math.floor(Math.random() * adjacent.length)]
    const tileIndex = getTileIndex(randomPos.row, randomPos.col, boardSize)
    const emptyIndex = getTileIndex(emptyPos.row, emptyPos.col, boardSize)

    // Swap
    ;[tiles[tileIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[tileIndex]]
    emptyPos.row = randomPos.row
    emptyPos.col = randomPos.col
  }

  return tiles
}

export const initializeBoardTiles = (boardSize: number): (number | null)[] => {
  return generateSolvablePuzzle(boardSize)
}

export const checkWinCondition = (tiles: (number | null)[]): boolean => {
  return tiles.every((tile, index) => {
    if (index === tiles.length - 1) return tile === null
    return tile === index + 1
  })
}

export const getAdjacentPositions = (
  pos: Position,
  boardSize: number
): Position[] => {
  const { row, col } = pos

  // Up, Down, Left, Right
  const directions = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ]

  return directions.filter(
    (dir) =>
      dir.row >= 0 && dir.row < boardSize && dir.col >= 0 && dir.col < boardSize
  )
}

export const getTileIndex = (row: number, col: number, boardSize: number): number => {
  return row * boardSize + col
}

export const getEmptyPosition = (
  tiles: (number | null)[],
  boardSize: number
): Position => {
  const emptyIndex = tiles.indexOf(null)
  return {
    row: Math.floor(emptyIndex / boardSize),
    col: emptyIndex % boardSize,
  }
}

export const isMovable = (
  tileRow: number,
  tileCol: number,
  emptyPos: Position,
  boardSize: number
): boolean => {
  const adjacentPositions = getAdjacentPositions(emptyPos, boardSize)
  return adjacentPositions.some((pos) => pos.row === tileRow && pos.col === tileCol)
}

export const swapTiles = (
  tiles: (number | null)[],
  tileRow: number,
  tileCol: number,
  emptyPos: Position,
  boardSize: number
): (number | null)[] => {
  const newTiles = [...tiles]
  const tileIndex = getTileIndex(tileRow, tileCol, boardSize)
  const emptyIndex = getTileIndex(emptyPos.row, emptyPos.col, boardSize)

  ;[newTiles[tileIndex], newTiles[emptyIndex]] = [
    newTiles[emptyIndex],
    newTiles[tileIndex],
  ]

  return newTiles
}

// Find the next best move for hint system
export const findNextBestMove = (
  tiles: (number | null)[],
  boardSize: number
): Position | null => {
  const emptyPos = getEmptyPosition(tiles, boardSize)
  const adjacentPositions = getAdjacentPositions(emptyPos, boardSize)

  // Find a tile that's not in its correct position and can move toward it
  for (const pos of adjacentPositions) {
    const tileIndex = getTileIndex(pos.row, pos.col, boardSize)
    const tileValue = tiles[tileIndex]
    
    if (tileValue === null) continue

    // Calculate where this tile should be
    const correctIndex = tileValue - 1
    const correctRow = Math.floor(correctIndex / boardSize)
    const correctCol = correctIndex % boardSize

    // If tile is not in correct position, suggest moving it
    if (pos.row !== correctRow || pos.col !== correctCol) {
      return pos
    }
  }

  // If all adjacent tiles are in correct positions, return random adjacent
  if (adjacentPositions.length > 0) {
    return adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)]
  }

  return null
}
