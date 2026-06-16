import { useState } from 'react'
import { logMoodQuick } from './useMoodCheck'

const MOODS = [
  { id: 'joyful',      label: 'Joyful',      emoji: '✦', color: 'rgba(255, 210, 80,  0.85)' },
  { id: 'calm',        label: 'Calm',        emoji: '◌', color: 'rgba(100, 200, 200, 0.85)' },
  { id: 'grateful',    label: 'Grateful',    emoji: '❋', color: 'rgba(150, 210, 150, 0.85)' },
  { id: 'anxious',     label: 'Anxious',     emoji: '◎', color: 'rgba(220, 160, 80,  0.85)' },
  { id: 'sad',         label: 'Sad',         emoji: '◑', color: 'rgba(100, 140, 220, 0.85)' },
  { id: 'angry',       label: 'Angry',       emoji: '◈', color: 'rgba(220, 100, 100, 0.85)' },
  { id: 'lonely',      label: 'Lonely',      emoji: '◐', color: 'rgba(160, 120, 200, 0.85)' },
  { id: 'tired',       label: 'Tired',       emoji: '◒', color: 'rgba(140, 140, 160, 0.85)' },
  { id: 'hopeful',     label: 'Hopeful',     emoji: '◇', color: 'rgba(180, 160, 220, 0.85)' },
  { id: 'numb',        label: 'Numb',        emoji: '○', color: 'rgba(160, 160, 180, 0.85)' },
  { id: 'content',     label: 'Content',     emoji: '◉', color: 'rgba(120, 190, 170, 0.85)' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '◆', color: 'rgba(200, 120, 160, 0.85)' }
]

function MoodCheckIn({ onDone }) {
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(true)

  function handleSelect(moodId) {
    setSelected(moodId)
  }

  function handleConfirm() {
    if (selected) {
      logMoodQuick(selected)
    }
    dismiss()
  }

  function dismiss() {
    setVisible(false)
    setTimeout(() => onDone(), 400)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '0 0 32px 0',
      pointerEvents: visible ? 'all' : 'none'
    }}>

      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.20)',
          backdropFilter: 'blur(4px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        padding: '28px 28px 24px 28px',
        borderRadius: '28px',
        background: 'rgba(20,20,50,0.85)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        margin: '0 24px'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: '16px',
              fontWeight: '300',
              fontFamily: "'Georgia', serif",
              margin: '0 0 4px 0'
            }}>
              How are you feeling?
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '12px',
              fontWeight: '300',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              Takes a second. Helps Haven understand.
            </p>
          </div>
          <button
            onClick={dismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.30)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0 0 0 12px',
              lineHeight: 1,
              flexShrink: 0
            }}
          >
            ×
          </button>
        </div>

        {/* Mood grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {MOODS.map(mood => (
            <div
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              style={{
                padding: '10px 4px',
                borderRadius: '14px',
                background: selected === mood.id
                  ? mood.color
                  : 'rgba(255,255,255,0.06)',
                border: selected === mood.id
                  ? '1px solid rgba(255,255,255,0.30)'
                  : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '16px' }}>{mood.emoji}</span>
              <span style={{
                color: selected === mood.id
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.45)',
                fontSize: '9px',
                fontWeight: '400',
                textAlign: 'center',
                letterSpacing: '0.01em',
                lineHeight: '1.2'
              }}>
                {mood.label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={dismiss}
            style={{
              padding: '9px 18px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.38)',
              fontSize: '12px',
              cursor: 'pointer',
              letterSpacing: '0.03em'
            }}
          >
            Skip
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            style={{
              padding: '9px 22px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.20)',
              background: selected
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.05)',
              color: selected
                ? 'rgba(255,255,255,0.90)'
                : 'rgba(255,255,255,0.25)',
              fontSize: '12px',
              cursor: selected ? 'pointer' : 'not-allowed',
              letterSpacing: '0.03em',
              transition: 'all 0.2s ease'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default MoodCheckIn