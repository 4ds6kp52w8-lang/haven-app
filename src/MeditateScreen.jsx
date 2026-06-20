import { useState, useEffect, useRef } from 'react'
import Background from './Background'

const SESSIONS = [
  {
    id: 1,
    title: 'Arriving Here',
    duration: 5,
    category: 'Grounding',
    description: 'A gentle session to help you settle into the present moment.',
    emoji: '☁️',
    steps: [
      { text: "Find a comfortable position.", duration: 30 },
      { text: "You don't need to change anything about how you're sitting or lying down.", duration: 25 },
      { text: "Just arrive here.", duration: 20 },
      { text: "Exactly as you are.", duration: 20 },
      { text: "Close your eyes if that feels comfortable. If not, let your gaze soften toward the floor in front of you.", duration: 30 },
      { text: "Take a slow breath in through your nose... and let it go through your mouth.", duration: 35 },
      { text: "You don't have to breathe any particular way. Just notice that you're breathing.", duration: 30 },
      { text: "Notice the weight of your body. Where are you making contact with the surface beneath you? Let yourself be held by it.", duration: 40 },
      { text: "If thoughts come — and they will — that's okay. Just notice them, like clouds passing through the sky.", duration: 40 },
      { text: "You're here. That's enough. Rest in this quiet for a moment.", duration: 40 },
      { text: "When you're ready, take a slightly deeper breath. Wiggle your fingers and toes. Gently open your eyes.", duration: 30 }
    ]
  },
  {
    id: 2,
    title: 'Releasing Tension',
    duration: 10,
    category: 'Anxiety',
    description: 'A body scan to help release physical tension held from stress.',
    emoji: '🌊',
    steps: [
      { text: "Begin by taking three slow breaths.", duration: 25 },
      { text: "Let each exhale be a little longer than the inhale.", duration: 25 },
      { text: "With each breath out, feel yourself settling more deeply.", duration: 30 },
      { text: "Bring your attention to the top of your head. Notice any tension there. Just notice it, and breathe.", duration: 35 },
      { text: "Move your awareness down to your forehead, your eyes, your jaw. Soften if you can.", duration: 35 },
      { text: "Now your shoulders. Let them drop away from your ears. Feel the weight of your arms.", duration: 35 },
      { text: "Move to your chest. Place a hand there if you'd like. Feel your heart beating.", duration: 40 },
      { text: "Thank it for working so hard for you, without you ever having to ask.", duration: 30 },
      { text: "Notice your belly. With each breath in, let it expand. With each breath out, let everything go.", duration: 40 },
      { text: "Bring awareness to your legs, your feet. Feel the ground beneath you. You are supported.", duration: 35 },
      { text: "Rest here. Just breathing. Just being. Nothing to do, nowhere to be.", duration: 50 },
      { text: "Slowly begin to deepen your breath. You did something kind for yourself today.", duration: 35 }
    ]
  },
  {
    id: 3,
    title: 'When Everything Feels Heavy',
    duration: 10,
    category: 'Grief',
    description: 'A compassionate session for moments of sadness or grief.',
    emoji: '🌧️',
    steps: [
      { text: "You don't have to feel better right now.", duration: 25 },
      { text: "This session isn't about fixing anything.", duration: 20 },
      { text: "It's just about being with yourself, exactly as you are.", duration: 25 },
      { text: "Take a breath. Notice how your body feels. If there's heaviness, let it be there.", duration: 35 },
      { text: "Heaviness means something mattered to you. That's not weakness — it's love.", duration: 35 },
      { text: "Place one hand on your chest. This is a gesture of care toward yourself.", duration: 35 },
      { text: "You deserve the same compassion you would offer someone you love.", duration: 30 },
      { text: "If you feel the urge to cry, that's okay. Let them come if they need to.", duration: 35 },
      { text: "Whatever you're carrying — it's real. It's valid. And it will not always feel this way.", duration: 40 },
      { text: "Take a slow breath in. Hold it gently. And let it go.", duration: 30 },
      { text: "You are still here. That matters.", duration: 25 },
      { text: "Be gentle with yourself today.", duration: 30 }
    ]
  },
  {
    id: 4,
    title: 'Finding Calm',
    duration: 5,
    category: 'Stress',
    description: 'A quick reset for moments of overwhelm or high stress.',
    emoji: '✨',
    steps: [
      { text: "Stop. Just for a moment.", duration: 20 },
      { text: "Whatever is happening — you can set it down for the next few minutes.", duration: 25 },
      { text: "Take a breath in for four counts. One... two... three... four.", duration: 30 },
      { text: "Hold for four. One... two... three... four.", duration: 30 },
      { text: "Out for four. One... two... three... four.", duration: 30 },
      { text: "Again. In for four... hold... out for four. Let your nervous system begin to slow down.", duration: 45 },
      { text: "Look around the room. Name five things you can see.", duration: 35 },
      { text: "Notice three things you can feel — texture, temperature, the surface beneath you.", duration: 35 },
      { text: "You are here. The crisis in your mind is often larger than the reality in front of you.", duration: 35 },
      { text: "Take one more deep breath. You can return to what you were doing.", duration: 30 },
      { text: "But you don't have to carry the same weight you were carrying before.", duration: 30 }
    ]
  },
  {
    id: 5,
    title: 'Before Sleep',
    duration: 10,
    category: 'Sleep',
    description: 'A gentle wind-down to help you transition into rest.',
    emoji: '🌙',
    steps: [
      { text: "You've made it through another day.", duration: 20 },
      { text: "Whatever it held — the hard moments, the small victories, the things left undone —", duration: 30 },
      { text: "it's okay to set it all down now.", duration: 20 },
      { text: "Lie down if you haven't already. Let your body be heavy.", duration: 30 },
      { text: "Take a breath in... and a long, slow breath out.", duration: 30 },
      { text: "Let the exhale be twice as long as the inhale.", duration: 25 },
      { text: "Starting with your feet, consciously relax each part of your body.", duration: 30 },
      { text: "Your feet... your calves... your knees... your thighs...", duration: 35 },
      { text: "Your hips... your belly... your chest... your shoulders... your hands...", duration: 40 },
      { text: "Your neck... your jaw... your face... Let everything soften.", duration: 35 },
      { text: "If your mind is still busy, that's okay. Just let thoughts drift past without following them.", duration: 40 },
      { text: "You are safe. Let your breathing slow on its own.", duration: 35 },
      { text: "Good night. You did enough today. You are enough.", duration: 30 }
    ]
  },
  {
    id: 6,
    title: 'Morning Intention',
    duration: 5,
    category: 'Morning',
    description: 'Start your day with clarity, calm, and gentle purpose.',
    emoji: '🌅',
    steps: [
      { text: "Good morning.", duration: 15 },
      { text: "Before the day begins — before the notifications, the tasks, the noise —", duration: 25 },
      { text: "take a moment just for yourself.", duration: 20 },
      { text: "Take three slow breaths. In through the nose... out through the mouth.", duration: 35 },
      { text: "Think about one word you'd like to carry with you today.", duration: 30 },
      { text: "It might be calm, or patience, or courage, or kindness.", duration: 25 },
      { text: "Think of one small thing you're looking forward to today — however small.", duration: 35 },
      { text: "Set one gentle intention for the day. Not a goal to achieve — just a way of being.", duration: 40 },
      { text: "How do you want to show up for yourself today?", duration: 30 },
      { text: "Take a final breath. The day is beginning.", duration: 25 },
      { text: "You are ready.", duration: 20 }
    ]
  }
]

const CATEGORY_COLORS = {
  'Grounding': 'rgba(100, 180, 200, 0.25)',
  'Anxiety':   'rgba(140, 100, 220, 0.25)',
  'Grief':     'rgba(180, 120, 160, 0.25)',
  'Stress':    'rgba(100, 160, 180, 0.25)',
  'Sleep':     'rgba(100, 80,  180, 0.25)',
  'Morning':   'rgba(200, 160, 80,  0.25)'
}

const AMBIENT_SOUNDS = [
  { id: 'rain',      label: 'Rain',       emoji: '🌧' },
  { id: 'ocean',     label: 'Ocean',      emoji: '🌊' },
  { id: 'forest',    label: 'Forest',     emoji: '🌲' },
  { id: 'fireplace', label: 'Fireplace',  emoji: '🔥' },
  { id: 'white',     label: 'White Noise',emoji: '🤍' },
]

// ── Ambient audio engine ────────────────────────────────────────────────
let ambCtx = null
let ambMasterGain = null
let ambIsPlaying = false
let ambCurrentSource = null  // holds the active noise node so we can retrigger

function stopAmbient() {
  if (!ambMasterGain || !ambCtx) return
  ambIsPlaying = false
  const now = ambCtx.currentTime
  ambMasterGain.gain.cancelScheduledValues(now)
  ambMasterGain.gain.setValueAtTime(ambMasterGain.gain.value, now)
  ambMasterGain.gain.linearRampToValueAtTime(0, now + 1.5)
}

function playAmbient(soundId) {
  // Create context on first use (browsers require user gesture)
  if (!ambCtx) {
    ambCtx = new (window.AudioContext || window.webkitAudioContext)()
    ambMasterGain = ambCtx.createGain()
    ambMasterGain.gain.value = 0
    ambMasterGain.connect(ambCtx.destination)
  }
  if (ambCtx.state === 'suspended') ambCtx.resume()

  // Disconnect any previous source
  if (ambCurrentSource) {
    try { ambCurrentSource.disconnect() } catch(e) {}
    ambCurrentSource = null
  }

  // Fade master down then swap sound and fade back up
  const now = ambCtx.currentTime
  ambMasterGain.gain.cancelScheduledValues(now)
  ambMasterGain.gain.setValueAtTime(ambMasterGain.gain.value, now)
  ambMasterGain.gain.linearRampToValueAtTime(0, now + 0.6)

  setTimeout(() => {
    if (!ambCtx) return
    buildAmbientLayer(soundId)
    const t = ambCtx.currentTime
    ambMasterGain.gain.cancelScheduledValues(t)
    ambMasterGain.gain.setValueAtTime(0, t)
    ambMasterGain.gain.linearRampToValueAtTime(0.35, t + 2.5)
    ambIsPlaying = true
  }, 650)
}

function buildAmbientLayer(soundId) {
  const sr = ambCtx.sampleRate

  // Shared reverb
  const conv = ambCtx.createConvolver()
  const rt = sr * 4
  const rb = ambCtx.createBuffer(2, rt, sr)
  for (let ch = 0; ch < 2; ch++) {
    const d = rb.getChannelData(ch)
    for (let i = 0; i < rt; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rt, 1.5)
  }
  conv.buffer = rb
  const wet = ambCtx.createGain(); wet.gain.value = 0.55
  const dry = ambCtx.createGain(); dry.gain.value = 0.45
  ambMasterGain.connect(conv); conv.connect(wet); wet.connect(ambCtx.destination)
  ambMasterGain.connect(dry); dry.connect(ambCtx.destination)

  function makeNoise(bufSecs) {
    const buf = ambCtx.createBuffer(2, sr * bufSecs, sr)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    }
    const src = ambCtx.createBufferSource()
    src.buffer = buf; src.loop = true
    return src
  }

  function bpf(freq, Q) {
    const f = ambCtx.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = Q
    return f
  }
  function lpf(freq) {
    const f = ambCtx.createBiquadFilter()
    f.type = 'lowpass'; f.frequency.value = freq
    return f
  }

  let src

  if (soundId === 'rain') {
    src = makeNoise(4)
    const lo = lpf(2000)
    const hi = bpf(4000, 0.4)
    const g = ambCtx.createGain(); g.gain.value = 0.5
    // periodic swell for heavy rain drops
    src.connect(lo); lo.connect(g)
    src.connect(hi); hi.connect(g)
    g.connect(ambMasterGain)
    src.start()
    // subtle LFO for rain intensity variation
    const lfo = ambCtx.createOscillator(); lfo.frequency.value = 0.08
    const lfoG = ambCtx.createGain(); lfoG.gain.value = 0.08
    lfo.connect(lfoG); lfoG.connect(g.gain)
    lfo.start()
  } else if (soundId === 'ocean') {
    src = makeNoise(8)
    const f1 = lpf(600)
    const f2 = bpf(200, 1.2)
    const g = ambCtx.createGain(); g.gain.value = 0.6
    src.connect(f1); f1.connect(g)
    src.connect(f2); f2.connect(g)
    g.connect(ambMasterGain)
    src.start()
    // slow wave LFO ~0.1 Hz
    const lfo = ambCtx.createOscillator(); lfo.frequency.value = 0.1
    const lfoG = ambCtx.createGain(); lfoG.gain.value = 0.25
    lfo.connect(lfoG); lfoG.connect(g.gain)
    lfo.start()
  } else if (soundId === 'forest') {
    // Layered: wind low + high chirp texture
    src = makeNoise(4)
    const wind = lpf(400)
    const windG = ambCtx.createGain(); windG.gain.value = 0.3
    src.connect(wind); wind.connect(windG); windG.connect(ambMasterGain)
    const src2 = makeNoise(4)
    const chirp = bpf(3500, 8)
    const chirpG = ambCtx.createGain(); chirpG.gain.value = 0.04
    src2.connect(chirp); chirp.connect(chirpG); chirpG.connect(ambMasterGain)
    src.start(); src2.start()
    // gentle wind swell
    const lfo = ambCtx.createOscillator(); lfo.frequency.value = 0.05
    const lfoG = ambCtx.createGain(); lfoG.gain.value = 0.12
    lfo.connect(lfoG); lfoG.connect(windG.gain)
    lfo.start()
  } else if (soundId === 'fireplace') {
    src = makeNoise(4)
    const crackle = bpf(1200, 0.6)
    const rumble = lpf(180)
    const g1 = ambCtx.createGain(); g1.gain.value = 0.15
    const g2 = ambCtx.createGain(); g2.gain.value = 0.55
    src.connect(crackle); crackle.connect(g1); g1.connect(ambMasterGain)
    src.connect(rumble);  rumble.connect(g2);  g2.connect(ambMasterGain)
    src.start()
    // flicker LFO
    const lfo = ambCtx.createOscillator(); lfo.frequency.value = 0.3
    const lfoG = ambCtx.createGain(); lfoG.gain.value = 0.08
    lfo.connect(lfoG); lfoG.connect(g2.gain)
    lfo.start()
  } else {
    // white noise — flat spectrum
    src = makeNoise(4)
    const f = lpf(8000)
    const g = ambCtx.createGain(); g.gain.value = 0.4
    src.connect(f); f.connect(g); g.connect(ambMasterGain)
    src.start()
  }

  ambCurrentSource = src
}

// ── Progressive text reveal ─────────────────────────────────────────────
function ProgressiveText({ steps, stepIndex, playing }) {
  const [visibleLines, setVisibleLines] = useState([0])
  const [revealIndex, setRevealIndex] = useState(0)
  const revealRef = useRef(null)

  // Reset when step changes
  useEffect(() => {
    setVisibleLines([0])
    setRevealIndex(0)
  }, [stepIndex])

  // Split current step text into sentences/phrases and reveal one at a time
  const currentText = steps[stepIndex]?.text || ''
  const sentences = currentText.match(/[^.!?…]+[.!?…]?/g)?.map(s => s.trim()).filter(Boolean) || [currentText]

  useEffect(() => {
    if (!playing || revealIndex >= sentences.length - 1) return
    const delay = Math.max(3000, (steps[stepIndex]?.duration * 1000) / sentences.length)
    revealRef.current = setTimeout(() => {
      setRevealIndex(i => i + 1)
      setVisibleLines(prev => [...prev, prev.length])
    }, delay)
    return () => clearTimeout(revealRef.current)
  }, [playing, revealIndex, stepIndex])

  return (
    <div style={{ textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      {sentences.map((sentence, i) => (
        <p
          key={`${stepIndex}-${i}`}
          style={{
            color: i === revealIndex ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)',
            fontSize: i === revealIndex ? '19px' : '15px',
            fontWeight: '300',
            fontFamily: "'Georgia', serif",
            lineHeight: '1.75',
            margin: 0,
            opacity: i <= revealIndex ? 1 : 0,
            transform: i <= revealIndex ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.8s ease',
            letterSpacing: '0.01em',
            maxWidth: '420px'
          }}
        >
          {sentence}
        </p>
      ))}
    </div>
  )
}

// ── Pulsing glow behind card ────────────────────────────────────────────
function SessionGlow({ category }) {
  const colors = {
    'Grounding': 'rgba(100,180,200,0.12)',
    'Anxiety':   'rgba(140,100,220,0.12)',
    'Grief':     'rgba(180,120,160,0.12)',
    'Stress':    'rgba(100,160,180,0.12)',
    'Sleep':     'rgba(100,80,180,0.12)',
    'Morning':   'rgba(200,160,80,0.12)',
  }
  const color = colors[category] || 'rgba(100,140,220,0.12)'

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.7; }
          50%       { transform: scale(1.08); opacity: 1;   }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        width: '500px', height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
        filter: 'blur(50px)',
        animation: 'glow-pulse 8s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0
      }} />
    </>
  )
}

// ── Reflection screen ───────────────────────────────────────────────────
function ReflectionScreen({ sessionTitle, onDone }) {
  const [feeling, setFeeling] = useState(null)
  const [word, setWord] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!feeling) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', animation: 'fadeSlideIn 0.7s ease forwards' }}>
        <div style={{ fontSize: '36px', opacity: 0.8 }}>◎</div>
        <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif" }}>
          Thank you.
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '300', lineHeight: 1.7, maxWidth: '280px' }}>
          {feeling === '😊 Much Better' || feeling === '🙂 Better'
            ? "That's what matters. Carry this feeling with you."
            : feeling === '😕 Same'
            ? "That's okay. Showing up is what counts."
            : "Be gentle with yourself. You did something kind today."}
        </div>
        <button onClick={onDone} style={{ marginTop: '12px', padding: '12px 32px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.10)', color: 'white', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(12px)', letterSpacing: '0.03em' }}>
          Done
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', maxWidth: '380px', animation: 'fadeSlideIn 0.7s ease forwards' }}>
      <div style={{ fontSize: '36px', opacity: 0.7 }}>◎</div>
      <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: 1.4 }}>
        Well done.
      </div>
      <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '13px', fontWeight: '300' }}>
        You took a moment for yourself today.
      </div>

      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

      <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: '15px', fontWeight: '300', fontFamily: "'Georgia', serif" }}>
        How do you feel now?
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['😔 Worse', '😕 Same', '🙂 Better', '😊 Much Better'].map(opt => (
          <button
            key={opt}
            onClick={() => setFeeling(opt)}
            style={{
              padding: '10px 16px', borderRadius: '20px',
              border: `1px solid ${feeling === opt ? 'rgba(140,200,255,0.50)' : 'rgba(255,255,255,0.15)'}`,
              background: feeling === opt ? 'rgba(140,200,255,0.18)' : 'rgba(255,255,255,0.06)',
              color: feeling === opt ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
              fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: feeling === opt ? '0 0 16px rgba(140,200,255,0.15)' : 'none'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
        <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px', fontWeight: '300', letterSpacing: '0.04em' }}>
          One word (optional)
        </div>
        <input
          type="text"
          placeholder="calmer, lighter, present..."
          value={word}
          onChange={e => setWord(e.target.value)}
          maxLength={20}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '10px 18px',
            color: 'rgba(255,255,255,0.80)',
            fontSize: '14px',
            fontFamily: "'Georgia', serif",
            fontStyle: 'italic',
            outline: 'none',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            letterSpacing: '0.02em'
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!feeling}
        style={{
          padding: '12px 40px', borderRadius: '28px',
          border: '1px solid rgba(140,200,255,0.35)',
          background: feeling ? 'rgba(140,200,255,0.15)' : 'rgba(255,255,255,0.05)',
          color: feeling ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.30)',
          fontSize: '14px', cursor: feeling ? 'pointer' : 'default',
          backdropFilter: 'blur(12px)', transition: 'all 0.2s ease',
          letterSpacing: '0.04em'
        }}
      >
        Done
      </button>
    </div>
  )
}

// ── Main screen ─────────────────────────────────────────────────────────
function MeditateScreen({ onBack }) {
  const [view, setView] = useState('home')
  const [selectedSession, setSelectedSession] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [finished, setFinished] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ambientSound, setAmbientSound] = useState('rain')
  const [ambientOn, setAmbientOn] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    if (playing && secondsLeft > 0) {
      timerRef.current = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    } else if (playing && secondsLeft === 0) {
      const next = stepIndex + 1
      if (next < selectedSession.steps.length) {
        setStepIndex(next)
        setSecondsLeft(selectedSession.steps[next].duration)
      } else {
        setPlaying(false)
        stopAmbient()
        setAmbientOn(false)
        setFinished(true)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [playing, secondsLeft])

  // Auto-start ambient when session begins playing
  useEffect(() => {
    if (playing && !ambientOn) {
      playAmbient(ambientSound)
      setAmbientOn(true)
    }
  }, [playing])

  function startSession(session) {
    setSelectedSession(session)
    setStepIndex(0)
    setSecondsLeft(session.steps[0].duration)
    setFinished(false)
    setPlaying(false)
    setAmbientOn(false)
    setView('session')
  }

  function togglePlay() {
    if (!playing && !ambientOn) {
      playAmbient(ambientSound)
      setAmbientOn(true)
    } else if (playing) {
      stopAmbient()
      setAmbientOn(false)
    }
    setPlaying(p => !p)
  }

  function handleAmbientChange(soundId) {
    setAmbientSound(soundId)
    if (ambientOn) playAmbient(soundId)
  }

  function reset() {
    setPlaying(false)
    stopAmbient()
    setAmbientOn(false)
    setStepIndex(0)
    setSecondsLeft(selectedSession.steps[0].duration)
    setFinished(false)
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const totalSteps = selectedSession?.steps.length || 1
  const progress = (stepIndex / totalSteps) * 100
  const stepProgress = selectedSession
    ? ((stepIndex + (1 - secondsLeft / selectedSession.steps[stepIndex]?.duration)) / totalSteps) * 100
    : 0

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>
      <Background />

      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,15,40,0.35) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', zIndex: 2,
        opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease'
      }}>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          div::-webkit-scrollbar { display: none; }
          input::placeholder { color: rgba(255,255,255,0.25); }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '22px 36px', borderBottom: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
        }}>
          <button
            onClick={view === 'home' ? onBack : () => { setPlaying(false); stopAmbient(); setAmbientOn(false); setView('home') }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.04em', padding: 0 }}
          >
            ← {view === 'home' ? 'Home' : 'Sessions'}
          </button>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: '400' }}>
            Meditate
          </span>
          <div style={{ width: '60px' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', padding: '36px', boxSizing: 'border-box' }}>

          {/* ── HOME VIEW ── */}
          {view === 'home' && (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <h2 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 8px 0' }}>
                Guided Sessions
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '14px', fontWeight: '300', margin: '0 0 36px 0', lineHeight: '1.6' }}>
                Choose a session based on how you're feeling right now.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SESSIONS.map((session, i) => (
                  <div
                    key={session.id}
                    onClick={() => startSession(session)}
                    style={{ padding: '22px 26px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.13)', cursor: 'pointer', transition: 'all 0.2s ease', animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: `${i * 0.07}s`, opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: '28px', flexShrink: 0, opacity: 0.8 }}>{session.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', background: CATEGORY_COLORS[session.category], color: 'rgba(255,255,255,0.75)', fontSize: '10px', letterSpacing: '0.06em', fontWeight: '500' }}>
                          {session.category}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px' }}>{session.duration} min</span>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', fontWeight: '400', marginBottom: '4px' }}>
                        {session.title}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px', fontWeight: '300', lineHeight: '1.5' }}>
                        {session.description}
                      </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '18px', flexShrink: 0 }}>›</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SESSION VIEW ── */}
          {view === 'session' && selectedSession && (
            <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px' }}>

              {finished ? (
                <ReflectionScreen
                  sessionTitle={selectedSession.title}
                  onDone={() => setView('home')}
                />
              ) : (
                <>
                  {/* Session emoji + title */}
                  <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.75 }}>
                    {selectedSession.emoji}
                  </div>
                  <h2 style={{ color: 'rgba(255,255,255,0.80)', fontSize: '18px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 4px 0', textAlign: 'center' }}>
                    {selectedSession.title}
                  </h2>
                  <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px', letterSpacing: '0.08em', marginBottom: '20px' }}>
                    {selectedSession.duration} min · {selectedSession.category}
                  </span>

                  {/* Ambient sound selector */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {AMBIENT_SOUNDS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleAmbientChange(s.id)}
                        style={{
                          padding: '6px 14px', borderRadius: '20px',
                          border: `1px solid ${ambientSound === s.id ? 'rgba(140,200,255,0.45)' : 'rgba(255,255,255,0.12)'}`,
                          background: ambientSound === s.id ? 'rgba(140,200,255,0.15)' : 'rgba(255,255,255,0.05)',
                          color: ambientSound === s.id ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.40)',
                          fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', gap: '5px',
                          boxShadow: ambientSound === s.id ? '0 0 12px rgba(140,200,255,0.12)' : 'none'
                        }}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Full-width progress bar */}
                  <div style={{ width: '100%', marginBottom: '28px' }}>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ height: '100%', width: `${stepProgress}%`, background: 'linear-gradient(90deg, rgba(140,200,255,0.6), rgba(180,220,255,0.8))', borderRadius: '3px', transition: 'width 1s linear' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.06em' }}>
                        Step {stepIndex + 1} of {selectedSession.steps.length}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.06em' }}>
                        {formatTime(secondsLeft)} remaining
                      </span>
                    </div>
                  </div>

                  {/* Card with pulsing glow + progressive text */}
                  <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                    <SessionGlow category={selectedSession.category} />
                    <div style={{
                      position: 'relative', zIndex: 1,
                      padding: '40px 44px',
                      borderRadius: '28px',
                      background: 'rgba(255,255,255,0.09)',
                      backdropFilter: 'blur(30px)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      width: '100%', boxSizing: 'border-box',
                      boxShadow: '0 20px 80px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.15)'
                    }}>
                      <ProgressiveText
                        steps={selectedSession.steps}
                        stepIndex={stepIndex}
                        playing={playing}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
                    <button onClick={reset} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '44px', height: '44px', color: 'rgba(255,255,255,0.45)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ↺
                    </button>
                    <button
                      onClick={togglePlay}
                      style={{
                        background: playing ? 'rgba(140,200,255,0.18)' : 'rgba(255,255,255,0.15)',
                        border: `1px solid ${playing ? 'rgba(140,200,255,0.35)' : 'rgba(255,255,255,0.25)'}`,
                        borderRadius: '50%', width: '64px', height: '64px',
                        color: 'white', fontSize: '22px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(12px)',
                        boxShadow: playing ? '0 0 20px rgba(140,200,255,0.20)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {playing ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={() => {
                        const next = stepIndex + 1
                        if (next < selectedSession.steps.length) {
                          setStepIndex(next)
                          setSecondsLeft(selectedSession.steps[next].duration)
                        } else {
                          setPlaying(false)
                          stopAmbient()
                          setAmbientOn(false)
                          setFinished(true)
                        }
                      }}
                      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '44px', height: '44px', color: 'rgba(255,255,255,0.45)', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ›
                    </button>
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

export default MeditateScreen