import { useState } from 'react'
import WelcomeScreen from './WelcomeScreen'
import ChatScreen from './ChatScreen'

function App() {
  const [firstMessage, setFirstMessage] = useState(null)

  if (!firstMessage) {
    return <WelcomeScreen onStart={(msg) => setFirstMessage(msg)} />
  }

  return <ChatScreen firstMessage={firstMessage} />
}

export default App