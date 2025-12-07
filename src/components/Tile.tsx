import { Box } from '@mui/material'
import { motion } from 'framer-motion'

interface TileProps {
  number: number | null
  row: number
  col: number
  boardSize: number
  tileSize: number
  imageUrl: string | null
  onClick: () => void
  isMovable: boolean
  isHighlighted?: boolean
}

export default function Tile({ 
  number, 
  row, 
  col, 
  boardSize, 
  tileSize, 
  imageUrl, 
  onClick, 
  isMovable,
  isHighlighted = false
}: TileProps) {
  const isEmpty = number === null

  return (
    <motion.div
      layout
      initial={false}
      animate={{ scale: 1 }}
      whileHover={isMovable ? { scale: 0.95 } : {}}
      whileTap={isMovable ? { scale: 0.90 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Box
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          minHeight: `${tileSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          background: isEmpty 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            : imageUrl 
            ? 'transparent' 
            : `linear-gradient(135deg, ${[
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
              ][(number || 1) % 9]})`,
          backgroundImage: imageUrl && !isEmpty ? `url(${imageUrl})` : 'none',
          backgroundSize: imageUrl ? `${boardSize * tileSize}px ${boardSize * tileSize}px` : 'cover',
          backgroundPosition: imageUrl ? `-${col * tileSize}px -${row * tileSize}px` : 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          border: isHighlighted 
            ? '4px solid #FFD700' 
            : isEmpty 
            ? '3px dashed rgba(255,255,255,0.3)' 
            : 'none',
          borderRadius: '12px',
          cursor: isMovable ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isHighlighted
            ? '0 0 30px rgba(255, 215, 0, 0.8), 0 10px 25px rgba(0, 0, 0, 0.4)'
            : isEmpty 
            ? 'inset 0 2px 8px rgba(0,0,0,0.1)' 
            : isMovable 
            ? '0 6px 15px rgba(0, 0, 0, 0.3)' 
            : '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          filter: isHighlighted ? 'brightness(1.3)' : 'none',
          animation: isHighlighted ? 'pulse 1s infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
            },
            '50%': {
              transform: 'scale(1.05)',
            },
          },
          '&:hover': {
            boxShadow: isHighlighted 
              ? '0 0 30px rgba(255, 215, 0, 0.8), 0 10px 25px rgba(0, 0, 0, 0.4)'
              : isMovable 
              ? '0 10px 25px rgba(0, 0, 0, 0.4)' 
              : isEmpty 
              ? 'inset 0 2px 8px rgba(0,0,0,0.1)' 
              : '0 4px 8px rgba(0, 0, 0, 0.2)',
            filter: isMovable && !isHighlighted ? 'brightness(1.1)' : isHighlighted ? 'brightness(1.3)' : 'none',
          },
          textShadow: '0 3px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
          '&::before': isEmpty ? {} : {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': isEmpty ? {} : {
            left: '100%',
          }
        }}
      >
        {!isEmpty && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              backgroundColor: imageUrl ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
              borderRadius: '4px',
              px: imageUrl ? 1 : 0,
              py: imageUrl ? 0.5 : 0,
              fontSize: imageUrl ? '0.9rem' : '1.5rem',
            }}
          >
            {number}
          </Box>
        )}
      </Box>
    </motion.div>
  )
}
