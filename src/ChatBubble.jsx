import { useEffect, useRef } from 'react'

function ChatBubble({ message, sender }) {
  const isUser = sender === 'user'
  const ref = useRef(null)
  const glowRef = useRef(null)

  // Gentle ambient glow animation for Haven's messages
  useEffect(() => {
    if (isUser || !glowRef.current) return
    let t = 0
    let animFrame

    function animate() {
      t += 0.008
      const opacity = 0.06 + 0.04 * Math.sin(t)
      if (glowRef.current) {
        glowRef.current.style.opacity = opacity
      }
      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '28px',
        padding: isUser ? '0 28px 0 80px' : '0 80px 0 28px',
        animation: 'fadeSlideIn 0.6s ease forwards',
        opacity: 0,
        width: '100%',
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Sender label */}
      <div style={{
        fontSize: '11px',
        fontWeight: '500',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
        marginBottom: '8px',
        fontFamily: "'Manrope', sans-serif",
        paddingLeft: isUser ? '0' : '4px',
        paddingRight: isUser ? '4px' : '0'
      }}>
        {isUser ? 'You' : 'Haven'}
      </div>

      {/* Message card */}
      <div style={{
        position: 'relative',
        width: 'inline-block',
        maxWidth: '70%'
      }}>

        {/* Ambient glow behind Haven messages */}
        {!isUser && (
          <div
            ref={glowRef}
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '28px',
              background: 'radial-gradient(ellipse, rgba(100,160,255,0.3) 0%, transparent 70%)',
              filter: 'blur(16px)',
              pointerEvents: 'none',
              opacity: 0.06
            }}
          />
        )}

        {/* Glass card */}
        <div style={{
          position: 'relative',
          padding: '14px 20px',
          borderRadius: isUser ? '24px 24px 6px 24px' : '24px 24px 24px 6px',
          background: isUser
          ? 'rgba(240,238,255,0.82)'
          : 'rgba(220,215,255,0.18)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: isUser
          ? '1px solid rgba(200,195,255,0.40)'
          : '1px solid rgba(180,170,255,0.25)',
        boxShadow: isUser
          ? '0 8px 32px rgba(150,140,255,0.10), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 8px 32px rgba(120,100,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)',
        color: isUser ? '#2a2445' : 'rgba(255,255,255,0.92)',
          fontSize: '16px',
          fontWeight: isUser ? '400' : '300',
          lineHeight: '1.75',
          fontFamily: "'Manrope', sans-serif",
          letterSpacing: '0.015em'
        }}>
          {message}
        </div>
      </div>
    </div>
  )
}

export default ChatBubble