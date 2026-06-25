import { useState, useEffect } from 'react'
import Background from './Background'

const PROMPTS = [
  "What's been on your mind today?",
  "What are you feeling right now, and where do you feel it in your body?",
  "What's one thing that felt heavy today?",
  "What's one small thing that brought you comfort recently?",
  "What do you wish someone understood about how you're feeling?",
  "What are you holding onto that you might need to let go of?",
  "What does your ideal tomorrow look like?",
  "What would you tell a friend who was feeling the way you feel right now?",
  "What are you grateful for, even in the middle of difficulty?",
  "What is something you've been avoiding thinking about?",
  "What does your body need right now?",
  "What has changed in you over the past few months?"
]

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

function JournalScreen({ onBack }) {
  const [view, setView] = useState('home') // home, write, entry
  const [entries, setEntries] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const saved = localStorage.getItem('haven-journal')
    if (saved) setEntries(JSON.parse(saved))
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }, [])

  function saveEntry() {
    if (!currentText.trim()) return

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      text: currentText.trim(),
      prompt: showPrompt ? currentPrompt : null,
      wordCount: currentText.trim().split(/\s+/).length
    }

    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('haven-journal', JSON.stringify(updated))
    setCurrentText('')
    setView('home')
  }

  function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('haven-journal', JSON.stringify(updated))
    setView('home')
    setSelectedEntry(null)
  }

  function newPrompt() {
    let next
    do {
      next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
    } while (next === currentPrompt)
    setCurrentPrompt(next)
  }

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
          flexShrink: 0,
          position: 'relative'
        }}>
          <button
            onClick={view === 'home' ? onBack : () => setView('home')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '13px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← {view === 'home' ? 'Home' : 'Journal'}
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
  Journal
</span>

          {view === 'home' && (
            <button
              onClick={() => {
                setCurrentText('')
                setShowPrompt(false)
                setView('write')
              }}
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
              + New Entry
            </button>
          )}

          {view === 'write' && (
            <button
              onClick={saveEntry}
              disabled={!currentText.trim()}
              style={{
  background: currentText.trim()
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.20)',
  borderRadius: '20px',
  color: currentText.trim()
    ? 'rgba(255,255,255,0.90)'
    : 'rgba(255,255,255,0.30)',
  fontSize: '12px',
  letterSpacing: '0.04em',
  padding: '6px 16px',
  cursor: currentText.trim() ? 'pointer' : 'not-allowed',
  backdropFilter: 'blur(12px)',
  transition: 'all 0.3s ease',
  marginRight: '48px'
}}
            >
              Save
            </button>
          )}

          {view === 'entry' && (
            <button
              onClick={() => deleteEntry(selectedEntry.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,100,100,0.60)',
                fontSize: '12px',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              Delete
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
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {/* HOME VIEW */}
          {view === 'home' && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto'
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
                  }}>◻</div>
                  <p style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '15px',
                    fontWeight: '300',
                    lineHeight: '1.7',
                    margin: '0 0 32px 0'
                  }}>
                    Your journal is empty.<br />
                    This is your private space to think out loud.
                  </p>
                  <button
                    onClick={() => setView('write')}
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
                    Write your first entry
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {entries.map((entry, i) => (
                    <div
                      key={entry.id}
                      onClick={() => {
                        setSelectedEntry(entry)
                        setView('entry')
                      }}
                      style={{
                        padding: '20px 24px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.09)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.13)',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease, border 0.2s ease',
                        animation: 'fadeSlideIn 0.5s ease forwards',
                        animationDelay: `${i * 0.05}s`,
                        opacity: 0
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)'
                      }}
                    >
                      <style>{`
                        @keyframes fadeSlideIn {
                          from { opacity: 0; transform: translateY(8px); }
                          to { opacity: 1; transform: translateY(0); }
                        }
                      `}</style>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{
                          color: 'rgba(255,255,255,0.55)',
                          fontSize: '11px',
                          letterSpacing: '0.06em'
                        }}>
                          {formatDate(entry.date)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            color: 'rgba(255,255,255,0.30)',
                            fontSize: '11px'
                          }}>
                            {entry.wordCount} words
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              deleteEntry(entry.id)
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'rgba(255,100,100,0.50)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              letterSpacing: '0.04em',
                              padding: 0,
                              transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={e => e.target.style.color = 'rgba(255,100,100,0.90)'}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,100,100,0.50)'}
                          >
                            delete
                          </button>
                        </div>
                      </div>

                      {entry.prompt && (
                        <p style={{
                          color: 'rgba(255,255,255,0.35)',
                          fontSize: '11px',
                          fontStyle: 'italic',
                          margin: '0 0 8px 0',
                          lineHeight: '1.5'
                        }}>
                          "{entry.prompt}"
                        </p>
                      )}

                      <p style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '14px',
                        fontWeight: '300',
                        lineHeight: '1.6',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WRITE VIEW */}
          {view === 'write' && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto'
            }}>

              {/* Prompt toggle */}
              <div style={{
                marginBottom: '28px',
                padding: '18px 22px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: showPrompt ? '12px' : '0'
                }}>
                  <span style={{
                    color: 'rgba(255,255,255,0.50)',
                    fontSize: '12px',
                    letterSpacing: '0.06em'
                  }}>
                    Need a prompt?
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {showPrompt && (
                      <button
                        onClick={newPrompt}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.40)',
                          fontSize: '11px',
                          cursor: 'pointer',
                          letterSpacing: '0.04em'
                        }}
                      >
                        different prompt
                      </button>
                    )}
                    <button
                      onClick={() => setShowPrompt(!showPrompt)}
                      style={{
                        background: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: 'rgba(255,255,255,0.60)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: '3px 10px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {showPrompt ? 'hide' : 'show'}
                    </button>
                  </div>
                </div>

                {showPrompt && (
                  <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: '300',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {currentPrompt}
                  </p>
                )}
              </div>

              {/* Writing area */}
              <textarea
                autoFocus
                value={currentText}
                onChange={e => setCurrentText(e.target.value)}
                placeholder="Start writing. This space is just for you."
                style={{
                  width: '100%',
                  minHeight: '340px',
                  padding: '24px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '16px',
                  fontWeight: '300',
                  fontFamily: "'Georgia', serif",
                  lineHeight: '1.85',
                  resize: 'vertical',
                  outline: 'none',
                  backdropFilter: 'blur(16px)',
                  caretColor: 'rgba(255,255,255,0.7)',
                  boxSizing: 'border-box',
                  transition: 'border 0.3s ease'
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.28)'
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.15)'
                }}
              />

              {/* Word count */}
              <div style={{
                textAlign: 'right',
                marginTop: '10px',
                color: 'rgba(255,255,255,0.28)',
                fontSize: '11px',
                letterSpacing: '0.04em'
              }}>
                {currentText.trim() ? currentText.trim().split(/\s+/).length : 0} words
              </div>
            </div>
          )}

          {/* ENTRY VIEW */}
          {view === 'entry' && selectedEntry && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto'
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '12px',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                {formatDate(selectedEntry.date)}
              </p>

              {selectedEntry.prompt && (
                <p style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  "{selectedEntry.prompt}"
                </p>
              )}

              <p style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '16px',
                fontWeight: '300',
                fontFamily: "'Georgia', serif",
                lineHeight: '1.85',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedEntry.text}
              </p>

              <p style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '11px',
                marginTop: '32px'
              }}>
                {selectedEntry.wordCount} words
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default JournalScreen