import { useState } from 'react'
import WelcomeScreen from './WelcomeScreen'

function App() {
  const [firstMessage, setFirstMessage] = useState(null)

  if (!firstMessage) {
    return <WelcomeScreen onStart={(msg) => setFirstMessage(msg)} />
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#0e1228', minHeight: '100vh', color: 'white' }}>
      <h2>Chat coming soon... (opening message: "{firstMessage}")</h2>
    </div>
  )
}

export default App