import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import HighScoresModal from './HighScoresModal'
import { getBestScore, formatTime } from '../utils/highScores'
import { getDefaultImage, getRandomDefaultImage } from '../utils/defaultImages'

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

interface LevelSelectorProps {
  onSelectLevel: (level: Level, imageUrl?: string) => void
}

const levels: Level[] = [
  {
    id: 1,
    name: 'Easy',
    difficulty: 'קל',
    description: 'מטריצה 3x3 - 9 מספרים',
    moves: 100,
    boardSize: 3,
    timeLimit: 600, // 10 minutes
    hintLimit: 5
  },
  {
    id: 2,
    name: 'Medium',
    difficulty: 'בינוני',
    description: 'מטריצה 4x4 - 15 מספרים',
    moves: 200,
    boardSize: 4,
    timeLimit: 900, // 15 minutes
    hintLimit: 3
  },
  {
    id: 3,
    name: 'Hard',
    difficulty: 'קשה',
    description: 'מטריצה 5x5 - 24 מספרים',
    moves: 300,
    boardSize: 5,
    timeLimit: 1200, // 20 minutes
    hintLimit: 2
  }
]

export default function LevelSelector({ onSelectLevel }: LevelSelectorProps) {
  const [scoresOpen, setScoresOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)

  const handleLevelClick = (level: Level) => {
    setSelectedLevel(level)
  }

  const handleStartGame = () => {
    if (selectedLevel) {
      onSelectLevel(selectedLevel, imageUrl || undefined)
    }
  }

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
        m: 0,
        p: 0,
        overflow: 'auto'
      }}
    >
        <Typography
          variant="h2"
          sx={{
            background: 'linear-gradient(45deg, #fff 30%, #f093fb 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontWeight: 'bold',
            direction: 'rtl'
          }}
        >
          🎮 משחק חידת ה15 🧩
        </Typography>

        <Button
          onClick={() => setScoresOpen(true)}
          variant="contained"
          size="large"
          sx={{
            mb: 3,
            background: 'linear-gradient(45deg, #FFC107, #FF9800)',
            fontWeight: 'bold',
            borderRadius: 8,
            boxShadow: 3
          }}
        >
          🏆 צפה בשיאים
        </Button>

        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 2,
            direction: 'rtl'
          }}
        >
          בחר רמת קושי:
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {levels.map((level) => {
            const bestScore = getBestScore(level.id)
            const gradients = [
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            ]
            return (
            <Box key={level.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <Card
                onClick={() => handleLevelClick(level)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: selectedLevel?.id === level.id ? '4px solid #FFD700' : 'none',
                  background: selectedLevel?.id === level.id ? gradients[level.id - 1] : 'white',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    background: gradients[level.id - 1]
                  },
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      background: ['linear-gradient(45deg, #667eea, #764ba2)', 'linear-gradient(45deg, #f093fb, #f5576c)', 'linear-gradient(45deg, #4facfe, #00f2fe)'][level.id - 1],
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      fontWeight: 'bold',
                      filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))'
                    }}
                  >
                    {['🌟', '⭐', '💫'][level.id - 1]} {level.id}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      color: selectedLevel?.id === level.id ? 'white' : '#333',
                      mb: 1,
                      direction: 'rtl',
                      fontWeight: 'bold',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {level.difficulty}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: selectedLevel?.id === level.id ? 'rgba(255,255,255,0.9)' : '#666',
                      mb: 2,
                      direction: 'rtl',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {level.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 2,
                      flexDirection: 'column',
                      gap: 1
                    }}
                  >
                    <Typography
                      sx={{
                        background: selectedLevel?.id === level.id ? 'rgba(255,255,255,0.3)' : ['linear-gradient(45deg, #667eea, #764ba2)', 'linear-gradient(45deg, #f093fb, #f5576c)', 'linear-gradient(45deg, #4facfe, #00f2fe)'][level.id - 1],
                        color: 'white',
                        px: 3,
                        py: 1.2,
                        borderRadius: '25px',
                        fontSize: '1rem',
                        direction: 'rtl',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🎯 {level.moves} מהלכים • ⏰ {Math.floor(level.timeLimit / 60)} דקות
                    </Typography>
                    {bestScore && (
                      <Typography
                        sx={{
                          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                          color: 'white',
                          px: 2.5,
                          py: 1,
                          borderRadius: 6,
                          fontSize: '0.9rem',
                          direction: 'rtl',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          boxShadow: 2
                        }}
                      >
                        🏆 שיא: {bestScore.moves} מהלכים • {formatTime(bestScore.time)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )
        })}
        </Stack>

        {selectedLevel && (
          <Box sx={{ mb: 3, width: '80%', maxWidth: '500px' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="URL תמונה (אופציונלי - תשאר ריק לברירת מחדל)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                    }
                  }}
                />
                <Tooltip title="תמונה אקראית">
                  <IconButton
                    onClick={() => setImageUrl(getRandomDefaultImage())}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #764ba2, #667eea)'
                      }
                    }}
                  >
                    🎲
                  </IconButton>
                </Tooltip>
              </Box>
              {(imageUrl || selectedLevel) && (
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backgroundImage: `url(${imageUrl || getDefaultImage(selectedLevel.id)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
            </Stack>
            <Button
              onClick={handleStartGame}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                background: 'linear-gradient(45deg, #11998e, #38ef7d)',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                borderRadius: 8,
                boxShadow: 3
              }}
            >
              🚀 התחל משחק!
            </Button>
          </Box>
        )}
      <HighScoresModal open={scoresOpen} onClose={() => setScoresOpen(false)} />
    </Box>
  )
}
