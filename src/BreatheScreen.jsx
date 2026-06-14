import { useState, useEffect, useRef } from 'react'
import Background from './Background'

const TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
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
  const timerRef = useRef(null)
  const sessionTimerRef = useRef(null)
  const orbScale = useRef(1)
  const orbRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    if (running && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft(s => s - 1)
      }, 1000)
    } else if (running && secondsLeft === 0) {
      const next = (phaseIndex + 1) % selected.phases.length
      if (next === 0) setCycles(c => c + 1)
      setPhaseIndex(next)
      setSecondsLeft(selected.phases[next].duration)
    }
    return () => clearTimeout(timerRef.current)
  }, [running, secondsLeft])

  useEffect(() => {
    if (!orbRef.current || !selected) return
    const phase = selected?.phases[phaseIndex]
    const isInhale = phase?.label.toLowerCase().includes('inhale')
    const isExhale = phase?.label.toLowerCase().includes('exhale')
    const targetScale = isInhale ? 1.35 : isExhale ? 0.75 : orbScale.current
    const duration = (phase?.duration || 4) * 1000
    orbRef.current.style.transition = `transform ${duration}ms ease-in-out`
    orbRef.current.style.transform = `scale(${targetScale})`
    orbScale.current = targetScale
  }, [phaseIndex, running])

  useEffect(() => {
    if (running && sessionSecondsLeft > 0) {
      sessionTimerRef.current = setTimeout(() => {
        setSessionSecondsLeft(s => s - 1)
      }, 1000)
    } else if (running && sessionSecondsLeft === 0) {
      setRunning(false)
    }
    return () => clearTimeout(sessionTimerRef.current)
  }, [running, sessionSecondsLeft])

  useEffect(() => {
    setSessionSecondsLeft(targetMinutes * 60)
  }, [targetMinutes])

  function startSession(technique) {
    setSelected(technique)
    setPhaseIndex(0)
    setSecondsLeft(technique.phases[0].duration)
    setCycles(0)
    setRunning(false)
    setSessionSecondsLeft(targetMinutes * 60)
    setView('session')
  }

  function toggleRun() {
    setRunning(r => !r)
  }

  function reset() {
    setRunning(false)
    setPhaseIndex(0)
    setSecondsLeft(selected.phases[0].duration)
    setCycles(0)
    setSessionSecondsLeft(targetMinutes * 60)
    clearInterval(sessionTimerRef.current)
    if (orbRef.current) {
      orbRef.current.style.transition = 'transform 0.5s ease'
      orbRef.current.style.transform = 'scale(1)'
    }
  }

  function formatSessionTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const sessionProgress = 1 - (sessionSecondsLeft / (targetMinutes * 60))
  const currentPhase = selected?.phases[phaseIndex]

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <Background />

      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,15,40,0.35) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease'
      }}>

        {/* Header */}
        <div style={{
          padding: '22px 36px',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(30px)',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <button
            onClick={view === 'home' ? onBack : () => {
              setRunning(false)
              setView('home')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '13px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              padding: 0
            }}
          >
            ← {view === 'home' ? 'Home' : 'Techniques'}
          </button>

          <span style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '12px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: '400'
          }}>
            Breathe
          </span>

          <div style={{ width: '80px' }} />
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          padding: '36px',
          boxSizing: 'border-box',
          display: view === 'session' ? 'flex' : 'block',
          alignItems: view === 'session' ? 'center' : 'unset',
          justifyContent: view === 'session' ? 'center' : 'unset'
        }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {/* HOME VIEW */}
          {view === 'home' && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto'
            }}>
              <h2 style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '22px',
                fontWeight: '300',
                fontFamily: "'Georgia', serif",
                margin: '0 0 8px 0'
              }}>
                Breathing Techniques
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.40)',
                fontSize: '14px',
                fontWeight: '300',
                margin: '0 0 36px 0',
                lineHeight: '1.6'
              }}>
                Choose a technique based on how you're feeling right now.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {TECHNIQUES.map((technique, i) => (
                  <div
                    key={technique.id}
                    onClick={() => startSession(technique)}
                    style={{
                      padding: '22px 26px',
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.13)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      animation: 'fadeSlideIn 0.5s ease forwards',
                      animationDelay: `${i * 0.07}s`,
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <style>{`
                      @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(8px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '6px'
                      }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: CATEGORY_COLORS[technique.category],
                          color: 'rgba(255,255,255,0.75)',
                          fontSize: '10px',
                          letterSpacing: '0.06em',
                          fontWeight: '500'
                        }}>
                          {technique.category}
                        </span>
                        <span style={{
                          color: 'rgba(255,255,255,0.30)',
                          fontSize: '11px'
                        }}>
                          {technique.phases.map(p => p.duration).join('-')}
                        </span>
                      </div>

                      <div style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: '15px',
                        fontWeight: '400',
                        marginBottom: '4px'
                      }}>
                        {technique.name}
                      </div>

                      <div style={{
                        color: 'rgba(255,255,255,0.40)',
                        fontSize: '12px',
                        fontWeight: '300',
                        lineHeight: '1.5'
                      }}>
                        {technique.description}
                      </div>
                    </div>

                    <div style={{
                      color: 'rgba(255,255,255,0.25)',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      ›
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SESSION VIEW */}
          {view === 'session' && selected && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%'
            }}>

              <h2 style={{
                color: 'rgba(255,255,255,0.70)',
                fontSize: '16px',
                fontWeight: '300',
                letterSpacing: '0.06em',
                margin: '0 0 24px 0'
              }}>
                {selected.name}
              </h2>

              {/* Duration selector */}
              {!running && cycles === 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '36px'
                }}>
                  <span style={{
                    color: 'rgba(255,255,255,0.40)',
                    fontSize: '12px',
                    letterSpacing: '0.04em'
                  }}>
                    Duration
                  </span>
                  {[1, 3, 5, 10].map(min => (
                    <button
                      key={min}
                      onClick={() => setTargetMinutes(min)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.20)',
                        background: targetMinutes === min
                          ? 'rgba(255,255,255,0.20)'
                          : 'transparent',
                        color: targetMinutes === min
                          ? 'rgba(255,255,255,0.90)'
                          : 'rgba(255,255,255,0.40)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              )}

              {/* Session timer */}
              {(running || cycles > 0) && (
                <div style={{
                  marginBottom: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="30" cy="30" r="26"
                        fill="none"
                        stroke="rgba(255,255,255,0.10)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="30" cy="30" r="26"
                        fill="none"
                        stroke="rgba(255,255,255,0.60)"
                        strokeWidth="2"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - sessionProgress)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.70)',
                      fontSize: '11px',
                      fontWeight: '300'
                    }}>
                      {formatSessionTime(sessionSecondsLeft)}
                    </div>
                  </div>
                  <span style={{
                    color: 'rgba(255,255,255,0.30)',
                    fontSize: '11px',
                    letterSpacing: '0.06em'
                  }}>
                    remaining
                  </span>
                </div>
              )}

              {/* Breathing orb */}
              <div style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(100,160,255,0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)'
                }} />

                <div
                  ref={orbRef}
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 40% 40%, rgba(180,200,255,0.35), rgba(100,130,255,0.20))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'transform 4s ease-in-out'
                  }}
                >
                  <span style={{
                    color: 'rgba(255,255,255,0.90)',
                    fontSize: '15px',
                    fontWeight: '300',
                    letterSpacing: '0.04em',
                    fontFamily: "'Georgia', serif"
                  }}>
                    {running ? currentPhase?.label : 'Ready'}
                  </span>

                  {running && (
                    <span style={{
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: '24px',
                      fontWeight: '200'
                    }}>
                      {secondsLeft}
                    </span>
                  )}
                </div>
              </div>

              {/* Phase indicators */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '40px'
              }}>
                {selected.phases.map((phase, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '3px',
                      borderRadius: '2px',
                      background: running && i === phaseIndex
                        ? 'rgba(255,255,255,0.80)'
                        : 'rgba(255,255,255,0.18)',
                      transition: 'background 0.3s ease'
                    }} />
                    <span style={{
                      color: running && i === phaseIndex
                        ? 'rgba(255,255,255,0.70)'
                        : 'rgba(255,255,255,0.25)',
                      fontSize: '9px',
                      letterSpacing: '0.06em',
                      transition: 'color 0.3s ease'
                    }}>
                      {phase.duration}s
                    </span>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <button
                  onClick={reset}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ↺
                </button>

                <button
                  onClick={toggleRun}
                  disabled={sessionSecondsLeft === 0 && cycles > 0}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    color: 'white',
                    fontSize: '22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {running ? '⏸' : '▶'}
                </button>

                <div style={{ width: '44px' }} />
              </div>

              {/* Session complete */}
              {sessionSecondsLeft === 0 && cycles > 0 && (
                <div style={{
                  animation: 'fadeSlideIn 0.6s ease forwards',
                  textAlign: 'center'
                }}>
                  <style>{`
                    @keyframes fadeSlideIn {
                      from { opacity: 0; transform: translateY(8px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  <p style={{
                    color: 'rgba(255,255,255,0.60)',
                    fontSize: '14px',
                    fontWeight: '300',
                    fontFamily: "'Georgia', serif",
                    margin: '0 0 16px 0'
                  }}>
                    Well done. {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed.
                  </p>
                  <button
                    onClick={() => setView('home')}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '24px',
                      border: '1px solid rgba(255,255,255,0.20)',
                      background: 'rgba(255,255,255,0.10)',
                      color: 'white',
                      fontSize: '13px',
                      cursor: 'pointer',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    Back to techniques
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BreatheScreen