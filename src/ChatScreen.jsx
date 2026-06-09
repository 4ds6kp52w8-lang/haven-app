import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import Background from './Background'
import { playResponseBloom, getSoundMode, setSoundMode } from './useAudio'

function ChatScreen({ firstMessage }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [soundMode, setSoundModeState] = useState(getSoundMode())
  const bottomRef = useRef(null)
  const firstMessageSent = useRef(false)
  const conversationHistory = useRef([])

  function handleSoundMode(mode) {
    setSoundModeState(mode)
    setSoundMode(mode)
  }

  async function sendToHaven(userText) {
    conversationHistory.current.push({
      role: 'user',
      content: userText
    })

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory.current })
      })

      const data = await response.json()
      const reply = data.reply

      conversationHistory.current.push({
        role: 'assistant',
        content: reply
      })

      playResponseBloom()
      setMessages(prev => [...prev, { sender: 'haven', text: reply }])
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'haven',
        text: "I'm here — just having a little trouble connecting. Try again in a moment."
      }])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (firstMessage && !firstMessageSent.current) {
      firstMessageSent.current = true
      setMessages([{ sender: 'user', text: firstMessage }])
      sendToHaven(firstMessage)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function sendMessage() {
    if (!input.trim() || loading) return
    const text = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text }])
    setInput('')
    sendToHaven(text)
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

      {/* Soft vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,15,40,0.35) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2
      }}>

        {/* Header */}
        <div style={{
          padding: '22px 36px',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          {/* Left — Haven name and status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              color: 'rgba(255,255,255,0.90)',
              fontSize: '13px',
              fontWeight: '400',
              letterSpacing: '0.22em',
              textTransform: 'uppercase'
            }}>
              Haven
            </span>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: loading ? '#fbbf24' : '#4DD8E8',
              boxShadow: loading ? '0 0 8px #fbbf24' : '0 0 10px #4DD8E8',
              transition: 'all 0.4s ease'
            }} />
          </div>

          {/* Center — a calm space */}
          <span style={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: '12px',
            letterSpacing: '0.06em',
            fontWeight: '300'
          }}>
            a calm space
          </span>

          {/* Right — sound selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {['silent', 'ambient', 'piano'].map(mode => (
              <button
                key={mode}
                onClick={() => handleSoundMode(mode)}
                style={{
                  background: soundMode === mode
                    ? 'rgba(255,255,255,0.18)'
                    : 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '20px',
                  color: soundMode === mode
                    ? 'rgba(255,255,255,0.90)'
                    : 'rgba(255,255,255,0.35)',
                  fontSize: '11px',
                  fontFamily: "'Segoe UI', sans-serif",
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '40px 0 20px 0',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none',
          maxWidth: '100%',
          width: '100%',
          margin: '0'
        }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
            textarea::placeholder {
              color: rgba(255,255,255,0.50);
              font-family: 'Segoe UI', sans-serif;
            }
          `}</style>

          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.text} sender={msg.sender} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: '28px',
              padding: '0 80px 0 28px',
              animation: 'fadeSlideIn 0.6s ease forwards',
              opacity: 0
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '8px',
                paddingLeft: '4px',
                fontFamily: "'Segoe UI', sans-serif"
              }}>
                Haven
              </div>
              <div style={{
                padding: '14px 20px',
                borderRadius: '24px 24px 24px 6px',
                background: 'rgba(255,255,255,0.11)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex',
                gap: '6px',
                alignItems: 'center'
              }}>
                <style>{`
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); opacity: 0.3; }
                    50% { transform: translateY(-5px); opacity: 1; }
                  }
                  @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.8)',
                    animation: 'bounce 1.4s ease infinite',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '20px 36px 28px 36px',
          borderTop: 'none',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-end',
          maxWidth: '100%',
          width: '100%',
          margin: '0',
          boxSizing: 'border-box'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 22px',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.20)',
              background: 'rgba(255,255,255,0.10)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '300',
              fontFamily: "'Segoe UI', sans-serif",
              resize: 'none',
              outline: 'none',
              lineHeight: '1.6',
              backdropFilter: 'blur(20px)',
              caretColor: 'white',
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease, border 0.3s ease, background 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={e => {
              e.target.style.border = '1px solid rgba(255,255,255,0.40)'
              e.target.style.background = 'rgba(255,255,255,0.14)'
            }}
            onBlur={e => {
              e.target.style.border = '1px solid rgba(255,255,255,0.20)'
              e.target.style.background = 'rgba(255,255,255,0.10)'
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.20)',
              background: loading
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.15)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(255,255,255,0.08)'
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.40)'
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.20)'
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen