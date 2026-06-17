let audioCtx = null
let isPlaying = false
let masterGain = null

// Sound preference — default to ambient
let soundMode = localStorage.getItem('haven-sound') || 'ambient'

export function getSoundMode() {
  return soundMode
}

export function setSoundMode(mode) {
  soundMode = mode
  localStorage.setItem('haven-sound', mode)

  if (mode === 'silent') {
    stopAmbientAudio()
  } else if (!isPlaying) {
    startAmbientAudio()
  }
}

export function startAmbientAudio() {
  if (isPlaying) return
  if (soundMode === 'silent') return
  isPlaying = true

  audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  masterGain = audioCtx.createGain()
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 8)
  masterGain.connect(audioCtx.destination)

  // Long reverb — large quiet room
  const convolver = audioCtx.createConvolver()
  const reverbTime = audioCtx.sampleRate * 8
  const reverbBuffer = audioCtx.createBuffer(2, reverbTime, audioCtx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = reverbBuffer.getChannelData(ch)
    for (let i = 0; i < reverbTime; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbTime, 1.5)
    }
  }
  convolver.buffer = reverbBuffer

  const wetGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  wetGain.gain.value = 0.88
  dryGain.gain.value = 0.12
  masterGain.connect(convolver)
  convolver.connect(wetGain)
  wetGain.connect(audioCtx.destination)
  masterGain.connect(dryGain)
  dryGain.connect(audioCtx.destination)

  // ── LAYER 1: Airy pad — moved up from A1 to A2/E3/A3 ──────────────
  // Higher frequencies feel airy and open rather than ominous
  function createPadLayer(frequency, volume) {
    const osc1 = audioCtx.createOscillator()
    const osc2 = audioCtx.createOscillator()
    const osc3 = audioCtx.createOscillator()

    osc1.type = 'sine'
    osc1.frequency.value = frequency
    osc2.type = 'sine'
    osc2.frequency.value = frequency * 1.002
    osc3.type = 'sine'
    osc3.frequency.value = frequency * 0.998

    const padGain = audioCtx.createGain()
    padGain.gain.value = volume

    osc1.connect(padGain)
    osc2.connect(padGain)
    osc3.connect(padGain)
    padGain.connect(masterGain)

    osc1.start()
    osc2.start()
    osc3.start()
  }

  if (soundMode === 'ambient' || soundMode === 'piano') {
    // No more A1/E2 — start at A2 so it feels light not dark
    createPadLayer(110, 0.03)  // A2 — warm foundation
    createPadLayer(165, 0.02)  // E3 — perfect fifth, airy
    createPadLayer(220, 0.015) // A3 — gentle shimmer
  }

  // ── LAYER 2: Subtle breathing texture — much quieter ──────────────
  // Reduced so the user never consciously hears it
  // The room is gently alive, not obviously breathing
  if (soundMode === 'ambient' || soundMode === 'piano') {
    const bufferSize = audioCtx.sampleRate * 4
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1
    }

    const noiseSource = audioCtx.createBufferSource()
    noiseSource.buffer = noiseBuffer
    noiseSource.loop = true

    const noiseFilter = audioCtx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 300
    noiseFilter.Q.value = 0.3

    const noiseGain = audioCtx.createGain()
    // Much quieter — barely perceptible
    noiseGain.gain.value = 0.006

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(masterGain)
    noiseSource.start()

    // Subtle modulation — range is tiny so user never consciously hears the cycle
    function breatheNoise() {
      if (!isPlaying) return
      const now = audioCtx.currentTime
      noiseGain.gain.linearRampToValueAtTime(0.009, now + 4)
      noiseGain.gain.linearRampToValueAtTime(0.004, now + 8)
      setTimeout(breatheNoise, 8000)
    }
    breatheNoise()
  }

  // ── LAYER 3: Sparse piano — 20 to 40 seconds apart ────────────────
  // Silence is part of the experience
  // A note after 35 seconds of quiet feels meaningful
  if (soundMode === 'ambient' || soundMode === 'piano') {
    function playReflectionNote() {
      if (!isPlaying) return

      const notes = [
        220.00, // A3
        261.63, // C4
        293.66, // D4
        329.63, // E4
        392.00, // G4
        440.00, // A4
        523.25, // C5
      ]

      const freq = notes[Math.floor(Math.random() * notes.length)]
      const now = audioCtx.currentTime

      const noteGain = audioCtx.createGain()
      noteGain.connect(masterGain)

      // Piano envelope — hammer strike with long tail
      noteGain.gain.setValueAtTime(0, now)
      noteGain.gain.linearRampToValueAtTime(1.0, now + 0.003)
      noteGain.gain.exponentialRampToValueAtTime(0.35, now + 0.08)
      noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.5)
      noteGain.gain.exponentialRampToValueAtTime(0.06, now + 2.5)
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 7)

      // 5 harmonics for realistic piano timbre
      const harmonics = [
        { mult: 1, type: 'triangle', vol: 0.55, decay: 8   },
        { mult: 2, type: 'sine',     vol: 0.35, decay: 1.5 },
        { mult: 3, type: 'sine',     vol: 0.18, decay: 0.8 },
        { mult: 4, type: 'sine',     vol: 0.08, decay: 0.4 },
        { mult: 5, type: 'sine',     vol: 0.04, decay: 0.2 },
      ]

      harmonics.forEach(({ mult, type, vol, decay }) => {
        const osc = audioCtx.createOscillator()
        const g = audioCtx.createGain()
        osc.type = type
        osc.frequency.value = freq * mult
        g.gain.setValueAtTime(vol, now)
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay)
        osc.connect(g)
        g.connect(noteGain)
        osc.start(now)
        osc.stop(now + 8)
      })

      // Occasional second note — gentle echo, 40% chance
      if (Math.random() > 0.6) {
        const freq2 = notes[Math.floor(Math.random() * notes.length)]
        const delay = 1.5 + Math.random() * 2
        const noteGain2 = audioCtx.createGain()
        noteGain2.connect(masterGain)
        noteGain2.gain.setValueAtTime(0, now + delay)
        noteGain2.gain.linearRampToValueAtTime(0.6, now + delay + 0.003)
        noteGain2.gain.exponentialRampToValueAtTime(0.20, now + delay + 0.08)
        noteGain2.gain.exponentialRampToValueAtTime(0.08, now + delay + 0.5)
        noteGain2.gain.exponentialRampToValueAtTime(0.0001, now + delay + 5)

        harmonics.slice(0, 4).forEach(({ mult, type, vol, decay }) => {
          const osc = audioCtx.createOscillator()
          const g = audioCtx.createGain()
          osc.type = type
          osc.frequency.value = freq2 * mult
          g.gain.setValueAtTime(vol * 0.6, now + delay)
          g.gain.exponentialRampToValueAtTime(0.0001, now + delay + decay)
          osc.connect(g)
          g.connect(noteGain2)
          osc.start(now + delay)
          osc.stop(now + delay + 6)
        })
      }

      // 20 to 40 seconds — silence is meaningful
      const next = 20000 + Math.random() * 20000
      setTimeout(playReflectionNote, next)
    }

    setTimeout(playReflectionNote, 8000)
  }
}

// ── Response bloom — pool of 10 gentle voicings ───────────────────────
// Randomly selected so it never feels like a notification
export function playResponseBloom() {
  if (!audioCtx || !isPlaying) return
  if (soundMode === 'silent') return

  const bloomVoicings = [
    [440, 523.25, 659.25],       // A-C-E
    [261.63, 329.63, 392.00],    // C-E-G
    [293.66, 440.00],            // D-A
    [440.00, 659.25],            // A-E
    [392.00, 293.66],            // G-D
    [329.63, 440.00, 523.25],    // E-A-C
    [261.63, 392.00],            // C-G
    [220.00, 329.63],            // A-E (lower)
    [293.66, 392.00, 523.25],    // D-G-C
    [220.00, 261.63, 329.63],    // A-C-E (lower)
  ]

  const voicing = bloomVoicings[Math.floor(Math.random() * bloomVoicings.length)]
  const now = audioCtx.currentTime

  voicing.forEach((freq, i) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.value = freq

    const startTime = now + i * 0.07
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.5)

    osc.connect(gain)
    gain.connect(masterGain)
    osc.start(startTime)
    osc.stop(startTime + 4)
  })
}

export function stopAmbientAudio() {
  if (masterGain && audioCtx) {
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3)
    setTimeout(() => { isPlaying = false }, 3000)
  }
}