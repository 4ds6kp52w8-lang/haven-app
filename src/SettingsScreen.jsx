import { useState, useEffect } from 'react'
import Background from './Background'
import { getSoundMode, setSoundMode } from './useAudio'
import { supabase } from './supabase'

function SettingsScreen({ onBack, user, onSignOut, onSignIn }) {
  const [visible, setVisible] = useState(false)
  const [soundMode, setSoundModeState] = useState(getSoundMode())
  const [cleared, setCleared] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => { if (data) setProfile(data) })
    }
  }, [user])

  useEffect(() => {
  const timer = setTimeout(() => setVisible(true), 100)
  return () => clearTimeout(timer)
}, [])

  function handleSoundMode(mode) {
    setSoundModeState(mode)
    setSoundMode(mode)
  }

  function clearData(key, label) {
    if (window.confirm(`Are you sure you want to delete all your ${label}? This cannot be undone.`)) {
      localStorage.removeItem(key)
      setCleared(true)
      setTimeout(() => setCleared(false), 2000)
    }
  }

  function clearAllData() {
    if (window.confirm('Are you sure you want to delete everything — journal entries, mood logs, and preferences? This cannot be undone.')) {
      localStorage.removeItem('haven-journal')
      localStorage.removeItem('haven-mood')
      localStorage.removeItem('haven-sound')
      localStorage.removeItem('haven-spotify-connected')
      setCleared(true)
      setTimeout(() => setCleared(false), 2000)
    }
  }

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
      <p style={{
        color: 'rgba(255,255,255,0.35)',
        fontSize: '11px',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        margin: '0 0 14px 0'
      }}>
        {title}
      </p>
      <div style={{
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </div>
  )

  const Row = ({ label, sublabel, children, danger }) => (
    <div style={{
      padding: '18px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      gap: '16px'
    }}>
      <div>
        <div style={{
          color: danger ? 'rgba(255,100,100,0.80)' : 'rgba(255,255,255,0.80)',
          fontSize: '14px',
          fontWeight: '400',
          marginBottom: sublabel ? '3px' : '0'
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '12px',
            fontWeight: '300',
            lineHeight: '1.5'
          }}>
            {sublabel}
          </div>
        )}
      </div>
      {children}
    </div>
  )

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
          <div style={{ width: '60px' }} />

          <span style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '12px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: '400'
          }}>
            Settings
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

          <div style={{
            maxWidth: '560px',
            margin: '0 auto'
          }}>

            {/* Saved confirmation */}
            {cleared && (
              <div style={{
                padding: '12px 20px',
                borderRadius: '14px',
                background: 'rgba(100,200,150,0.15)',
                border: '1px solid rgba(100,200,150,0.25)',
                color: 'rgba(100,200,150,0.90)',
                fontSize: '13px',
                marginBottom: '28px',
                textAlign: 'center'
              }}>
                Data cleared successfully.
              </div>
            )}


            {/* Account */}
            <Section title="Account">
              {user ? (
                <>
                  <Row label={profile?.name || "Haven User"} sublabel={user.email}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(140,200,255,0.25)", border: "1px solid rgba(140,200,255,0.40)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(200,230,255,0.90)", fontSize: "14px", fontWeight: "500", flexShrink: 0 }}>
                      {(profile?.name || user.email || "?")[0].toUpperCase()}
                    </div>
                  </Row>
                  <Row label="Sign out" sublabel="You will need to sign in again to access your data">
                    <button onClick={async () => { await supabase.auth.signOut(); onSignOut() }} style={{ padding: "6px 14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.60)", fontSize: "12px", cursor: "pointer", flexShrink: 0 }}>Sign out</button>
                  </Row>
                </>
              ) : (
                <Row label="Not signed in" sublabel="Sign in to save your data across devices">
                  <button onClick={onSignIn} style={{ padding: "6px 14px", borderRadius: "14px", border: "1px solid rgba(140,200,255,0.35)", background: "rgba(140,200,255,0.15)", color: "rgba(200,230,255,0.90)", fontSize: "12px", cursor: "pointer", flexShrink: 0 }}>Sign in</button>
                </Row>
              )}
            </Section>

            {/* Sound */}
            <Section title="Sound">
              <Row
                label="Sound environment"
                sublabel="Controls the ambient audio throughout Haven"
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['silent', 'ambient', 'piano'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleSoundMode(mode)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: soundMode === mode
                          ? 'rgba(255,255,255,0.20)'
                          : 'transparent',
                        color: soundMode === mode
                          ? 'rgba(255,255,255,0.90)'
                          : 'rgba(255,255,255,0.35)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textTransform: 'capitalize',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </Row>
            </Section>

            {/* Crisis resources */}
<Section title="Crisis Resources">
  <Row
    label="National Suicide & Crisis Lifeline"
    sublabel="Call or text 988 — available 24/7"
  >
    <a
      href="tel:988"
      style={{
        color: 'rgba(255,255,255,0.40)',
        fontSize: '13px',
        textDecoration: 'none',
        flexShrink: 0
      }}
    >
      Call
    </a>
  </Row>

  <Row
    label="Crisis Text Line"
    sublabel="Text HOME to 741741"
  >
    <a
      href="sms:741741&body=HOME"
      style={{
        color: 'rgba(255,255,255,0.40)',
        fontSize: '13px',
        textDecoration: 'none',
        flexShrink: 0
      }}
    >
      Text
    </a>
  </Row>

  <Row
    label="International Resources"
    sublabel="Find crisis support in your country"
  >
    <a
      href="https://www.iasp.info/resources/Crisis_Centres"
      target="_blank"
      rel="noreferrer"
      style={{
        color: 'rgba(255,255,255,0.40)',
        fontSize: '13px',
        textDecoration: 'none',
        flexShrink: 0
      }}
    >
      Open
    </a>
  </Row>
</Section>

            {/* About */}
            <Section title="About">
              <Row
                label="Haven"
                sublabel="A calm space, whenever you need it"
              >
                <span style={{
                  color: 'rgba(255,255,255,0.25)',
                  fontSize: '12px'
                }}>
                  v1.0
                </span>
              </Row>
              <Row
                label="Built with"
                sublabel="React, Vite, and the Anthropic API"
              >
                <span style={{
                  color: 'rgba(255,255,255,0.25)',
                  fontSize: '12px'
                }}>
                  ◎
                </span>
              </Row>
              <Row
                label="Haven is not a crisis service"
                sublabel="If you are in immediate danger, please contact emergency services or a crisis line above."
              >
                <span />
              </Row>
            </Section>

            {/* Data */}
            <Section title="Your Data">
              <Row
                label="Clear journal entries"
                sublabel="Permanently delete all journal entries"
                danger
              >
                <button
                  onClick={() => clearData('haven-journal', 'journal entries')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,100,100,0.25)',
                    background: 'rgba(255,100,100,0.08)',
                    color: 'rgba(255,100,100,0.70)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Clear
                </button>
              </Row>
              <Row
                label="Clear mood history"
                sublabel="Permanently delete all mood logs"
                danger
              >
                <button
                  onClick={() => clearData('haven-mood', 'mood history')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,100,100,0.25)',
                    background: 'rgba(255,100,100,0.08)',
                    color: 'rgba(255,100,100,0.70)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Clear
                </button>
              </Row>
              <Row
                label="Clear all data"
                sublabel="Delete everything and reset Haven"
                danger
              >
                <button
                  onClick={clearAllData}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,100,100,0.35)',
                    background: 'rgba(255,100,100,0.12)',
                    color: 'rgba(255,100,100,0.85)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Clear all
                </button>
              </Row>
            </Section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen