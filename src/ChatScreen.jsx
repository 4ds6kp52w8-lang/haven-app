import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import Background from './Background'

function ChatScreen({ firstMessage }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const firstMessageSent = useRef(false)

  useEffect(() => {
    if (firstMessage && !firstMessageSent.current) {
      firstMessageSent.current = true
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: firstMessage }
      ])

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'haven',
            text: "Thank you for sharing that. Tell me more about how you're feeling."
          }
        ])
      }, 1000)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!input.trim()) return
    setMessages(prev => [...prev, { sender: 'user', text: input }])
    setInput('')

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'haven', text: "I hear you. I'm here with you." }
      ])
    }, 900)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
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
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '680px',
        zIndex: 1
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '400',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            Haven
          </span>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#4DD8E8',
            display: 'inline-block',
            boxShadow: '0 0 8px #4DD8E8'
          }} />
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none'
        }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
            textarea::placeholder { color: rgba(255,255,255,0.70); }
          `}</style>

          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.text} sender={msg.sender} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.08)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.30)',
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '300',
              fontFamily: "'Georgia', serif",
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5',
              backdropFilter: 'blur(12px)',
              caretColor: 'white'
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #07B9CE, #3969E7)',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 20px rgba(57, 105, 231, 0.4)'
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen