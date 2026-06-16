import { startAmbientAudio } from './useAudio'
import Background from './Background'
import { shouldShowMoodCheck } from './useMoodCheck'
import { useEffect, useState } from 'react'

function WelcomeScreen({ onStart, onBack }) {
  const [inputVisible, setInputVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    const textTimer = setTimeout(() => setTextVisible(true), 1200)
    const inputTimer = setTimeout(() => setInputVisible(true), 2400)
    return () => {
      clearTimeout(textTimer)
      clearTimeout(inputTimer)
    }
  }, [])

  useEffect(() => {
    function handleFirstInteraction() {
      startAmbientAudio()
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('keydown', handleFirstInteraction)

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputValue.trim()) {
      startAmbientAudio()
      onStart(inputValue.trim())
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Georgia', serif"
    }}>
      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.90);
          font-weight: 300;
        }
      `}</style>

      <Background />

      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '32px',
            left: '36px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.50)',
            fontSize: '13px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            fontFamily: "'Segoe UI', sans-serif",
            padding: 0,
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 1.5s ease'
          }}
        >
          ← Home
        </button>
        
        {/* Haven wordmark */}
        <div style={{
          position: 'absolute',
          top: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.75)',
          fontSize: '12px',
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: '400',
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 1.5s ease'
        }}>
          Haven
        </div>

        {/* Primary question */}
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          fontWeight: '400',
          margin: '0 0 14px 0',
          letterSpacing: '0.01em',
          lineHeight: '1.3',
          textAlign: 'center',
          textShadow: '0 2px 24px rgba(0,0,0,0.18)',
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1.8s ease, transform 1.8s ease',
          maxWidth: '800px',
          padding: '0 24px',
          whiteSpace: 'nowrap'
        }}>
          How are you doing today?
        </h1>

        {/* Subtitle */}
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '16px',
          fontWeight: '300',
          margin: '0 0 56px 0',
          letterSpacing: '0.05em',
          fontFamily: "'Segoe UI', sans-serif",
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 2s ease',
          transitionDelay: '0.3s'
        }}>
          I'm here to listen.
        </p>

        {/* Input */}
        <div style={{
          opacity: inputVisible ? 1 : 0,
          transform: inputVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 2s ease, transform 2s ease',
          transitionDelay: '0.2s',
          width: '100%',
          maxWidth: '440px',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}>
          <input
            type="text"
            placeholder="Share what's on your mind..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '17px 26px',
              borderRadius: '40px',
              border: '1.5px solid rgba(255,255,255,0.70)',
              background: 'rgba(255,255,255,0.22)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '400',
              fontFamily: "'Segoe UI', sans-serif",
              letterSpacing: '0.02em',
              backdropFilter: 'blur(24px)',
              outline: 'none',
              boxSizing: 'border-box',
              caretColor: 'white',
              transition: 'border 0.3s ease, background 0.3s ease'
            }}
            onFocus={e => {
              e.target.style.border = '1.5px solid rgba(255,255,255,0.95)'
              e.target.style.background = 'rgba(255,255,255,0.30)'
            }}
            onBlur={e => {
              e.target.style.border = '1.5px solid rgba(255,255,255,0.70)'
              e.target.style.background = 'rgba(255,255,255,0.22)'
            }}
          />

          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '12px',
            textAlign: 'center',
            margin: '14px 0 0 0',
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: '0.03em',
            opacity: inputValue ? 0 : 1,
            transform: inputValue ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: inputValue ? 'none' : 'auto'
          }}>
            press enter to begin
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen