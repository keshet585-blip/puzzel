import { Box, Typography, Button, IconButton, Stack } from '@mui/material'
import { VolumeUp, VolumeOff } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { soundManager } from '../utils/soundEffect'

interface GameHeaderProps {
  boardSize: number
  onBack: () => void
}

export default function GameHeader({ boardSize, onBack }: GameHeaderProps) {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.getSoundEnabled())

  useEffect(() => {
    setSoundEnabled(soundManager.getSoundEnabled())
  }, [])

  const handleToggleSound = () => {
    const newState = !soundEnabled
    soundManager.setSoundEnabled(newState)
    setSoundEnabled(newState)
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        py: 2,
        direction: 'rtl',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          background: 'linear-gradient(45deg, #fff, #f093fb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        🎮 משחק חידת ה-{boardSize * boardSize - 1} 🧩
      </Typography>

      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={handleToggleSound}
          sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #764ba2, #667eea)',
            }
          }}
        >
          {soundEnabled ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
        
        <Button
          onClick={onBack}
          variant="contained"
          color="error"
          startIcon={<span>⬅️</span>}
          sx={{
            background: 'linear-gradient(45deg, #f44336, #e91e63)',
            fontWeight: 'bold',
            borderRadius: 6,
            boxShadow: 2
          }}
        >
          חזור
        </Button>
      </Stack>
    </Box>
  )
}
