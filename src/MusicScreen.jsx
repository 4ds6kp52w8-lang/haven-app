import { useState, useEffect, useRef } from 'react'
import Background from './Background'

const PLAYLISTS = [
  {
    id: 1,
    name: 'Peaceful Piano',
    description: 'Calm piano pieces for focus and reflection.',
    mood: 'Calm',
    color: 'rgba(100, 160, 220, 0.25)',
    tracks: '171 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    youtube: 'https://www.youtube.com/results?search_query=peaceful+piano+music',
    amazon: 'https://music.amazon.com/search/peaceful%20piano'
  },
  {
    id: 2,
    name: 'Sleep',
    description: 'Gentle sounds to help you drift off peacefully.',
    mood: 'Sleep',
    color: 'rgba(100, 80, 180, 0.25)',
    tracks: '139 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
    youtube: 'https://www.youtube.com/results?search_query=sleep+music+relaxing',
    amazon: 'https://music.amazon.com/search/sleep%20music'
  },
  {
    id: 3,
    name: 'Ambient Relaxation',
    description: 'Soft ambient textures for quiet moments.',
    mood: 'Relax',
    color: 'rgba(140, 100, 220, 0.25)',
    tracks: '85 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP',
    youtube: 'https://www.youtube.com/results?search_query=ambient+relaxation+music',
    amazon: 'https://music.amazon.com/search/ambient%20relaxation'
  },
  {
    id: 4,
    name: 'Feeling Happy',
    description: 'Uplifting songs to gently brighten your mood.',
    mood: 'Joy',
    color: 'rgba(220, 180, 80, 0.25)',
    tracks: '100 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX9XIFQuFvzM4',
    youtube: 'https://www.youtube.com/results?search_query=happy+feel+good+music',
    amazon: 'https://music.amazon.com/search/happy%20uplifting%20music'
  },
  {
    id: 5,
    name: 'Melancholy',
    description: 'For when you need to sit with your feelings.',
    mood: 'Sad',
    color: 'rgba(100, 140, 200, 0.25)',
    tracks: '60 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1',
    youtube: 'https://www.youtube.com/results?search_query=melancholy+sad+music',
    amazon: 'https://music.amazon.com/search/melancholy%20sad%20music'
  },
  {
    id: 6,
    name: 'Nature Sounds',
    description: 'Rain, ocean waves, and forest ambience.',
    mood: 'Grounding',
    color: 'rgba(100, 180, 140, 0.25)',
    tracks: '50 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8',
    youtube: 'https://www.youtube.com/results?search_query=nature+sounds+rain+ocean',
    amazon: 'https://music.amazon.com/search/nature%20sounds'
  },
  {
    id: 7,
    name: 'Deep Focus',
    description: 'Music engineered for deep concentration.',
    mood: 'Focus',
    color: 'rgba(180, 120, 200, 0.25)',
    tracks: '200 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
    youtube: 'https://www.youtube.com/results?search_query=deep+focus+study+music',
    amazon: 'https://music.amazon.com/search/deep%20focus%20music'
  },
  {
    id: 8,
    name: 'Healing',
    description: 'Gentle music for difficult days and tender moments.',
    mood: 'Healing',
    color: 'rgba(200, 140, 160, 0.25)',
    tracks: '75 songs',
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY',
    youtube: 'https://www.youtube.com/results?search_query=healing+gentle+music',
    amazon: 'https://music.amazon.com/search/healing%20music'
  }
]

function MusicScreen({ onBack }) {
  const [visible, setVisible] = useState(false)
  const [connected, setConnected] = useState(false)
  const [showConnectInfo, setShowConnectInfo] = useState(false)
  const [platform, setPlatform] = useState('spotify')
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const aiBottomRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const saved = localStorage.getItem('haven-spotify-connected')
    if (saved === 'true') setConnected(true)
  }, [])

  useEffect(() => {
    aiBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, aiLoading])

  function handleConnect() {
    setShowConnectInfo(true)
  }

  function handleDisconnect() {
    setConnected(false)
    localStorage.removeItem('haven-spotify-connected')
  }

  async function askHaven() {
    if (!aiInput.trim() || aiLoading) return
    const text = aiInput.trim()
    setAiMessages(prev => [...prev, { role: 'user', text }])
    setAiInput('')
    setAiLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, playlists: PLAYLISTS })
      })
      const data = await response.json()
      setAiMessages(prev => [...prev, {
        role: 'haven',
        text: data.reply,
        playlist: data.playlist
      }])
    } catch {
      setAiMessages(prev => [...prev, {
        role: 'haven',
        text: "I'm having trouble connecting right now. Try one of the playlists above — Peaceful Piano or Healing are good starting points.",
        playlist: null
      }])
    } finally {
      setAiLoading(false)
    }
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

      <style>{`
        div::-webkit-scrollbar { display: none; }
        textarea::placeholder { color: rgba(255,255,255,0.35); }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-4px); opacity: 1; }
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
            onClick={onBack}
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
            ← Home
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
  Music
</span>

          <button
  onClick={connected ? handleDisconnect : handleConnect}
  style={{
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.20)',
    background: connected ? 'rgba(30,215,96,0.15)' : 'rgba(255,255,255,0.08)',
    color: connected ? 'rgba(30,215,96,0.90)' : 'rgba(255,255,255,0.55)',
    fontSize: '11px', cursor: 'pointer', letterSpacing: '0.04em',
    transition: 'all 0.3s ease', backdropFilter: 'blur(12px)',
    marginRight: '48px'
  }}
>
  {connected
    ? 'Connected'
    : `Connect ${platform === 'spotify' ? 'Spotify' : platform === 'youtube' ? 'YouTube' : 'Amazon Music'}`
  }
</button>
</div>

        {/* Connect info modal */}
        {showConnectInfo && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <div style={{
              background: 'rgba(20,20,40,0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '420px',
              width: '100%',
              backdropFilter: 'blur(30px)'
            }}>
              <h3 style={{
                color: 'rgba(255,255,255,0.90)',
                fontSize: '18px',
                fontWeight: '300',
                fontFamily: "'Georgia', serif",
                margin: '0 0 12px 0'
              }}>
                Connect Spotify
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.50)',
                fontSize: '13px',
                fontWeight: '300',
                lineHeight: '1.7',
                margin: '0 0 8px 0'
              }}>
                Spotify integration requires a Spotify Premium account and a developer API key.
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.50)',
                fontSize: '13px',
                fontWeight: '300',
                lineHeight: '1.7',
                margin: '0 0 28px 0'
              }}>
                For now, you can open any playlist below directly in Spotify. Full in-app playback is coming soon.
              </p>
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowConnectInfo(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.open('https://developer.spotify.com', '_blank')
                    setShowConnectInfo(false)
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: '1px solid rgba(30,215,96,0.40)',
                    background: 'rgba(30,215,96,0.15)',
                    color: 'rgba(30,215,96,0.90)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Open Spotify Developer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          padding: '36px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '100%',
            margin: '0'
          }}>

            <h2 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 8px 0' }}>
  Curated Playlists
</h2>
<p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '14px', fontWeight: '300', margin: '0 0 20px 0', lineHeight: '1.6' }}>
  Hand-picked playlists for every emotional state.
</p>

{/* Platform selector */}
<div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
  {[
    { id: 'spotify',  label: 'Spotify',       color: 'rgba(30,215,96,0.80)' },
    { id: 'youtube',  label: 'YouTube',        color: 'rgba(255,80,80,0.80)' },
    { id: 'amazon',   label: 'Amazon Music',   color: 'rgba(0,168,232,0.80)' },
  ].map(p => (
    <button
      key={p.id}
      onClick={() => setPlatform(p.id)}
      style={{
        padding: '7px 16px', borderRadius: '20px',
        border: `1px solid ${platform === p.id ? p.color : 'rgba(255,255,255,0.15)'}`,
        background: platform === p.id ? `${p.color.replace('0.80', '0.12')}` : 'rgba(255,255,255,0.05)',
        color: platform === p.id ? p.color : 'rgba(255,255,255,0.40)',
        fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
        letterSpacing: '0.02em',
        boxShadow: platform === p.id ? `0 0 12px ${p.color.replace('0.80', '0.15')}` : 'none'
      }}
    >
      {p.label}
    </button>
  ))}
</div>

            {/* Playlist grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px'
            }}>
              {PLAYLISTS.map((playlist, i) => (
                <div
                  key={playlist.id}
                  onClick={() => window.open(playlist[platform], '_blank')}
                  style={{
                    padding: '22px 24px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    animation: 'fadeSlideIn 0.5s ease forwards',
                    animationDelay: `${i * 0.06}s`,
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.13)'
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
  padding: '3px 10px',
  borderRadius: '12px',
  background: playlist.color.replace('0.25', '0.55'),
  color: 'rgba(255,255,255,0.95)',
  fontSize: '10px',
  letterSpacing: '0.06em',
  fontWeight: '500',
  border: '1px solid rgba(255,255,255,0.20)'
}}>
  {playlist.mood}
</span>
                    <span style={{
                      color: 'rgba(255,255,255,0.25)',
                      fontSize: '11px'
                    }}>
                      {playlist.tracks}
                    </span>
                  </div>

                  <div style={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: '15px',
                    fontWeight: '400'
                  }}>
                    {playlist.name}
                  </div>

                  <span style={{
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  marginTop: '4px', fontSize: '11px', letterSpacing: '0.04em', fontWeight: '500',
  padding: '4px 11px', borderRadius: '12px', alignSelf: 'flex-start',
  color: 'rgba(255,255,255,0.95)',
  background: platform === 'spotify' ? 'rgba(30,155,65,0.60)' : platform === 'youtube' ? 'rgba(185,40,40,0.60)' : 'rgba(0,140,210,0.75)',
  border: '1px solid rgba(255,255,255,0.20)',
  boxShadow: platform === 'spotify'
  ? '0 2px 8px rgba(30,185,80,0.25), inset 0 1px 0 rgba(255,255,255,0.20)'
  : platform === 'youtube'
  ? '0 2px 8px rgba(220,50,50,0.25), inset 0 1px 0 rgba(255,255,255,0.20)'
  : '0 2px 8px rgba(0,140,210,0.25), inset 0 1px 0 rgba(255,255,255,0.20)',
}}>
  ↗ Open in {platform === 'spotify' ? 'Spotify' : platform === 'youtube' ? 'YouTube' : 'Amazon Music'}
</span>
                </div>
              ))}
            </div>

            {/* AI Music Assistant */}
            <div style={{
              marginTop: '48px',
              paddingTop: '36px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h3 style={{
                color: 'rgba(255,255,255,0.70)',
                fontSize: '15px',
                fontWeight: '300',
                fontFamily: "'Georgia', serif",
                margin: '0 0 6px 0'
              }}>
                Ask Haven
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '13px',
                fontWeight: '300',
                margin: '0 0 24px 0',
                lineHeight: '1.6'
              }}>
                Tell Haven how you're feeling and get a playlist recommendation.
              </p>

              {/* Messages */}
              {aiMessages.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  {aiMessages.map((msg, i) => (
                    <div key={i}>
                      <div style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: msg.playlist ? '10px' : '0'
                      }}>
                        <div style={{
                          maxWidth: '75%',
                          padding: '10px 16px',
                          borderRadius: msg.role === 'user'
                            ? '18px 18px 4px 18px'
                            : '18px 18px 18px 4px',
                          background: msg.role === 'user'
                            ? 'rgba(255,255,255,0.15)'
                            : 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.85)',
                          fontSize: '13px',
                          fontWeight: '300',
                          lineHeight: '1.6',
                          backdropFilter: 'blur(12px)'
                        }}>
                          {msg.text}
                        </div>
                      </div>

                      {msg.playlist && (
                        <div
                          onClick={() => window.open(msg.playlist.url, '_blank')}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(16px)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            maxWidth: '75%'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'
                          }}
                        >
                          <div style={{
                            color: 'rgba(255,255,255,0.88)',
                            fontSize: '14px',
                            fontWeight: '400',
                            marginBottom: '4px'
                          }}>
                            {msg.playlist.name}
                          </div>
                          <div style={{
                            color: 'rgba(255,255,255,0.40)',
                            fontSize: '12px',
                            marginBottom: '10px'
                          }}>
                            {msg.playlist.description}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'rgba(30,215,96,0.70)',
                            fontSize: '11px'
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                            Open in Spotify
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {aiLoading && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-start'
                    }}>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '18px 18px 18px 4px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center'
                      }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.7)',
                            animation: 'bounce 1.2s ease infinite',
                            animationDelay: `${i * 0.2}s`
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={aiBottomRef} />
                </div>
              )}

              {/* Input */}
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end'
              }}>
                <textarea
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      askHaven()
                    }
                  }}
                  placeholder="How are you feeling? I'll find the right music..."
                  rows={1}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '300',
                    fontFamily: "'Segoe UI', sans-serif",
                    resize: 'none',
                    outline: 'none',
                    lineHeight: '1.5',
                    backdropFilter: 'blur(12px)',
                    caretColor: 'white',
                    boxSizing: 'border-box',
                    transition: 'border 0.3s ease'
                  }}
                  onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.35)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.18)'}
                />
                <button
                  onClick={askHaven}
                  disabled={aiLoading || !aiInput.trim()}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: aiInput.trim()
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: aiInput.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicScreen