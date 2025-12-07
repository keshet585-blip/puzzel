import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { getHighScores, formatTime, type HighScore } from '../utils/highScores'

interface HighScoresModalProps {
  open: boolean
  onClose: () => void
}

const levels = [
  { id: 1, name: 'קל' },
  { id: 2, name: 'בינוני' },
  { id: 3, name: 'קשה' },
]

export default function HighScoresModal({ open, onClose }: HighScoresModalProps) {
  const [selectedLevel, setSelectedLevel] = useState(1)

  const scores = getHighScores(selectedLevel)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          direction: 'rtl',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          🏆 טבלת שיאים
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <Tabs
            value={selectedLevel}
            onChange={(_, newValue) => setSelectedLevel(newValue)}
            sx={{
              '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .Mui-selected': { color: 'white !important' },
              '& .MuiTabs-indicator': { backgroundColor: 'white' },
            }}
            centered
          >
            {levels.map((level) => (
              <Tab key={level.id} label={level.name} value={level.id} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {scores.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ color: 'white', textAlign: 'center', py: 4, direction: 'rtl' }}
            >
              אין שיאים עדיין. היה הראשון לפתור את החידה!
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      דירוג
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      מהלכים
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      זמן
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      תאריך
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scores.map((score: HighScore, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          index === 0
                            ? 'rgba(255, 215, 0, 0.2)'
                            : index === 1
                            ? 'rgba(192, 192, 192, 0.2)'
                            : index === 2
                            ? 'rgba(205, 127, 50, 0.2)'
                            : 'transparent',
                      }}
                    >
                      <TableCell align="center">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </TableCell>
                      <TableCell align="center">{score.moves}</TableCell>
                      <TableCell align="center">{formatTime(score.time)}</TableCell>
                      <TableCell align="center">
                        {new Date(score.date).toLocaleDateString('he-IL')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
