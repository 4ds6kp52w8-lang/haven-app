import Background from './Background'

const features = [
  {
    id: 'welcome',
    icon: '◎',
    name: 'Haven',
    description: 'Your conversation space'
  },
  {
    id: 'breathe',
    icon: '◌',
    name: 'Breathe',
    description: 'Guided breathing exercises'
  },
  {
    id: 'meditate',
    icon: '⊹',
    name: 'Meditate',
    description: 'Guided meditation sessions'
  },
  {
    id: 'music',
    icon: '♩',
    name: 'Music',
    description: 'Connect your Spotify'
  },
  {
    id: 'journal',
    icon: '◻',
    name: 'Journal',
    description: 'Your private space'
  },
  {
    id: 'mood',
    icon: '∿',
    name: 'Mood',
    description: 'Your emotional timeline'
  }
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

function HomeScreen({ onNavigate }) {
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
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        padding: '40px 24px',
        boxSizing: 'border-box'
      }}>

        {/* Haven wordmark */}
        <div style={{
          position: 'absolute',
          top: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.50)',
          fontSize: '11px',
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          fontWeight: '400'
        }}>
          Haven
        </div>

        {/* Settings icon */}
        <button
          onClick={() => onNavigate('settings')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '32px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.40)',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.80)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.40)'}
        >
          ⚙
        </button>

        {/* Greeting */}
        <h1 style={{
          color: 'rgba(255,255,255,0.92)',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: '300',
          margin: '0 0 8px 0',
          letterSpacing: '0.02em',
          textAlign: 'center',
          fontFamily: "'Georgia', serif"
        }}>
          {getGreeting()}
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '14px',
          fontWeight: '300',
          margin: '0 0 52px 0',
          letterSpacing: '0.04em',
          textAlign: 'center'
        }}>
          What would you like to do today?
        </p>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          width: '100%',
          maxWidth: '680px'
        }}>
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={i}
              onClick={() => onNavigate(feature.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ feature, index, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '28px 20px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.09)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        transition: 'background 0.3s ease, border 0.3s ease, transform 0.2s ease',
        animation: `fadeSlideIn 0.6s ease forwards`,
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.16)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.30)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        color: 'rgba(255,255,255,0.85)'
      }}>
        {feature.icon}
      </div>

      {/* Name */}
      <div style={{
        color: 'rgba(255,255,255,0.90)',
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.04em'
      }}>
        {feature.name}
      </div>

      {/* Description */}
      <div style={{
        color: 'rgba(255,255,255,0.40)',
        fontSize: '11px',
        fontWeight: '300',
        letterSpacing: '0.02em',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        {feature.description}
      </div>
    </div>
  )
}

export default HomeScreen