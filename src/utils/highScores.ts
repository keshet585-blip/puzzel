export interface HighScore {
  levelId: number
  moves: number
  time: number // in seconds
  date: string
  imageUrl?: string
}

const STORAGE_KEY = 'puzzle-high-scores'

// Get all high scores from localStorage
export const getAllHighScores = (): HighScore[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading high scores:', error)
    return []
  }
}

// Get high scores for a specific level
export const getHighScores = (levelId: number): HighScore[] => {
  const allScores = getAllHighScores()
  return allScores
    .filter((score) => score.levelId === levelId)
    .sort((a, b) => {
      // Sort by moves (ascending), then by time (ascending)
      if (a.moves !== b.moves) return a.moves - b.moves
      return a.time - b.time
    })
    .slice(0, 5) // Top 5 scores
}

// Get best score for a level
export const getBestScore = (levelId: number): HighScore | null => {
  const scores = getHighScores(levelId)
  return scores.length > 0 ? scores[0] : null
}

// Save a new high score
export const saveScore = (score: HighScore): boolean => {
  try {
    const allScores = getAllHighScores()
    allScores.push(score)

    // Keep only top 5 per level
    const scoresByLevel: { [key: number]: HighScore[] } = {}
    allScores.forEach((s) => {
      if (!scoresByLevel[s.levelId]) scoresByLevel[s.levelId] = []
      scoresByLevel[s.levelId].push(s)
    })

    const trimmedScores: HighScore[] = []
    Object.values(scoresByLevel).forEach((levelScores) => {
      const sorted = levelScores.sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves
        return a.time - b.time
      })
      trimmedScores.push(...sorted.slice(0, 5))
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedScores))
    return true
  } catch (error) {
    console.error('Error saving high score:', error)
    return false
  }
}

// Check if a score qualifies as a high score
export const isHighScore = (levelId: number, moves: number, time: number): boolean => {
  const scores = getHighScores(levelId)
  if (scores.length < 5) return true

  const worstScore = scores[scores.length - 1]
  if (moves < worstScore.moves) return true
  if (moves === worstScore.moves && time < worstScore.time) return true

  return false
}

// Format time for display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Clear all high scores (for debugging/reset)
export const clearHighScores = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
