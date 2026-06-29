import { useState } from 'react'
import Background from './Background'
import { supabase } from './supabase'

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    setError(''); setMessage(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) { setError(error.message); setLoading(false); return }
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, name })
        }
        setMessage('Account created! You can now sign in.')
        setMode('signin')
      } else if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); setLoading(false); return }
        onAuth(data.user)
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) { setError(error.message); setLoading(false); return }
        setMessage('Password reset email sent.')
      }
    } catch (err) {
      setError(String(err.message || err))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)',
    color: 'white', fontSize: '14px', fontWeight: '300',
    fontFamily: "'Segoe UI', sans-serif", outline: 'none',
    backdropFilter: 'blur(12px)', caretColor: 'white',
    boxSizing: 'border-box', transition: 'border 0.3s ease'
  }

  const FEATURES = [
    { icon: '📓', text: 'Journal entries saved forever' },
    { icon: '🌊', text: 'Mood history across devices' },
    { icon: '◎', text: 'AI reflections preserved' },
    { icon: '🔒', text: 'Private and secure' },
  ]

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>
      <Background />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,15,40,0.45) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.30); font-family: 'Segoe UI', sans-serif; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 2 }}>

        {/* Left panel — only on signup */}
        {mode === 'signup' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', borderRight: '1px solid rgba(255,255,255,0.08)', animation: 'fadeSlideIn 0.6s ease forwards', background: 'rgba(10,15,40,0.55)', backdropFilter: 'blur(20px)' }}>
            <div style={{ color: 'rgba(255,255,255,0.50)', fontSize: '11px', letterSpacing: '0.30em', textTransform: 'uppercase', marginBottom: '20px' }}>Haven</div>
            <h2 style={{ color: 'rgba(255,255,255,0.90)', fontSize: '28px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 12px 0', textAlign: 'center', lineHeight: 1.4 }}>
              Your wellness,<br/>always with you.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '14px', fontWeight: '300', lineHeight: '1.7', textAlign: 'center', maxWidth: '280px', margin: '0 0 48px 0' }}>
              Create an account and everything you do in Haven stays with you — on any device, any time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '280px' }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '13px', fontWeight: '300' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right panel — form */}
        <div style={{ flex: mode === 'signup' ? '0 0 420px' : '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
          <div style={{ width: '100%', maxWidth: '380px', animation: 'fadeSlideIn 0.6s ease forwards' }}>

            {mode !== 'signup' && (
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ color: 'rgba(255,255,255,0.50)', fontSize: '11px', letterSpacing: '0.30em', textTransform: 'uppercase', marginBottom: '12px' }}>Haven</div>
                <h1 style={{ color: 'rgba(255,255,255,0.90)', fontSize: '24px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 8px 0' }}>
                  {mode === 'signin' ? 'Welcome back' : 'Reset your password'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '13px', margin: 0 }}>
                  {mode === 'signin' ? 'Your space is waiting for you.' : "We'll send you a reset link."}
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ color: 'rgba(255,255,255,0.90)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 6px 0' }}>
                  Create your account
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '13px', margin: 0 }}>Free forever. No credit card needed.</p>
              </div>
            )}

            <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>

              {error && (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,100,100,0.18)', marginBottom: '16px', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(255,60,60,0.10)' }}>
    <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
    <div>
      <div style={{ color: 'rgba(255,180,180,0.75)', fontSize: '13px', fontWeight: '500', fontFamily: "'Segoe UI', sans-serif", marginBottom: '2px' }}>Something went wrong</div>
      <div style={{ color: 'rgba(255,160,160,0.55)', fontSize: '12px', fontWeight: '300', fontFamily: "'Segoe UI', sans-serif", lineHeight: '1.5' }}>{error}</div>
    </div>
  </div>
)}
{message && (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(100,220,160,0.10)', border: '1px solid rgba(100,220,160,0.30)', marginBottom: '16px', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(100,220,160,0.10)' }}>
    <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>✓</span>
    <div>
      <div style={{ color: 'rgba(140,220,180,0.95)', fontSize: '13px', fontWeight: '500', fontFamily: "'Segoe UI', sans-serif", marginBottom: '2px' }}>Success</div>
      <div style={{ color: 'rgba(120,200,160,0.75)', fontSize: '12px', fontWeight: '300', fontFamily: "'Segoe UI', sans-serif", lineHeight: '1.5' }}>{message}</div>
    </div>
  </div>
)}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mode === 'signup' && (
                  <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.40)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.18)'} />
                )}
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" style={inputStyle}
                  onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.40)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.18)'} />
                {mode !== 'forgot' && (
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.40)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.18)'} />
                )}
              </div>

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: '100%', marginTop: '16px', padding: '13px', borderRadius: '14px', border: '1px solid rgba(140,200,255,0.40)', background: 'rgba(140,200,255,0.20)', color: 'rgba(255,255,255,0.95)', fontSize: '14px', fontFamily: "'Segoe UI', sans-serif", fontWeight: '400', cursor: loading ? 'not-allowed' : 'pointer', backdropFilter: 'blur(12px)', transition: 'all 0.25s ease', letterSpacing: '0.03em', boxShadow: '0 0 24px rgba(140,200,255,0.15)' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(140,200,255,0.32)' }}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(140,200,255,0.20)'}
              >
                {loading ? '...' : mode === 'signup' ? 'Create account' : mode === 'signin' ? 'Sign in' : 'Send reset link'}
              </button>

              {mode === 'signin' && (
                <button onClick={() => { setMode('forgot'); setError(''); setMessage('') }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: '12px', cursor: 'pointer', width: '100%', marginTop: '10px', fontFamily: "'Segoe UI', sans-serif" }}>
                  Forgot password?
                </button>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {mode === 'forgot' ? (
                <button onClick={() => { setMode('signin'); setError(''); setMessage('') }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.40)', fontSize: '13px', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" }}>
                  ← Back to sign in
                </button>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: "'Segoe UI', sans-serif" }}>
                  {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }}
                    style={{ background: 'none', border: 'none', color: 'rgba(140,200,255,0.80)', fontSize: '13px', cursor: 'pointer', padding: 0, fontFamily: "'Segoe UI', sans-serif" }}>
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </span>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button onClick={() => onAuth(null)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.18)', fontSize: '12px', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" }}>
                Continue without account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen