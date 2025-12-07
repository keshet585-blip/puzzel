import { Box, Typography, LinearProgress } from '@mui/material'

interface ProgressBarProps {
  moves: number
  maxMoves: number
}

export default function ProgressBar({ moves, maxMoves }: ProgressBarProps) {
  const progress = (moves / maxMoves) * 100

  return (
    <Box sx={{ width: '80%', maxWidth: 600, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, direction: 'rtl' }}>
        <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
          📊 התקדמות:
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
          {Math.round(progress)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(progress, 100)}
        color={progress > 80 ? 'error' : progress > 50 ? 'warning' : 'success'}
        sx={{
          height: 14,
          borderRadius: 3,
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          '& .MuiLinearProgress-bar': {
            background: progress > 80 
              ? 'linear-gradient(90deg, #f44336, #e91e63)' 
              : progress > 50
              ? 'linear-gradient(90deg, #FFC107, #FF9800)'
              : 'linear-gradient(90deg, #11998e, #38ef7d)',
            borderRadius: 3
          }
        }}
      />
    </Box>
  )
}
