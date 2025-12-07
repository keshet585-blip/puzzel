class SoundManager {
  private soundEnabled: boolean
  private musicEnabled: boolean
  private volume: number

  constructor() {
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false'
    this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false'
    this.volume = Number(localStorage.getItem('soundVolume') || 0.3)
  }

  private playSound(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.soundEnabled) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type
    gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }

  playTileMove() {
    this.playSound(400, 0.1, 'sine')
  }

  playWin() {
    if (!this.soundEnabled) return
    // Victory melody
    setTimeout(() => this.playSound(523, 0.15, 'square'), 0)
    setTimeout(() => this.playSound(659, 0.15, 'square'), 150)
    setTimeout(() => this.playSound(784, 0.3, 'square'), 300)
  }

  playTick() {
    this.playSound(800, 0.05, 'square')
  }

  playHint() {
    this.playSound(1000, 0.1, 'sine')
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
    localStorage.setItem('soundEnabled', String(enabled))
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled
    localStorage.setItem('musicEnabled', String(enabled))
  }

  setVolume(volume: number) {
    this.volume = volume
    localStorage.setItem('soundVolume', String(volume))
  }

  getSoundEnabled(): boolean {
    return this.soundEnabled
  }

  getMusicEnabled(): boolean {
    return this.musicEnabled
  }

  getVolume(): number {
    return this.volume
  }
}

export const soundManager = new SoundManager()
