import { useEffect, useRef } from 'react'

function ChatBubble({ message, sender }) {
  const isUser = sender === 'user'
  const glowRef = useRef(null)

  useEffect(() => {
    if (isUser || !glowRef.current) return
    let t = 0
    let animFrame

    function animate() {
      t += 0.006
      const opacity = 0.04 + 0.03 * Math.sin(t)
      if (glowRef.current) {
        glowRef.current.style.opacity = opacity
      }
      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '20px',
      padding: isUser ? '0 28px 0 80px' : '0 80px 0 28px',
      animation: 'fadeSlideIn 0.5s ease forwards',
      opacity: 0,
      width: '100%'
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes havenBloom {
          0% { opacity: 0; transform: translateY(6px) scale(0.98); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
      `}</style>

      {/* Sender label */}
      <div style={{
        fontSize: '10px',
        fontWeight: '500',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.30)',
        marginBottom: '6px',
        fontFamily: "'Manrope', sans-serif",
        paddingLeft: isUser ? '0' : '4px',
        paddingRight: isUser ? '4px' : '0'
      }}>
        {isUser ? 'You' : 'Haven'}
      </div>

      <div style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: '65%',
        animation: isUser ? 'fadeSlideIn 0.4s ease forwards' : 'havenBloom 0.9s ease forwards'
      }}>

        {/* Haven ambient glow */}
        {!isUser && (
          <div
            ref={glowRef}
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '28px',
              background: 'radial-gradient(ellipse, rgba(140,100,255,0.4) 0%, transparent 70%)',
              filter: 'blur(12px)',
              pointerEvents: 'none',
              opacity: 0.04
            }}
          />
        )}

        {/* Bubble */}
        <div style={{
          position: 'relative',
          padding: '13px 18px',
          borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',

          // User — pearl glass with blue tint
          background: isUser
            ? 'rgba(210, 220, 255, 0.16)'
            : 'rgba(255,255,255,0.07)',

          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',

          border: isUser
            ? '1px solid rgba(200, 215, 255, 0.28)'
            : '1px solid rgba(255,255,255,0.12)',

          boxShadow: isUser
            ? '0 4px 24px rgba(100,120,255,0.12), inset 0 1px 0 rgba(255,255,255,0.18)'
            : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',

          color: 'rgba(255,255,255,0.90)',
          fontSize: '15px',
          fontWeight: '300',
          lineHeight: '1.70',
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