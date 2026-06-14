import { useState, useEffect, useRef } from 'react'
import Background from './Background'

const SESSIONS = [
  {
    id: 1,
    title: 'Arriving Here',
    duration: 5,
    category: 'Grounding',
    description: 'A gentle session to help you settle into the present moment.',
    steps: [
      { text: "Find a comfortable position. You don't need to change anything about how you're sitting or lying down. Just arrive here, as you are.", duration: 30 },
      { text: "Close your eyes if that feels comfortable. If not, let your gaze soften toward the floor in front of you.", duration: 25 },
      { text: "Take a slow breath in through your nose... and let it go through your mouth. Again. In... and out. You don't have to breathe any particular way. Just notice that you're breathing.", duration: 40 },
      { text: "Notice the weight of your body. Where are you making contact with the surface beneath you? Let yourself be held by it.", duration: 35 },
      { text: "If thoughts come — and they will — that's okay. You don't need to push them away. Just notice them, like clouds passing through the sky, and gently return to this moment.", duration: 45 },
      { text: "You're here. That's enough. Rest in this quiet for a moment.", duration: 40 },
      { text: "When you're ready, take a slightly deeper breath. Wiggle your fingers and toes. Gently open your eyes. Carry this stillness with you.", duration: 30 }
    ]
  },
  {
    id: 2,
    title: 'Releasing Tension',
    duration: 10,
    category: 'Anxiety',
    description: 'A body scan to help release physical tension held from stress.',
    steps: [
      { text: "Begin by taking three slow breaths. Let each exhale be a little longer than the inhale. With each breath out, feel yourself settling more deeply.", duration: 40 },
      { text: "Bring your attention to the top of your head. Notice any tension there. You don't need to fix it — just notice it, and breathe.", duration: 35 },
      { text: "Move your awareness down to your forehead, your eyes, your jaw. Many of us hold tension in our face without realizing it. Soften if you can.", duration: 40 },
      { text: "Now your shoulders. Let them drop away from your ears. Feel the weight of your arms. Let your hands rest open and soft.", duration: 35 },
      { text: "Move to your chest. Place a hand there if you'd like. Feel your heart beating. Thank it for working so hard for you, without you ever having to ask.", duration: 45 },
      { text: "Notice your belly. With each breath in, let it expand. With each breath out, let everything go. There's nothing you need to hold onto right now.", duration: 40 },
      { text: "Bring awareness to your legs, your feet. Feel the ground beneath you. You are supported.", duration: 35 },
      { text: "Now take a breath and feel your whole body at once. It carries so much. It has brought you through every difficult moment so far.", duration: 40 },
      { text: "Rest here. Just breathing. Just being. Nothing to do, nowhere to be.", duration: 50 },
      { text: "Slowly begin to deepen your breath. Return to the room around you. Open your eyes when you're ready. You did something kind for yourself today.", duration: 35 }
    ]
  },
  {
    id: 3,
    title: 'When Everything Feels Heavy',
    duration: 10,
    category: 'Grief',
    description: 'A compassionate session for moments of sadness or grief.',
    steps: [
      { text: "You don't have to feel better right now. This session isn't about fixing anything. It's just about being with yourself, exactly as you are.", duration: 40 },
      { text: "Take a breath. Notice how your body feels. If there's heaviness, let it be there. Heaviness means something mattered to you. That's not weakness — it's love.", duration: 45 },
      { text: "Place one hand on your chest. This is a gesture of care toward yourself. You deserve the same compassion you would offer someone you love.", duration: 40 },
      { text: "If you feel the urge to cry, that's okay. Tears are the body's way of processing what the mind can't hold alone. Let them come if they need to.", duration: 45 },
      { text: "Think of one person who loves you — or has loved you. Let yourself feel that connection, even across distance or time. You are not as alone as it might feel right now.", duration: 50 },
      { text: "Whatever you're carrying — loss, disappointment, longing, exhaustion — it's real. It's valid. And it will not always feel this way.", duration: 40 },
      { text: "Take a slow breath in. Hold it gently. And let it go. You are still here. That matters.", duration: 35 },
      { text: "Rest in this quiet for as long as you need. When you're ready, open your eyes. Be gentle with yourself today.", duration: 50 }
    ]
  },
  {
    id: 4,
    title: 'Finding Calm',
    duration: 5,
    category: 'Stress',
    description: 'A quick reset for moments of overwhelm or high stress.',
    steps: [
      { text: "Stop. Just for a moment. Whatever is happening — you can set it down for the next few minutes.", duration: 30 },
      { text: "Take a breath in for four counts. One... two... three... four. Hold for four. One... two... three... four. Out for four. One... two... three... four.", duration: 45 },
      { text: "Again. In for four... hold... out for four. Let your nervous system begin to slow down. This is physiologically real — your body is responding.", duration: 45 },
      { text: "Look around the room. Name five things you can see. This brings you back into your body and out of the spiral of thoughts.", duration: 40 },
      { text: "Notice three things you can feel — the texture of your clothing, the temperature of the air, the surface beneath you.", duration: 35 },
      { text: "You are here. The crisis in your mind is often larger than the reality in front of you. What is actually true right now, in this moment?", duration: 40 },
      { text: "Take one more deep breath. You can return to what you were doing. But you don't have to carry the same weight you were carrying before.", duration: 35 }
    ]
  },
  {
    id: 5,
    title: 'Before Sleep',
    duration: 10,
    category: 'Sleep',
    description: 'A gentle wind-down to help you transition into rest.',
    steps: [
      { text: "You've made it through another day. Whatever it held — the hard moments, the small victories, the things left undone — it's okay to set it all down now.", duration: 40 },
      { text: "Lie down if you haven't already. Let your body be heavy. You don't need to hold anything up right now.", duration: 35 },
      { text: "Take a breath in... and a long, slow breath out. Let the exhale be twice as long as the inhale. This activates your body's rest response.", duration: 45 },
      { text: "Starting with your feet, consciously relax each part of your body. Your feet... your calves... your knees... your thighs...", duration: 40 },
      { text: "Your hips... your belly... your chest... your shoulders... your arms... your hands...", duration: 40 },
      { text: "Your neck... your jaw... your face... the space between your eyebrows. Let everything soften.", duration: 35 },
      { text: "If your mind is still busy, that's okay. You don't need to stop thinking. Just let thoughts drift past without following them.", duration: 40 },
      { text: "Imagine a calm, safe place. It can be real or imagined. Feel the air there, the light, the quiet. You are safe.", duration: 45 },
      { text: "Let your breathing slow on its own. Let your eyes stay closed. There's nowhere to be and nothing to do. Just rest.", duration: 50 },
      { text: "Good night. You did enough today. You are enough.", duration: 30 }
    ]
  },
  {
    id: 6,
    title: 'Morning Intention',
    duration: 5,
    category: 'Morning',
    description: 'Start your day with clarity, calm, and gentle purpose.',
    steps: [
      { text: "Good morning. Before the day begins — before the notifications, the tasks, the noise — take a moment just for yourself.", duration: 35 },
      { text: "Take three slow breaths. In through the nose... out through the mouth. Let each breath wake you up gently rather than jolt you into the day.", duration: 40 },
      { text: "Think about one word you'd like to carry with you today. It might be calm, or patience, or courage, or kindness. Whatever feels right.", duration: 40 },
      { text: "Think of one small thing you're looking forward to today — however small. A cup of tea. A conversation. A moment outside.", duration: 35 },
      { text: "Set one gentle intention for the day. Not a goal to achieve — just a way of being. How do you want to show up for yourself today?", duration: 40 },
      { text: "Take a final breath. Carry your word and your intention with you. The day is beginning. You are ready.", duration: 35 }
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

function MeditateScreen({ onBack }) {
  const [view, setView] = useState('home')
  const [selectedSession, setSelectedSession] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [finished, setFinished] = useState(false)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    if (playing && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft(s => s - 1)
      }, 1000)
    } else if (playing && secondsLeft === 0) {
      const next = stepIndex + 1
      if (next < selectedSession.steps.length) {
        setStepIndex(next)
        setSecondsLeft(selectedSession.steps[next].duration)
      } else {
        setPlaying(false)
        setFinished(true)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [playing, secondsLeft])

  function startSession(session) {
    setSelectedSession(session)
    setStepIndex(0)
    setSecondsLeft(session.steps[0].duration)
    setFinished(false)
    setPlaying(false)
    setView('session')
  }

  function togglePlay() {
    setPlaying(p => !p)
  }

  function reset() {
    setPlaying(false)
    setStepIndex(0)
    setSecondsLeft(selectedSession.steps[0].duration)
    setFinished(false)
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = selectedSession
    ? ((stepIndex) / selectedSession.steps.length) * 100
    : 0

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
              setPlaying(false)
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
            ← {view === 'home' ? 'Home' : 'Sessions'}
          </button>

          <span style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '12px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: '400'
          }}>
            Meditate
          </span>

          <div style={{ width: '60px' }} />
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          padding: '36px',
          boxSizing: 'border-box'
        }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {/* HOME VIEW */}
          {view === 'home' && (
            <div style={{
              maxWidth: '680px',
              margin: '0 auto'
            }}>
              <h2 style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '22px',
                fontWeight: '300',
                fontFamily: "'Georgia', serif",
                margin: '0 0 8px 0'
              }}>
                Guided Sessions
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.40)',
                fontSize: '14px',
                fontWeight: '300',
                margin: '0 0 36px 0',
                lineHeight: '1.6'
              }}>
                Choose a session based on how you're feeling right now.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {SESSIONS.map((session, i) => (
                  <div
                    key={session.id}
                    onClick={() => startSession(session)}
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
                          background: CATEGORY_COLORS[session.category],
                          color: 'rgba(255,255,255,0.75)',
                          fontSize: '10px',
                          letterSpacing: '0.06em',
                          fontWeight: '500'
                        }}>
                          {session.category}
                        </span>
                        <span style={{
                          color: 'rgba(255,255,255,0.30)',
                          fontSize: '11px'
                        }}>
                          {session.duration} min
                        </span>
                      </div>

                      <div style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: '15px',
                        fontWeight: '400',
                        marginBottom: '4px'
                      }}>
                        {session.title}
                      </div>

                      <div style={{
                        color: 'rgba(255,255,255,0.40)',
                        fontSize: '12px',
                        fontWeight: '300',
                        lineHeight: '1.5'
                      }}>
                        {session.description}
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
          {view === 'session' && selectedSession && (
            <div style={{
              maxWidth: '560px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '20px'
            }}>

              {/* Session title */}
              <h2 style={{
                color: 'rgba(255,255,255,0.80)',
                fontSize: '18px',
                fontWeight: '300',
                fontFamily: "'Georgia', serif",
                margin: '0 0 6px 0',
                textAlign: 'center'
              }}>
                {selectedSession.title}
              </h2>

              <span style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                marginBottom: '48px'
              }}>
                {selectedSession.duration} minutes · {selectedSession.category}
              </span>

              {!finished ? (
                <>
                  {/* Progress bar */}
                  <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255,255,255,0.10)',
                    borderRadius: '2px',
                    marginBottom: '48px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'rgba(255,255,255,0.40)',
                      borderRadius: '2px',
                      transition: 'width 1s ease'
                    }} />
                  </div>

                  {/* Step text */}
                  <div style={{
                    padding: '36px 40px',
                    borderRadius: '24px',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.13)',
                    marginBottom: '40px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <p style={{
                      color: 'rgba(255,255,255,0.88)',
                      fontSize: '17px',
                      fontWeight: '300',
                      fontFamily: "'Georgia', serif",
                      lineHeight: '1.85',
                      margin: 0,
                      textAlign: 'center'
                    }}>
                      {selectedSession.steps[stepIndex].text}
                    </p>
                  </div>

                  {/* Timer */}
                  <div style={{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    marginBottom: '36px'
                  }}>
                    {formatTime(secondsLeft)}
                  </div>

                  {/* Controls */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
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
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ↺
                    </button>

                    <button
                      onClick={togglePlay}
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
                          setFinished(true)
                        }
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ›
                    </button>
                  </div>

                  {/* Step counter */}
                  <p style={{
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: '11px',
                    marginTop: '24px',
                    letterSpacing: '0.06em'
                  }}>
                    {stepIndex + 1} of {selectedSession.steps.length}
                  </p>
                </>
              ) : (
                /* Finished state */
                <div style={{
                  textAlign: 'center',
                  animation: 'fadeSlideIn 0.8s ease forwards'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '24px',
                    opacity: 0.7
                  }}>
                    ◎
                  </div>
                  <h3 style={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: '20px',
                    fontWeight: '300',
                    fontFamily: "'Georgia', serif",
                    margin: '0 0 12px 0'
                  }}>
                    Well done
                  </h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '14px',
                    fontWeight: '300',
                    lineHeight: '1.7',
                    margin: '0 0 40px 0',
                    maxWidth: '320px'
                  }}>
                    You took a moment for yourself today. That matters more than you might think.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      onClick={() => setView('home')}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '28px',
                        border: '1px solid rgba(255,255,255,0.20)',
                        background: 'rgba(255,255,255,0.10)',
                        color: 'white',
                        fontSize: '13px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      All sessions
                    </button>
                    <button
                      onClick={reset}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '28px',
                        border: '1px solid rgba(255,255,255,0.20)',
                        background: 'rgba(255,255,255,0.10)',
                        color: 'white',
                        fontSize: '13px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      Repeat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MeditateScreen