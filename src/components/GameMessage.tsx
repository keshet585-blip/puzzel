import { Card, Typography } from '@mui/material'

interface GameMessageProps {
  type: 'win' | 'lose'
  moves: number
  maxMoves: number
}

export default function GameMessage({ type, moves, maxMoves }: GameMessageProps) {
  if (type === 'win') {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, #11998e, #38ef7d)',
          color: 'white',
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          mb: 2,
          boxShadow: 4
        }}
      >
        <Typography variant="h4" sx={{ direction: 'rtl', mb: 2, fontWeight: 'bold' }}>
          🎉🎊 כל הכבוד! פתרת את החידה! 🏆✨
        </Typography>
        <Typography variant="h6" sx={{ direction: 'rtl' }}>
          סיימת ב-{moves} מהלכים מתוך {maxMoves} מהלכים אפשריים
        </Typography>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #f44336, #e91e63)',
        color: 'white',
        p: 4,
        textAlign: 'center',
        borderRadius: 4,
        mb: 2,
        boxShadow: 4
      }}
    >
      <Typography variant="h4" sx={{ direction: 'rtl', mb: 2, fontWeight: 'bold' }}>
        😔💔 אופס! נגמר הזמן/המהלכים
      </Typography>
      <Typography variant="h6" sx={{ direction: 'rtl' }}>
        אל תוותר! נסה שוב 💪🎮
      </Typography>
    </Card>
  )
}
