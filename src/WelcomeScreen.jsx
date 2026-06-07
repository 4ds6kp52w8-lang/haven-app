import { useEffect, useRef, useState } from 'react'

function WelcomeScreen({ onStart }) {
  const canvasRef = useRef(null)
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
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animFrame
    let t = 0

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      t++

      const breathCycle = (t % 540) / 540
      const breathe = (Math.sin(breathCycle * Math.PI * 2 - Math.PI / 2) + 1) / 2

      const w = canvas.width
      const h = canvas.height
      const maxDim = Math.max(w, h)

      // Solid bright base — no dark anywhere
      // Base color shifts between teal and blue as it breathes
      const baseR = Math.round(20  + 30  * breathe)
      const baseG = Math.round(120 + 60  * breathe)
      const baseB = Math.round(200 + 40  * breathe)
      ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`
      ctx.fillRect(0, 0, w, h)

      // Top-left — vivid cyan/teal
      {
        const radius = 1.4 * maxDim
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
        g.addColorStop(0,    `rgba(0, 210, 230, ${0.85 + 0.12 * breathe})`)
        g.addColorStop(0.35, `rgba(14, 180, 210, ${0.70 + 0.15 * breathe})`)
        g.addColorStop(0.65, `rgba(20, 150, 200, ${0.45 + 0.15 * breathe})`)
        g.addColorStop(1,    `rgba(20, 130, 190, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Top-right — vivid purple
      {
        const radius = 1.4 * maxDim
        const g = ctx.createRadialGradient(w, 0, 0, w, 0, radius)
        g.addColorStop(0,    `rgba(160, 80, 240, ${0.85 + 0.12 * breathe})`)
        g.addColorStop(0.35, `rgba(140, 70, 220, ${0.70 + 0.15 * breathe})`)
        g.addColorStop(0.65, `rgba(100, 60, 200, ${0.45 + 0.15 * breathe})`)
        g.addColorStop(1,    `rgba(80, 50, 180, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Bottom-left — vivid violet/indigo
      {
        const radius = 1.4 * maxDim
        const g = ctx.createRadialGradient(0, h, 0, 0, h, radius)
        g.addColorStop(0,    `rgba(100, 80, 255, ${0.85 + 0.12 * breathe})`)
        g.addColorStop(0.35, `rgba(80, 100, 240, ${0.70 + 0.15 * breathe})`)
        g.addColorStop(0.65, `rgba(60, 120, 220, ${0.45 + 0.15 * breathe})`)
        g.addColorStop(1,    `rgba(40, 110, 200, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Bottom-right — vivid blue
      {
        const radius = 1.4 * maxDim
        const g = ctx.createRadialGradient(w, h, 0, w, h, radius)
        g.addColorStop(0,    `rgba(40, 100, 255, ${0.85 + 0.12 * breathe})`)
        g.addColorStop(0.35, `rgba(55, 110, 235, ${0.70 + 0.15 * breathe})`)
        g.addColorStop(0.65, `rgba(50, 120, 210, ${0.45 + 0.15 * breathe})`)
        g.addColorStop(1,    `rgba(30, 100, 190, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Center pulse — bright teal white bloom on inhale
      {
        const cx = w / 2
        const cy = h / 2
        const radius = (0.6 + 0.5 * breathe) * maxDim
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        g.addColorStop(0,    `rgba(180, 230, 255, ${0.35 + 0.35 * breathe})`)
        g.addColorStop(0.3,  `rgba(100, 190, 240, ${0.20 + 0.20 * breathe})`)
        g.addColorStop(0.6,  `rgba(60,  160, 220, ${0.10 + 0.10 * breathe})`)
        g.addColorStop(1,    'rgba(40, 140, 200, 0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Slow drifting color blobs — keep corners alive between breaths
      const driftPoints = [
        { x: w * (0.25 + 0.12 * Math.sin(t * 0.0006)),       y: h * (0.25 + 0.10 * Math.cos(t * 0.0005)),       r: 230, g: 80,  b: 200, size: 0.55 },
        { x: w * (0.75 + 0.10 * Math.sin(t * 0.0007 + 1.2)), y: h * (0.30 + 0.12 * Math.cos(t * 0.0006 + 0.8)), r: 0,   g: 200, b: 230, size: 0.50 },
        { x: w * (0.50 + 0.08 * Math.sin(t * 0.0005 + 2.5)), y: h * (0.70 + 0.08 * Math.cos(t * 0.0008 + 1.5)), r: 80,  g: 120, b: 255, size: 0.52 },
        { x: w * (0.20 + 0.10 * Math.sin(t * 0.0008 + 3.0)), y: h * (0.75 + 0.10 * Math.cos(t * 0.0007 + 2.0)), r: 150, g: 60,  b: 255, size: 0.48 },
        { x: w * (0.80 + 0.09 * Math.sin(t * 0.0006 + 4.0)), y: h * (0.72 + 0.09 * Math.cos(t * 0.0005 + 3.0)), r: 0,   g: 180, b: 220, size: 0.46 },
      ]

      driftPoints.forEach(pt => {
        const radius = pt.size * maxDim
        const opacity = 0.28 + 0.18 * breathe
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius)
        grad.addColorStop(0,   `rgba(${pt.r}, ${pt.g}, ${pt.b}, ${opacity})`)
        grad.addColorStop(0.5, `rgba(${pt.r}, ${pt.g}, ${pt.b}, ${opacity * 0.4})`)
        grad.addColorStop(1,   `rgba(${pt.r}, ${pt.g}, ${pt.b}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      })

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputValue.trim()) {
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
      
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%'
        }}
      />

      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

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
          maxWidth: '520px',
          padding: '0 24px'
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
            display: inputValue ? 'none' : 'block'
          }}>
            press enter to begin
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen