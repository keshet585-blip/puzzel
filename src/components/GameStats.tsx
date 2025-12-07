import { Stack, Chip } from '@mui/material'
import { formatTime } from '../utils/highScores'

interface GameStatsProps {
  levelDifficulty: string
  moves: number
  movesRemaining: number
  timeElapsed: number
  timeRemaining: number
  hintsRemaining: number
}

export default function GameStats({
  levelDifficulty,
  moves,
  movesRemaining,
  timeElapsed,
  timeRemaining,
  hintsRemaining,
}: GameStatsProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        mb: 3,
        justifyContent: 'center',
        flexWrap: 'wrap',
        px: 4,
        direction: 'rtl',
      }}
    >
      <Chip
        icon={<span>🎯</span>}
        label={`רמה: ${levelDifficulty}`}
        sx={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
      <Chip
        icon={<span>👟</span>}
        label={`מהלכים: ${moves}`}
        sx={{
          background: 'linear-gradient(45deg, #f093fb, #f5576c)',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
      <Chip
        icon={<span>🎲</span>}
        label={`נותרו: ${movesRemaining}`}
        color={movesRemaining <= 20 ? 'error' : 'success'}
        sx={{
          background: movesRemaining <= 20
            ? 'linear-gradient(45deg, #f44336, #e91e63)'
            : 'linear-gradient(45deg, #4caf50, #8bc34a)',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
      <Chip
        icon={<span>⏱️</span>}
        label={formatTime(timeElapsed)}
        sx={{
          background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
      <Chip
        icon={<span>⏳</span>}
        label={`נותר: ${formatTime(timeRemaining)}`}
        color={timeRemaining <= 60 ? 'error' : 'warning'}
        sx={{
          background: timeRemaining <= 60
            ? 'linear-gradient(45deg, #ff6b6b, #ee5a6f)'
            : 'linear-gradient(45deg, #FFC107, #FF9800)',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
      <Chip
        icon={<span>💡</span>}
        label={`רמזים: ${hintsRemaining}`}
        sx={{
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
    </Stack>
  )
}
