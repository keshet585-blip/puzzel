// Generate beautiful gradient images using Canvas API
// No external URLs needed - works offline and bypasses NetFree

type GradientPattern = 'linear' | 'radial' | 'diagonal' | 'mesh'

const SIZE = 800

const createGradient = (
  ctx: CanvasRenderingContext2D,
  colors: string[],
  pattern: GradientPattern
): CanvasGradient => {
  const patterns: Record<GradientPattern, () => CanvasGradient> = {
    linear: () => ctx.createLinearGradient(0, 0, SIZE, SIZE),
    radial: () => ctx.createRadialGradient(SIZE / 2, SIZE / 2, 50, SIZE / 2, SIZE / 2, 600),
    diagonal: () => ctx.createLinearGradient(0, SIZE, SIZE, 0),
    mesh: () => ctx.createLinearGradient(0, 0, SIZE, SIZE) // Fallback for mesh
  }

  const gradient = patterns[pattern]()
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color)
  })
  
  return gradient
}

const generateGradientImage = (colors: string[], pattern: GradientPattern): string => {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  if (pattern === 'mesh') {
    // Mesh pattern with multiple radial gradients
    colors.forEach((color, i) => {
      const x = (i % 2) * (SIZE / 2)
      const y = Math.floor(i / 2) * (SIZE / 2)
      const gradient = ctx.createRadialGradient(x + SIZE / 4, y + SIZE / 4, 0, x + SIZE / 4, y + SIZE / 4, 300)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, colors[(i + 1) % colors.length])
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, SIZE / 2, SIZE / 2)
    })
  } else {
    ctx.fillStyle = createGradient(ctx, colors, pattern)
    ctx.fillRect(0, 0, SIZE, SIZE)
  }

  return canvas.toDataURL('image/jpeg', 0.9)
}

interface GradientConfig {
  id: number
  category: string
  colors: string[]
  pattern: GradientPattern
  name: string
}

const gradientConfigs: GradientConfig[] = [
  { id: 1, category: 'שקיעה', colors: ['#FF6B6B', '#FFD93D', '#6BCF7F'], pattern: 'linear', name: 'שקיעה חמה' },
  { id: 2, category: 'אוקיינוס', colors: ['#4A90E2', '#50C9CE', '#7FDBFF'], pattern: 'radial', name: 'גלי אוקיינוס' },
  { id: 3, category: 'סגול', colors: ['#667EEA', '#764BA2', '#F093FB'], pattern: 'diagonal', name: 'סגול קסום' },
  { id: 4, category: 'אש', colors: ['#FF0844', '#FFB199', '#FF6E7F'], pattern: 'linear', name: 'להבות אש' },
  { id: 5, category: 'יער', colors: ['#134E5E', '#71B280', '#A8E6CF'], pattern: 'radial', name: 'יער ירוק' },
  { id: 6, category: 'ורוד', colors: ['#FA709A', '#FEE140', '#FFDEE9'], pattern: 'mesh', name: 'ורוד רך' },
  { id: 7, category: 'כחול', colors: ['#30CFD0', '#330867', '#4FACFE'], pattern: 'diagonal', name: 'כחול עמוק' },
  { id: 8, category: 'זהב', colors: ['#F2994A', '#F2C94C', '#FFE259'], pattern: 'linear', name: 'זהב וזריחה' },
  { id: 9, category: 'טורקיז', colors: ['#A8EDEA', '#FED6E3', '#FFE6FA'], pattern: 'radial', name: 'טורקיז רך' },
  { id: 10, category: 'אדום', colors: ['#FF9A9E', '#FECFEF', '#FFDDE1'], pattern: 'mesh', name: 'אדום פסטלי' }
]

const imageCache = new Map<number, string>()

const getOrGenerateImage = (index: number): string => {
  if (!imageCache.has(index)) {
    const config = gradientConfigs[index]
    imageCache.set(index, generateGradientImage(config.colors, config.pattern))
  }
  return imageCache.get(index)!
}

export const defaultImages = gradientConfigs.map(({ id, category, name }) => ({
  id,
  category,
  url: '',
  name
}))

export const getDefaultImage = (levelId: number): string => 
  getOrGenerateImage((levelId - 1) % gradientConfigs.length)

export const getRandomDefaultImage = (): string => 
  getOrGenerateImage(Math.floor(Math.random() * gradientConfigs.length))

export const getImagesByCategory = (category: string) => 
  defaultImages.filter(img => img.category === category)

export const getCategories = () => 
  [...new Set(defaultImages.map(img => img.category))]
