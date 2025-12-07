import { Stack, Button } from '@mui/material'

interface ActionButtonsProps {
  onRetry: () => void
  onUseHint?: () => void
  hintsRemaining?: number
  disabled?: boolean
}

export default function ActionButtons({ 
  onRetry, 
  onUseHint, 
  hintsRemaining = 0,
  disabled = false 
}: ActionButtonsProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        onClick={onRetry}
        variant="contained"
        size="large"
        startIcon={<span>🔄</span>}
        sx={{
          background: 'linear-gradient(45deg, #FFC107, #FF9800)',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: 3
        }}
      >
        נסיון חדש
      </Button>
      {onUseHint && (
        <Button
          onClick={onUseHint}
          variant="contained"
          size="large"
          disabled={disabled || hintsRemaining === 0}
          startIcon={<span>💡</span>}
          sx={{
            background: hintsRemaining > 0 
              ? 'linear-gradient(45deg, #FFD700, #FFA500)'
              : 'linear-gradient(45deg, #888, #666)',
            fontWeight: 'bold',
            borderRadius: 8,
            boxShadow: 3,
            '&:disabled': {
              background: 'linear-gradient(45deg, #888, #666)',
              color: 'rgba(255,255,255,0.5)'
            }
          }}
        >
          רמז ({hintsRemaining})
        </Button>
      )}
    </Stack>
  )
}
