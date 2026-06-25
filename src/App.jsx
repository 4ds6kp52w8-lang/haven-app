import { useState } from 'react'
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

function App() {
  const [screen, setScreen] = useState('home')
  const [firstMessage, setFirstMessage] = useState(null)
  const [prevScreen, setPrevScreen] = useState('home')

  function handleNavigate(destination) {
    setScreen(destination)
  }

  function handleWelcomeStart(msg) {
    setFirstMessage(msg)
    setScreen('chat')
  }

  const showSettings = screen !== 'settings'

  function goToSettings() {
    setPrevScreen(screen)
    setScreen('settings')
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {screen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
      {screen === 'welcome' && <WelcomeScreen onStart={handleWelcomeStart} onBack={() => setScreen('home')} />}
      {screen === 'chat' && <ChatScreen firstMessage={firstMessage} onBack={() => setScreen('home')} />}
      {screen === 'journal' && <JournalScreen onBack={() => setScreen('home')} />}
      {screen === 'meditate' && <MeditateScreen onBack={() => setScreen('home')} />}
      {screen === 'mood' && <MoodScreen onBack={() => setScreen('home')} />}
      {screen === 'breathe' && <BreatheScreen onBack={() => setScreen('home')} />}
      {screen === 'music' && <MusicScreen onBack={() => setScreen('home')} />}
      {screen === 'settings' && <SettingsScreen onBack={() => setScreen(prevScreen)} />}

      {/* Floating settings button — visible on every screen except settings itself */}
      {showSettings && (
        <button
          onClick={goToSettings}
          style={{
            position: 'fixed',
            top: '18px',
            right: '20px',
            zIndex: 100,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.20)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.90)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
          }}
        >
          ⚙
        </button>
      )}
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
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        color: 'white'
      }}>
        <p style={{ opacity: 0.6, marginBottom: '20px' }}>
          {screen} — coming soon
        </p>
        <button
          onClick={() => setScreen('home')}
          style={{
            padding: '10px 24px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.10)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            backdropFilter: 'blur(12px)'
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  )
}

export default App