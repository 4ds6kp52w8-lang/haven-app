import { useState } from 'react'
import WelcomeScreen from './WelcomeScreen'
import HomeScreen from './HomeScreen'
import ChatScreen from './ChatScreen'
import Background from './Background'
import JournalScreen from './JournalScreen'

function App() {
  const [screen, setScreen] = useState('home')
  const [firstMessage, setFirstMessage] = useState(null)

  function handleNavigate(destination) {
    setScreen(destination)
  }

  function handleWelcomeStart(msg) {
    setFirstMessage(msg)
    setScreen('chat')
  }

  if (screen === 'home') {
    return <HomeScreen onNavigate={handleNavigate} />
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={handleWelcomeStart} />
  }

  if (screen === 'chat') {
    return <ChatScreen firstMessage={firstMessage} />
  }

  if (screen === 'journal') {
    return <JournalScreen onBack={() => setScreen('home')} />
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