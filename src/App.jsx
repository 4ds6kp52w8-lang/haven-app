import WelcomeScreen from './WelcomeScreen'
import HomeScreen from './HomeScreen'
import ChatScreen from './ChatScreen'
import Background from './Background'
import JournalScreen from './JournalScreen'
import MeditateScreen from './MeditateScreen'
import MoodScreen from './MoodScreen'
import BreatheScreen from './BreatheScreen'
import MusicScreen from './MusicScreen'
import SettingsScreen from './SettingsScreen'
import AuthScreen from './AuthScreen'
import { supabase } from './supabase'
import { useState, useEffect, useRef } from 'react'

// ── Save-before-you-go modal ────────────────────────────────────────────
function SaveProgressModal({ onSignUp, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,15,40,0.70)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        maxWidth: '380px', width: '100%', padding: '36px',
        borderRadius: '24px', background: 'rgba(20,25,60,0.95)',
        backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.30)',
        textAlign: 'center', animation: 'fadeSlideIn 0.4s ease forwards'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.7 }}>◎</div>
        <h2 style={{ color: 'rgba(255,255,255,0.90)', fontSize: '20px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 10px 0' }}>
  Save your progress?
</h2>
<p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '300', lineHeight: '1.7', margin: '0 0 28px 0', fontFamily: "'Segoe UI', sans-serif" }}>
  Create a free account to keep your journal entries, mood history, and preferences — even when you close the tab.
</p>
        <button
          onClick={onSignUp}
          style={{ width: '100%', padding: '13px', borderRadius: '16px', border: '1px solid rgba(140,200,255,0.35)', background: 'rgba(140,200,255,0.18)', color: 'rgba(255,255,255,0.92)', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(12px)', marginBottom: '10px', transition: 'all 0.2s ease', letterSpacing: '0.03em' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(140,200,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(140,200,255,0.18)'}
        >
          Create free account
        </button>
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.02em' }}
        >
          No thanks, I'll lose my progress
        </button>
      </div>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState('home')
  const [prevScreen, setPrevScreen] = useState('home')
  const [firstMessage, setFirstMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [hasActivity, setHasActivity] = useState(false)

  // Check for existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthChecked(true)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  // Track activity — if user has done anything worth saving
  useEffect(() => {
    const journal = localStorage.getItem('haven-journal')
    const mood = localStorage.getItem('haven-mood')
    if (journal || mood) setHasActivity(true)
  }, [screen])

  // Show save modal when navigating to home if no account and has activity
const prevScreenRef = useRef(null)

useEffect(() => {
  if (user || !hasActivity) return
  if (screen === 'home' && prevScreenRef.current && prevScreenRef.current !== 'home' && !showAuth) {
    setShowSaveModal(true)
  }
  prevScreenRef.current = screen
}, [screen, user, hasActivity])

  function handleNavigate(destination) {
    setScreen(destination)
  }

  function handleWelcomeStart(msg) {
    setFirstMessage(msg)
    setScreen('chat')
  }

  function handleAuth(authUser) {
    setUser(authUser)
    setShowAuth(false)
    setShowSaveModal(false)
  }

  function goToSettings() {
    setPrevScreen(screen)
    setScreen('settings')
  }

  if (!authChecked) return null // Wait for session check

  const showSettings = screen !== 'settings' && !showAuth

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {showAuth && <AuthScreen onAuth={handleAuth} />}

      {!showAuth && (
        <>
          {screen === 'home' && <HomeScreen onNavigate={id => id === 'auth' ? setShowAuth(true) : handleNavigate(id)} user={user} />}
          {screen === 'welcome' && <WelcomeScreen onStart={handleWelcomeStart} onBack={() => setScreen('home')} />}
          {screen === 'chat' && <ChatScreen firstMessage={firstMessage} onBack={() => setScreen('home')} />}
          {screen === 'journal' && <JournalScreen onBack={() => setScreen('home')} user={user} />}
          {screen === 'meditate' && <MeditateScreen onBack={() => setScreen('home')} />}
          {screen === 'mood' && <MoodScreen onBack={() => setScreen('home')} user={user} />}
          {screen === 'breathe' && <BreatheScreen onBack={() => setScreen('home')} />}
          {screen === 'music' && <MusicScreen onBack={() => setScreen('home')} />}
          {screen === 'settings' && <SettingsScreen onBack={() => setScreen(prevScreen)} user={user} onSignOut={() => { setUser(null); setScreen('home') }} onSignIn={() => setShowAuth(true)} />}

          {/* Floating settings button */}
          {showSettings && (
            <button
              onClick={goToSettings}
              style={{ position: 'fixed', top: '12px', right: '20px', zIndex: 100, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.55)', fontSize: '16px', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.20)'; e.currentTarget.style.color = 'rgba(255,255,255,0.90)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
            >
              ⚙
            </button>
          )}

          {/* Save progress modal */}
          {showSaveModal && (
            <SaveProgressModal
              onSignUp={() => { setShowSaveModal(false); setShowAuth(true) }}
              onDismiss={() => setShowSaveModal(false)}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App