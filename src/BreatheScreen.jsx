import { useState, useEffect, useRef } from 'react'
import Background from './Background'

const GREETINGS = [
  'Take a breath with me.',
  'No need to rush.',
  "We'll go one breath at a time.",
  'Nothing else needs your attention right now.',
  'Follow the circle. Let it set the pace.'
]

const INTENTIONS = [
  'Take a moment. Nothing else needs your attention right now.',
  'Follow the circle. Let your breathing set the pace.',
  "There's nowhere else to be right now.",
  'Let the circle guide you. You don\'t need to think.',
]

const CYCLE_AFFIRMATIONS = [
  'You\'re doing well.',
  'Stay with it.',
  'Nice and easy.',
  'Let go a little more.',
  'You\'re right here.',
  'That\'s it.',
  'Keep going.',
  'Breathe.',
]

const TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
    feeling: 'Best when your mind feels busy.',
    description: 'Equal counts for inhale, hold, exhale, hold. Calms the nervous system.',
    category: 'Calm',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 4 },
      { label: 'Exhale', duration: 4 },
      { label: 'Hold', duration: 4 }
    ]
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    feeling: 'Best before sleep or after anxiety spikes.',
    description: 'A natural tranquilizer for the nervous system. Ideal for anxiety and sleep.',
    category: 'Anxiety',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 7 },
      { label: 'Exhale', duration: 8 }
    ]
  },
  {
    id: 'physiological',
    name: 'Physiological Sigh',
    feeling: 'Fastest technique for immediate stress.',
    description: 'Double inhale through the nose, long exhale. The fastest way to reduce stress.',
    category: 'Stress',
    phases: [
      { label: 'Inhale', duration: 2 },
      { label: 'Inhale again', duration: 1 },
      { label: 'Exhale slowly', duration: 6 }
    ]
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    feeling: 'Good for restoring a sense of balance.',
    description: 'Five breaths per minute. Balances the heart and mind.',
    category: 'Balance',
    phases: [
      { label: 'Inhale', duration: 6 },
      { label: 'Exhale', duration: 6 }
    ]
  },
  {
    id: '244',
    name: '2-4-4 Breathing',
    feeling: 'When you need to feel grounded quickly.',
    description: 'Short inhale, longer hold and exhale. Grounds you quickly.',
    category: 'Grounding',
    phases: [
      { label: 'Inhale', duration: 2 },
      { label: 'Hold', duration: 4 },
      { label: 'Exhale', duration: 4 }
    ]
  },
  {
    id: 'deep',
    name: 'Deep Belly Breathing',
    feeling: 'For when you want to slow everything down.',
    description: 'Slow, deep breaths that activate the parasympathetic nervous system.',
    category: 'Relax',
    phases: [
      { label: 'Inhale deeply', duration: 5 },
      { label: 'Exhale slowly', duration: 7 }
    ]
  }
]

const CATEGORY_COLORS = {
  'Calm':      'rgba(100, 200, 200, 0.25)',
  'Anxiety':   'rgba(140, 100, 220, 0.25)',
  'Stress':    'rgba(220, 140, 100, 0.25)',
  'Balance':   'rgba(100, 160, 220, 0.25)',
  'Grounding': 'rgba(150, 210, 150, 0.25)',
  'Relax':     'rgba(180, 140, 220, 0.25)'
}

// ── Ambient breath-synced audio ─────────────────────────────────────────
let breathAudioCtx = null
let breathMasterGain = null
let breathIsRunning = false

function initBreathAudio() {
  if (breathAudioCtx) return
  breathAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  breathMasterGain = breathAudioCtx.createGain()
  breathMasterGain.gain.value = 0
  breathMasterGain.connect(breathAudioCtx.destination)
  const convolver = breathAudioCtx.createConvolver()
  const rt = breathAudioCtx.sampleRate * 6
  const rb = breathAudioCtx.createBuffer(2, rt, breathAudioCtx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = rb.getChannelData(ch)
    for (let i = 0; i < rt; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rt, 1.8)
  }
  convolver.buffer = rb
  const wet = breathAudioCtx.createGain(); wet.gain.value = 0.80
  const dry = breathAudioCtx.createGain(); dry.gain.value = 0.20
  breathMasterGain.connect(convolver)
  convolver.connect(wet); wet.connect(breathAudioCtx.destination)
  breathMasterGain.connect(dry); dry.connect(breathAudioCtx.destination)
  ;[[110, 0.04], [165, 0.025], [220, 0.015]].forEach(([freq, vol]) => {
    const o1 = breathAudioCtx.createOscillator()
    const o2 = breathAudioCtx.createOscillator()
    o1.type = 'sine'; o1.frequency.value = freq
    o2.type = 'sine'; o2.frequency.value = freq * 1.003
    const g = breathAudioCtx.createGain(); g.gain.value = vol
    o1.connect(g); o2.connect(g); g.connect(breathMasterGain)
    o1.start(); o2.start()
  })
  const bufSize = breathAudioCtx.sampleRate * 4
  const noiseBuf = breathAudioCtx.createBuffer(1, bufSize, breathAudioCtx.sampleRate)
  const nd = noiseBuf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) nd[i] = Math.random() * 2 - 1
  const noiseNode = breathAudioCtx.createBufferSource()
  noiseNode.buffer = noiseBuf; noiseNode.loop = true
  const lp = breathAudioCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400; lp.Q.value = 0.5
  const ng = breathAudioCtx.createGain(); ng.gain.value = 0.008
  noiseNode.connect(lp); lp.connect(ng); ng.connect(breathMasterGain)
  noiseNode.start()
}

function setBreathVolume(target, durationSec) {
  if (!breathMasterGain || !breathAudioCtx) return
  const now = breathAudioCtx.currentTime
  breathMasterGain.gain.cancelScheduledValues(now)
  breathMasterGain.gain.setValueAtTime(breathMasterGain.gain.value, now)
  breathMasterGain.gain.linearRampToValueAtTime(target, now + durationSec)
}

function startBreathAudio() {
  if (breathIsRunning) return
  breathIsRunning = true
  initBreathAudio()
  if (breathAudioCtx.state === 'suspended') breathAudioCtx.resume()
  setBreathVolume(0.12, 3)
}

function stopBreathAudio() {
  if (!breathIsRunning) return
  breathIsRunning = false
  setBreathVolume(0, 2.5)
}

// ── Floating particles ──────────────────────────────────────────────────
function Particles() {
  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 18 + Math.random() * 22,
      delay: -(Math.random() * 20),
      driftX: (Math.random() - 0.5) * 60,
      driftY: -30 - Math.random() * 50
    }))
  ).current

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes particle-drift {
          0%   { transform: translate(0, 0); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.6; }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: '50%',
          background: 'rgba(160,210,255,0.55)',
          filter: 'blur(1.5px)',
          '--dx': `${p.driftX}px`,
          '--dy': `${p.driftY}px`,
          animation: `particle-drift ${p.duration}s ${p.delay}s infinite ease-in-out`,
          opacity: 0
        }} />
      ))}
    </div>
  )
}

// ── Ripple on phase change ──────────────────────────────────────────────
// A single ring that expands outward and fades each time the phase changes.
// The key={rippleKey} trick forces React to remount the element,
// which restarts the CSS animation from scratch every phase change.
function PhaseRipple({ phaseIndex, running }) {
  const [rippleKey, setRippleKey] = useState(0)

  useEffect(() => {
    if (running) setRippleKey(k => k + 1)
  }, [phaseIndex, running])

  if (!running) return null

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <style>{`
        @keyframes ripple-expand {
          0%   { transform: scale(1);    opacity: 0.35; }
          100% { transform: scale(2.2);  opacity: 0; }
        }
      `}</style>
      <div
        key={rippleKey}
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(140,200,255,0.5)',
          animation: 'ripple-expand 1.8s ease-out forwards',
          position: 'absolute'
        }}
      />
    </div>
  )
}

// ── Radial fog behind the orb ───────────────────────────────────────────
// A large blurred circle sitting behind the orb that grows on inhale
// and shrinks on exhale, giving the orb warmth and presence in the space.
function OrbFog({ phase }) {
  const isInhale = phase.toLowerCase().includes('inhale')
  const isExhale = phase.toLowerCase().includes('exhale')
  const size = isInhale ? '520px' : isExhale ? '340px' : '420px'
  const opacity = isInhale ? 0.18 : isExhale ? 0.08 : 0.13

  return (
    <div style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(100,160,255,1) 0%, rgba(80,120,255,0.3) 40%, transparent 70%)',
      filter: 'blur(60px)',
      opacity,
      transition: 'width 3s ease-in-out, height 3s ease-in-out, opacity 3s ease-in-out',
      pointerEvents: 'none',
      zIndex: 0
    }} />
  )
}

// ── Main breathing orb ──────────────────────────────────────────────────
function BreathingOrb({ phase, running, secondsLeft, totalSeconds, phaseIndex }) {
  const orbRef = useRef(null)
  const scaleRef = useRef(1)
  const isInhale = phase.toLowerCase().includes('inhale')
  const isExhale = phase.toLowerCase().includes('exhale')
  const isHold = phase.toLowerCase().includes('hold')

  useEffect(() => {
    if (!orbRef.current || !running) return
    const targetScale = isInhale ? 1.38 : isExhale ? 0.72 : scaleRef.current
    const dur = totalSeconds * 1000
    const easing = isHold ? 'linear' : 'ease-in-out'
    orbRef.current.style.transition = `transform ${dur}ms ${easing}, box-shadow 0.8s ease`
    orbRef.current.style.transform = `scale(${targetScale})`
    scaleRef.current = targetScale
    if (isInhale) setBreathVolume(0.18, totalSeconds * 0.9)
    else if (isExhale) setBreathVolume(0.07, totalSeconds * 0.9)
    else setBreathVolume(0.12, 0.6)
  }, [phase, running])

  const glowBase = 'rgba(110,180,255,0.18)'
  const glowStrong = 'rgba(110,190,255,0.45)'
  const glowCurrent = isInhale ? glowStrong : isExhale ? glowBase : 'rgba(110,180,255,0.28)'
  const glowOuter = isInhale ? 'rgba(110,180,255,0.18)' : 'rgba(110,180,255,0.07)'

  return (
    <div style={{
      position: 'relative',
      width: '260px', height: '260px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Radial fog — gives the orb warmth and fills the surrounding space */}
      <OrbFog phase={phase} />

      {/* Ripple — expands outward on every phase change */}
      <PhaseRipple phaseIndex={phaseIndex} running={running} />

      {/* Original outer glow halo */}
      <div style={{
        position: 'absolute',
        width: '260px', height: '260px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowOuter} 0%, transparent 70%)`,
        filter: 'blur(28px)',
        transition: 'all 1.5s ease',
        transform: `scale(${isInhale ? 1.15 : 0.95})`
      }} />

      {/* Main orb */}
      <div
        ref={orbRef}
        style={{
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 38%, rgba(190,215,255,0.38), rgba(100,140,255,0.20))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.30)',
          boxShadow: `0 0 40px ${glowCurrent}, 0 0 100px ${glowOuter}, inset 0 1px 1px rgba(255,255,255,0.25)`,
          display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '6px',
          transition: 'transform 4s ease-in-out, box-shadow 1.2s ease',
          position: 'relative', zIndex: 1
        }}
      >
        <span style={{
          color: 'rgba(255,255,255,0.92)',
          fontSize: running ? '17px' : '14px',
          fontWeight: '300',
          letterSpacing: '0.06em',
          fontFamily: "'Georgia', serif",
          transition: 'font-size 0.4s ease'
        }}>
          {running ? phase : 'Ready'}
        </span>
        {running && (
          <span style={{
            color: 'rgba(255,255,255,0.38)',
            fontSize: '26px',
            fontWeight: '200',
            lineHeight: 1
          }}>
            {secondsLeft}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Completion screen ───────────────────────────────────────────────────
function CompletionScreen({ cycles, onRestart, onHome }) {
  const [feeling, setFeeling] = useState(null)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      gap: '28px', padding: '20px',
      animation: 'fadeSlideIn 0.7s ease forwards'
    }}>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase' }}>
        Session complete
      </div>
      <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: '28px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: 1.4 }}>
        Well done.
      </div>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '300', lineHeight: 1.6 }}>
        {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed.
      </div>
      {!feeling ? (
        <>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '8px 0 4px' }}>
            How do you feel now?
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[{ emoji: '😊', label: 'Better' }, { emoji: '😐', label: 'About the same' }, { emoji: '😔', label: 'Still overwhelmed' }].map(({ emoji, label }) => (
              <button key={label} onClick={() => setFeeling(label)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                padding: '14px 18px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.80)', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <span style={{ fontSize: '24px' }}>{emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: '300', letterSpacing: '0.02em' }}>{label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: 1.7, maxWidth: '240px', animation: 'fadeSlideIn 0.5s ease forwards' }}>
          {feeling === 'Better' ? "That's what matters. Take it gently." : feeling === 'About the same' ? "That's okay. The breath still helped." : 'Be gentle with yourself. Rest if you can.'}
        </div>
      )}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button onClick={onRestart} style={{ padding: '10px 22px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(12px)', letterSpacing: '0.03em' }}>
          Go again
        </button>
        <button onClick={onHome} style={{ padding: '10px 22px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.13)', color: 'white', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(12px)', letterSpacing: '0.03em' }}>
          Back to techniques
        </button>
      </div>
    </div>
  )
}

// ── Main screen ─────────────────────────────────────────────────────────
function BreatheScreen({ onBack }) {
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [visible, setVisible] = useState(false)
  const [targetMinutes, setTargetMinutes] = useState(3)
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(3 * 60)
  const [completed, setCompleted] = useState(false)
  const [bgBrightness, setBgBrightness] = useState(1)
  const [affirmation, setAffirmation] = useState(CYCLE_AFFIRMATIONS[0])
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
  const [intention] = useState(() => INTENTIONS[Math.floor(Math.random() * INTENTIONS.length)])
  const timerRef = useRef(null)
  const sessionTimerRef = useRef(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    if (running && secondsLeft > 0) {
      timerRef.current = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    } else if (running && secondsLeft === 0) {
      const next = (phaseIndex + 1) % selected.phases.length
      if (next === 0) {
        setCycles(c => {
          const newCount = c + 1
          setAffirmation(CYCLE_AFFIRMATIONS[newCount % CYCLE_AFFIRMATIONS.length])
          return newCount
        })
      }
      setPhaseIndex(next)
      setSecondsLeft(selected.phases[next].duration)
    }
    return () => clearTimeout(timerRef.current)
  }, [running, secondsLeft])

  useEffect(() => {
    if (running && sessionSecondsLeft > 0) {
      sessionTimerRef.current = setTimeout(() => setSessionSecondsLeft(s => s - 1), 1000)
    } else if (running && sessionSecondsLeft === 0) {
      setRunning(false)
      stopBreathAudio()
      setCompleted(true)
    }
    return () => clearTimeout(sessionTimerRef.current)
  }, [running, sessionSecondsLeft])

  useEffect(() => { setSessionSecondsLeft(targetMinutes * 60) }, [targetMinutes])

  useEffect(() => {
    if (!running) { setBgBrightness(1); return }
    const phase = selected?.phases[phaseIndex]?.label || ''
    const isInhale = phase.toLowerCase().includes('inhale')
    const isExhale = phase.toLowerCase().includes('exhale')
    setBgBrightness(isInhale ? 1.05 : isExhale ? 0.97 : 1.01)
  }, [phaseIndex, running])

  function selectTechnique(technique) {
    setSelected(technique)
    setTargetMinutes(3)
    setView('prep')
  }

  function beginSession() {
    setPhaseIndex(0)
    setSecondsLeft(selected.phases[0].duration)
    setCycles(0)
    setRunning(false)
    setCompleted(false)
    setSessionSecondsLeft(targetMinutes * 60)
    setAffirmation(CYCLE_AFFIRMATIONS[0])
    setView('session')
  }

  function toggleRun() {
    if (!running) { startBreathAudio() } else { stopBreathAudio() }
    setRunning(r => !r)
  }

  function reset() {
    setRunning(false)
    stopBreathAudio()
    setPhaseIndex(0)
    setSecondsLeft(selected.phases[0].duration)
    setCycles(0)
    setCompleted(false)
    setSessionSecondsLeft(targetMinutes * 60)
    setAffirmation(CYCLE_AFFIRMATIONS[0])
    clearTimeout(sessionTimerRef.current)
  }

  function formatSessionTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const sessionProgress = 1 - sessionSecondsLeft / (targetMinutes * 60)
  const currentPhase = selected?.phases[phaseIndex]

  function handleBack() {
    if (view === 'home') { onBack(); return }
    if (view === 'prep') { setView('home'); return }
    setRunning(false)
    stopBreathAudio()
    setView('home')
  }

  function backLabel() {
    if (view === 'home') return 'Home'
    return 'Techniques'
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{
        position: 'absolute', inset: 0,
        filter: `brightness(${bgBrightness})`,
        transition: `filter ${currentPhase ? currentPhase.duration * 0.9 : 4}s ease-in-out`,
        zIndex: 0
      }}>
        <Background />
      </div>

      <Particles />

      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,15,40,0.35) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', zIndex: 2,
        opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease'
      }}>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '22px 36px', borderBottom: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
        }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.04em', padding: 0 }}>
            ← {backLabel()}
          </button>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: '400' }}>
            Breathe
          </span>
          <div style={{ width: '80px' }} />
        </div>

        {/* Content */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none',
          padding: view === 'session' ? '0' : '36px', boxSizing: 'border-box',
          display: (view === 'session' || view === 'prep') ? 'flex' : 'block',
          alignItems: (view === 'session' || view === 'prep') ? 'center' : 'unset',
          justifyContent: (view === 'session' || view === 'prep') ? 'center' : 'unset'
        }}>

          {/* ── HOME VIEW ── */}
          {view === 'home' && (
            <div style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
              <div style={{ margin: '0 0 6px 36px', color: 'rgba(180,210,255,0.55)', fontSize: '13px', fontWeight: '300', fontFamily: "'Georgia', serif", letterSpacing: '0.02em', fontStyle: 'italic' }}>
                {greeting}
              </div>
              <h2 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 8px 36px' }}>
                Breathing Techniques
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '14px', fontWeight: '300', margin: '0 0 28px 36px', lineHeight: '1.6' }}>
                Choose based on how you're feeling right now.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', padding: '0 36px' }}>
                {TECHNIQUES.map((technique, i) => (
                  <div
                    key={technique.id}
                    onClick={() => selectTechnique(technique)}
                    style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.13)', cursor: 'pointer', transition: 'all 0.2s ease', animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: `${i * 0.07}s`, opacity: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ padding: '5px 14px', borderRadius: '20px', background: CATEGORY_COLORS[technique.category], color: 'rgba(255,255,255,0.95)', fontSize: '10px', letterSpacing: '0.08em', fontWeight: '600', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.20)' }}>
                        {technique.category}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', letterSpacing: '0.04em', fontWeight: '300' }}>
                        {technique.phases.map(p => p.duration).join('-')}
                      </span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: '17px', fontWeight: '400', fontFamily: "'Georgia', serif", lineHeight: '1.3' }}>
                      {technique.name}
                    </div>
                    <div style={{ color: 'rgba(160,210,255,0.70)', fontSize: '12px', fontWeight: '300', fontStyle: 'italic', lineHeight: '1.5' }}>
                      {technique.feeling}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px', fontWeight: '300', lineHeight: '1.5' }}>
                      {technique.description}
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '2px' }}>
                      {technique.phases.map((phase, pi) => (
                        <span key={pi} style={{ padding: '2px 9px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.38)', fontSize: '10px', fontWeight: '300' }}>
                          {phase.label} {phase.duration}s
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PREP VIEW ── */}
          {view === 'prep' && selected && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0', width: '100%', maxWidth: '360px', animation: 'fadeSlideIn 0.5s ease forwards' }}>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: '10px' }}>
                {selected.category}
              </div>
              <h2 style={{ color: 'rgba(255,255,255,0.90)', fontSize: '26px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 8px' }}>
                {selected.name}
              </h2>
              <div style={{ color: 'rgba(160,210,255,0.65)', fontSize: '13px', fontWeight: '300', fontStyle: 'italic', marginBottom: '32px' }}>
                {selected.feeling}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {selected.phases.map((phase, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: '300', letterSpacing: '0.02em' }}>
                      {phase.label}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '10px' }}>{phase.duration}s</span>
                  </div>
                ))}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', fontWeight: '300', marginBottom: '16px', letterSpacing: '0.02em' }}>
                How long would you like to breathe?
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[1, 3, 5, 10].map(min => (
                  <button key={min} onClick={() => setTargetMinutes(min)} style={{
                    padding: '10px 20px', borderRadius: '24px',
                    border: `1px solid ${targetMinutes === min ? 'rgba(140,200,255,0.50)' : 'rgba(255,255,255,0.20)'}`,
                    background: targetMinutes === min ? 'rgba(140,200,255,0.18)' : 'rgba(255,255,255,0.06)',
                    color: targetMinutes === min ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                    fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: '0.02em',
                    boxShadow: targetMinutes === min ? '0 0 16px rgba(140,200,255,0.15)' : 'none'
                  }}>
                    {min} min
                  </button>
                ))}
              </div>
              <div style={{ color: 'rgba(180,210,255,0.45)', fontSize: '13px', fontWeight: '300', fontFamily: "'Georgia', serif", fontStyle: 'italic', marginBottom: '36px', lineHeight: 1.7, maxWidth: '280px' }}>
                {intention}
              </div>
              <button onClick={beginSession} style={{
                padding: '14px 52px', borderRadius: '32px',
                border: '1px solid rgba(140,200,255,0.35)',
                background: 'rgba(140,200,255,0.15)',
                color: 'rgba(255,255,255,0.92)',
                fontSize: '15px', fontWeight: '300', cursor: 'pointer', letterSpacing: '0.08em',
                backdropFilter: 'blur(12px)', boxShadow: '0 0 30px rgba(140,200,255,0.12)', transition: 'all 0.25s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(140,200,255,0.25)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(140,200,255,0.22)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(140,200,255,0.15)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(140,200,255,0.12)' }}
              >
                Begin
              </button>
            </div>
          )}

          {/* ── SESSION VIEW ── */}
          {view === 'session' && selected && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', padding: '24px 0' }}>
              {completed ? (
                <CompletionScreen
                  cycles={cycles}
                  onRestart={() => { reset(); setView('session') }}
                  onHome={() => setView('home')}
                />
              ) : (
                <>
                  {/* Top: technique name + session timer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '18px', width: '100%' }}>
                    <h2 style={{ color: 'rgba(255,255,255,0.50)', fontSize: '13px', fontWeight: '300', letterSpacing: '0.10em', margin: 0, textTransform: 'uppercase' }}>
                      {selected.name}
                    </h2>
                    {(running || cycles > 0) && (
                      <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
                        <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(140,200,255,0.55)" strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 18}`}
                            strokeDashoffset={`${2 * Math.PI * 18 * (1 - sessionProgress)}`}
                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '9px', fontWeight: '300' }}>
                          {formatSessionTime(sessionSecondsLeft)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Intention (before starting) */}
                  {!running && cycles === 0 && (
                    <div style={{ color: 'rgba(180,210,255,0.45)', fontSize: '13px', fontWeight: '300', fontFamily: "'Georgia', serif", fontStyle: 'italic', letterSpacing: '0.02em', marginBottom: '18px', animation: 'fadeSlideIn 0.6s ease forwards' }}>
                      {intention}
                    </div>
                  )}

                  {/* The orb — now receives phaseIndex for the ripple */}
                  <div style={{ position: 'relative', width: '260px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
                    <BreathingOrb
                      phase={currentPhase?.label || ''}
                      running={running}
                      secondsLeft={secondsLeft}
                      totalSeconds={selected?.phases[phaseIndex]?.duration || 1}
                      phaseIndex={phaseIndex}
                    />
                  </div>

                  {/* Phase sequence */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {selected.phases.map((phase, i) => {
                      const isActive = running && i === phaseIndex
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            padding: '5px 13px', borderRadius: '16px',
                            background: isActive ? 'rgba(140,200,255,0.22)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isActive ? 'rgba(140,200,255,0.45)' : 'rgba(255,255,255,0.10)'}`,
                            color: isActive ? 'rgba(200,230,255,0.95)' : 'rgba(255,255,255,0.25)',
                            fontSize: '11px', fontWeight: '300', letterSpacing: '0.04em',
                            transition: 'all 0.4s ease',
                            boxShadow: isActive ? '0 0 12px rgba(140,200,255,0.20)' : 'none'
                          }}>
                            {phase.label} · {phase.duration}s
                          </div>
                          {i < selected.phases.length - 1 && (
                            <div style={{ width: '6px', height: '1px', background: 'rgba(255,255,255,0.12)', borderRadius: '1px' }} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Cycle counter + affirmation */}
                  <div style={{ minHeight: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                    {cycles > 0 && (
                      <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', animation: 'fadeIn 0.5s ease forwards' }}>
                        Cycle {cycles}
                      </div>
                    )}
                    {running && (
                      <div key={affirmation} style={{ color: 'rgba(200,230,255,0.82)', fontSize: '16px', fontWeight: '300', fontFamily: "'Georgia', serif", fontStyle: 'italic', animation: 'fadeIn 0.8s ease forwards', letterSpacing: '0.02em', textShadow: '0 0 20px rgba(140,200,255,0.4)' }}>
                        {affirmation}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={reset} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '44px', height: '44px', color: 'rgba(255,255,255,0.40)', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ↺
                    </button>
                    <button onClick={toggleRun} style={{
                      background: running ? 'rgba(140,200,255,0.18)' : 'rgba(255,255,255,0.15)',
                      border: `1px solid ${running ? 'rgba(140,200,255,0.35)' : 'rgba(255,255,255,0.25)'}`,
                      borderRadius: '50%', width: '64px', height: '64px',
                      color: 'white', fontSize: '22px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(12px)',
                      boxShadow: running ? '0 0 20px rgba(140,200,255,0.20)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {running ? '⏸' : '▶'}
                    </button>
                    <div style={{ width: '44px' }} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BreatheScreen