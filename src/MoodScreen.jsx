import { useState, useEffect } from 'react'
import Background from './Background'

const MOODS = [
  { id: 'joyful',      label: 'Joyful',      emoji: '✦', color: 'rgba(255, 210, 80,  0.85)' },
  { id: 'calm',        label: 'Calm',        emoji: '◌', color: 'rgba(100, 200, 200, 0.85)' },
  { id: 'grateful',    label: 'Grateful',    emoji: '❋', color: 'rgba(150, 210, 150, 0.85)' },
  { id: 'anxious',     label: 'Anxious',     emoji: '◎', color: 'rgba(220, 160, 80,  0.85)' },
  { id: 'sad',         label: 'Sad',         emoji: '◑', color: 'rgba(100, 140, 220, 0.85)' },
  { id: 'angry',       label: 'Angry',       emoji: '◈', color: 'rgba(220, 100, 100, 0.85)' },
  { id: 'lonely',      label: 'Lonely',      emoji: '◐', color: 'rgba(160, 120, 200, 0.85)' },
  { id: 'tired',       label: 'Tired',       emoji: '◒', color: 'rgba(140, 140, 160, 0.85)' },
  { id: 'hopeful',     label: 'Hopeful',     emoji: '◇', color: 'rgba(180, 160, 220, 0.85)' },
  { id: 'numb',        label: 'Numb',        emoji: '○', color: 'rgba(160, 160, 180, 0.85)' },
  { id: 'content',     label: 'Content',     emoji: '◉', color: 'rgba(120, 190, 170, 0.85)' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '◆', color: 'rgba(200, 120, 160, 0.85)' }
]

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

function groupByDate(entries) {
  const groups = {}
  entries.forEach(entry => {
    const date = new Date(entry.date).toDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(entry)
  })
  return groups
}

function MoodScreen({ onBack }) {
  const [view, setView] = useState('timeline')
  const [entries, setEntries] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [visible, setVisible] = useState(false)
  const [justLogged, setJustLogged] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const saved = localStorage.getItem('haven-mood')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  function logMood() {
    if (!selectedMood) return

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      note: note.trim()
    }

    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('haven-mood', JSON.stringify(updated))
    setSelectedMood(null)
    setNote('')
    setJustLogged(true)
    setTimeout(() => {
      setJustLogged(false)
      setView('timeline')
    }, 2000)
  }

  function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('haven-mood', JSON.stringify(updated))
  }

  const grouped = groupByDate(entries)
  const dates = Object.keys(grouped)

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

      <style>{`
        div::-webkit-scrollbar { display: none; }
        textarea::placeholder { color: rgba(255,255,255,0.30); }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

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
          flexShrink: 0,
          position: 'relative'
        }}>
          <button
            onClick={view === 'timeline' ? onBack : () => setView('timeline')}
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
            ← {view === 'timeline' ? 'Home' : 'Timeline'}
          </button>

          <span style={{
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'rgba(255,255,255,0.75)',
  fontSize: '12px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: '400'
}}>
  Mood
</span>

          {view === 'timeline' && (
            <button
              onClick={() => setView('log')}
              style={{
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.20)',
  borderRadius: '20px',
  color: 'rgba(255,255,255,0.80)',
  fontSize: '12px',
  letterSpacing: '0.04em',
  padding: '6px 16px',
  cursor: 'pointer',
  backdropFilter: 'blur(12px)',
  marginRight: '48px'
}}
            >
              + Log mood
            </button>
          )}

          {view === 'log' && (
            <button
              onClick={logMood}
              disabled={!selectedMood}
              style={{
                background: selectedMood
                  ? 'rgba(255,255,255,0.18)'
                  : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.20)',
                borderRadius: '20px',
                color: selectedMood
                  ? 'rgba(255,255,255,0.90)'
                  : 'rgba(255,255,255,0.30)',
                fontSize: '12px',
                letterSpacing: '0.04em',
                padding: '6px 16px',
                cursor: selectedMood ? 'pointer' : 'not-allowed',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease'
              }}
            >
              Save
            </button>
          )}
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

          {/* TIMELINE VIEW */}
          {view === 'timeline' && (
            <div style={{
              maxWidth: '100%',
              margin: '0',
              paddingLeft: '20px'
            }}>
              {entries.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'calc(100vh - 200px)'
                }}>
                  <div style={{
                    fontSize: '40px',
                    marginBottom: '20px',
                    opacity: 0.4
                  }}>∿</div>
                  <p style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '15px',
                    fontWeight: '300',
                    lineHeight: '1.7',
                    margin: '0 0 32px 0'
                  }}>
                    Your mood timeline is empty.<br />
                    Start tracking how you feel each day.
                  </p>
                  <button
                    onClick={() => setView('log')}
                    style={{
                      padding: '12px 32px',
                      borderRadius: '28px',
                      border: '1px solid rgba(255,255,255,0.22)',
                      background: 'rgba(255,255,255,0.10)',
                      color: 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                      backdropFilter: 'blur(12px)',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Log your first mood
                  </button>
                </div>
              ) : (
                <div>

                  {/* Recent pattern strip */}
                  <div style={{
                    marginBottom: '40px',
                    padding: '20px 24px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(16px)'
                  }}>
                    <p style={{
                      color: 'rgba(255,255,255,0.40)',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      margin: '0 0 16px 0',
                      textTransform: 'uppercase'
                    }}>
                      Recent pattern
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {entries.slice(0, 14).map((entry, i) => {
                        const mood = MOODS.find(m => m.id === entry.mood)
                        return (
                          <div
                            key={entry.id}
                            title={`${mood?.label} — ${formatDate(entry.date)}`}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: mood?.color || 'rgba(255,255,255,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              opacity: 1 - (i * 0.05),
                              cursor: 'default'
                            }}
                          >
                            {mood?.emoji}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div style={{
                    position: 'relative',
                    paddingLeft: '32px'
                  }}>

                    {/* Vertical line */}
                    <div style={{
                      position: 'absolute',
                      left: '10px',
                      top: '8px',
                      bottom: '8px',
                      width: '1px',
                      background: 'rgba(255,255,255,0.12)'
                    }} />

                    {dates.map((date, di) => (
                      <div key={date} style={{ marginBottom: '36px' }}>

                        {/* Date marker */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          marginBottom: '16px',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            left: '-26px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.20)',
                            border: '1px solid rgba(255,255,255,0.35)'
                          }} />
                          <p style={{
                            color: 'rgba(255,255,255,0.40)',
                            fontSize: '11px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            margin: 0
                          }}>
                            {formatDate(date)}
                          </p>
                        </div>

                        {/* Entries */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}>
                          {grouped[date].map((entry, i) => {
                            const mood = MOODS.find(m => m.id === entry.mood)
                            return (
                              <div
                                key={entry.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0',
                                  position: 'relative',
                                  animation: 'fadeSlideIn 0.5s ease forwards',
                                  animationDelay: `${(di + i) * 0.05}s`,
                                  opacity: 0
                                }}
                              >
                                {/* Mood node on the line */}
                                <div style={{
                                  position: 'absolute',
                                  left: '-27px',
                                  top: '14px',
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  background: mood?.color || 'rgba(255,255,255,0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  flexShrink: 0,
                                  boxShadow: `0 0 12px ${mood?.color || 'transparent'}`
                                }}>
                                  {mood?.emoji}
                                </div>

                                {/* Card */}
                                <div style={{
                                  flex: 1,
                                  padding: '14px 18px',
                                  borderRadius: '16px',
                                  background: 'rgba(255,255,255,0.07)',
                                  backdropFilter: 'blur(16px)',
                                  border: '1px solid rgba(255,255,255,0.10)'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: entry.note ? '6px' : '0'
                                  }}>
                                    <span style={{
                                      color: 'rgba(255,255,255,0.88)',
                                      fontSize: '14px',
                                      fontWeight: '400'
                                    }}>
                                      {mood?.label}
                                    </span>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px'
                                    }}>
                                      <span style={{
                                        color: 'rgba(255,255,255,0.25)',
                                        fontSize: '11px'
                                      }}>
                                        {formatTime(entry.date)}
                                      </span>
                                      <button
  onClick={() => deleteEntry(entry.id)}
  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}
  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.20)'; e.currentTarget.style.border = '1px solid rgba(255,80,80,0.40)' }}
  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)' }}
>
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
</button>
                                    </div>
                                  </div>

                                  {entry.note && (
                                    <p style={{
                                      color: 'rgba(255,255,255,0.45)',
                                      fontSize: '12px',
                                      fontWeight: '300',
                                      lineHeight: '1.5',
                                      margin: 0
                                    }}>
                                      {entry.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOG VIEW */}
          {view === 'log' && (
            <div style={{
              maxWidth: '560px',
              margin: '0 auto'
            }}>
              {justLogged ? (
                <div style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'calc(100vh - 200px)',
                  animation: 'fadeSlideIn 0.6s ease forwards'
                }}>
                  <div style={{
                    fontSize: '40px',
                    marginBottom: '16px',
                    opacity: 0.7
                  }}>◎</div>
                  <p style={{
                    color: 'rgba(255,255,255,0.70)',
                    fontSize: '16px',
                    fontWeight: '300',
                    fontFamily: "'Georgia', serif"
                  }}>
                    Logged. Thank you for checking in.
                  </p>
                </div>
              ) : (
                <>
                  <h2 style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '20px',
                    fontWeight: '300',
                    fontFamily: "'Georgia', serif",
                    margin: '0 0 8px 0'
                  }}>
                    How are you feeling?
                  </h2>
                  <p style={{
                    color: 'rgba(255,255,255,0.40)',
                    fontSize: '13px',
                    fontWeight: '300',
                    margin: '0 0 32px 0'
                  }}>
                    Choose what feels closest to right now.
                  </p>

                  {/* Mood grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px',
                    marginBottom: '32px'
                  }}>
                    {MOODS.map(mood => (
                      <div
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        style={{
                          padding: '16px 8px',
                          borderRadius: '16px',
                          background: selectedMood === mood.id
                            ? mood.color
                            : 'rgba(255,255,255,0.07)',
                          border: selectedMood === mood.id
                            ? '1px solid rgba(255,255,255,0.35)'
                            : '1px solid rgba(255,255,255,0.10)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                          backdropFilter: 'blur(12px)'
                        }}
                        onMouseEnter={e => {
                          if (selectedMood !== mood.id) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (selectedMood !== mood.id) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                          }
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
                        <span style={{
                          color: selectedMood === mood.id
                            ? 'rgba(255,255,255,0.95)'
                            : 'rgba(255,255,255,0.55)',
                          fontSize: '11px',
                          fontWeight: '400',
                          letterSpacing: '0.02em',
                          textAlign: 'center'
                        }}>
                          {mood.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Optional note */}
                  <div style={{ marginBottom: '8px' }}>
                    <p style={{
                      color: 'rgba(255,255,255,0.40)',
                      fontSize: '12px',
                      letterSpacing: '0.04em',
                      margin: '0 0 10px 0'
                    }}>
                      Add a note (optional)
                    </p>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="What's contributing to this feeling?"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '14px',
                        fontWeight: '300',
                        fontFamily: "'Segoe UI', sans-serif",
                        lineHeight: '1.6',
                        resize: 'none',
                        outline: 'none',
                        backdropFilter: 'blur(12px)',
                        caretColor: 'white',
                        boxSizing: 'border-box',
                        transition: 'border 0.3s ease'
                      }}
                      onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.30)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.15)'}
                    />
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

export default MoodScreen