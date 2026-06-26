import { useState, useEffect, useRef } from 'react'
import Background from './Background'

const MOOD_CHIPS = [
  { id: 'calm',       emoji: '😌', label: 'Calm' },
  { id: 'anxious',    emoji: '😰', label: 'Anxious' },
  { id: 'sad',        emoji: '😞', label: 'Sad' },
  { id: 'angry',      emoji: '😤', label: 'Angry' },
  { id: 'reflective', emoji: '🤔', label: 'Reflective' },
  { id: 'grateful',   emoji: '✨', label: 'Grateful' },
]

const MOOD_PROMPTS = {
  calm:       ["What's keeping you grounded right now?", "What does this calm feel like in your body?", "What helped you get here?"],
  anxious:    ["What's making today feel overwhelming?", "What's one thing that's within your control?", "If a friend were feeling this way, what would you tell them?"],
  sad:        ["What's weighing on you today?", "What do you wish someone understood about how you feel?", "What would help you feel a little lighter right now?"],
  angry:      ["What happened that brought this on?", "What do you actually need right now?", "What would you say if you could say anything?"],
  reflective: ["What's been on your mind lately?", "What has changed in you recently?", "What are you still trying to figure out?"],
  grateful:   ["What are you grateful for today?", "Who or what made a difference recently?", "What small thing brought you joy?"],
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatDateTime() {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  return { date, time, weekday }
}

function calcStreak(entries) {
  if (!entries.length) return 0
  const days = [...new Set(entries.map(e => new Date(e.date).toDateString()))]
  const sorted = days.map(d => new Date(d)).sort((a, b) => b - a)
  let streak = 1
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (sorted[0].toDateString() !== today && sorted[0].toDateString() !== yesterday) return 0
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = (sorted[i] - sorted[i + 1]) / 86400000
    if (diff <= 1.5) streak++
    else break
  }
  return streak
}

// ── Stats row ───────────────────────────────────────────────────────────
function StatsRow({ entries }) {
  const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0)
  const streak = calcStreak(entries)

  const stats = [
    { label: 'Entries', value: entries.length, icon: '◻' },
    { label: 'Words', value: totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords, icon: '✦' },
    { label: streak === 1 ? 'Day Streak' : 'Day Streak', value: streak, icon: '🔥' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ padding: '18px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.13)', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '6px', opacity: 0.7 }}>{s.icon}</div>
          <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: 1 }}>{s.value}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '0.08em', marginTop: '4px', textTransform: 'uppercase' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function JournalScreen({ onBack }) {
  const [view, setView] = useState('home')
  const [entries, setEntries] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentPhoto, setCurrentPhoto] = useState(null) // base64 string
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [visible, setVisible] = useState(false)
  const [moodBefore, setMoodBefore] = useState(null)
  const [moodAfter, setMoodAfter] = useState(null)
  const [selectedMoodChip, setSelectedMoodChip] = useState(null)
  const [activePrompt, setActivePrompt] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [writeMinutes, setWriteMinutes] = useState(0)
  const [showReflection, setShowReflection] = useState(false)
  const [aiReflection, setAiReflection] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [breatheReminder, setBreatheReminder] = useState(false)
  const saveTimerRef = useRef(null)
  const minuteTimerRef = useRef(null)
  const breatheTimerRef = useRef(null)
  const photoInputRef = useRef(null)
  const { date, time, weekday } = formatDateTime()

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const saved = localStorage.getItem('haven-journal')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (view !== 'write' || !currentText.trim()) return
    setSaveStatus('saving')
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
    return () => clearTimeout(saveTimerRef.current)
  }, [currentText, currentTitle])

  useEffect(() => {
    if (view !== 'write') { setWriteMinutes(0); return }
    minuteTimerRef.current = setInterval(() => setWriteMinutes(m => m + 1), 60000)
    return () => clearInterval(minuteTimerRef.current)
  }, [view])

  useEffect(() => {
    if (view !== 'write') { setBreatheReminder(false); return }
    breatheTimerRef.current = setTimeout(() => setBreatheReminder(true), 5 * 60 * 1000)
    return () => clearTimeout(breatheTimerRef.current)
  }, [view])

  function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setCurrentPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  function saveEntry(skipReflection = false) {
    if (!currentText.trim()) return
    if (!skipReflection && !showReflection) { setShowReflection(true); return }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: currentTitle.trim() || 'Untitled entry',
      text: currentText.trim(),
      photo: currentPhoto || null,
      moodBefore,
      moodAfter,
      prompt: activePrompt,
      wordCount: currentText.trim().split(/\s+/).length,
      aiReflection: aiReflection || null
    }

    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('haven-journal', JSON.stringify(updated))
    setCurrentText(''); setCurrentTitle(''); setCurrentPhoto(null)
    setMoodBefore(null); setMoodAfter(null); setSelectedMoodChip(null)
    setActivePrompt(null); setShowReflection(false); setAiReflection('')
    setView('home')
  }

  async function getAiReflection() {
    setAiLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `The user just wrote this journal entry. Please offer a warm, brief, insightful reflection (3-4 sentences max). Notice patterns, emotions, or strengths you see. Be compassionate and specific, not generic. Don't start with "I". Entry: "${currentText}"`
          }]
        })
      })
      const data = await response.json()
      setAiReflection(data.reply)
    } catch {
      setAiReflection("You showed up for yourself today. That's what matters.")
    } finally {
      setAiLoading(false)
    }
  }

  function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('haven-journal', JSON.stringify(updated))
    setView('home'); setSelectedEntry(null)
  }

  function selectMoodChip(chipId) {
    setSelectedMoodChip(chipId); setMoodBefore(chipId)
    const prompts = MOOD_PROMPTS[chipId]
    setActivePrompt(prompts[Math.floor(Math.random() * prompts.length)])
  }

  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>
      <Background />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,15,40,0.35) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 2, opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <style>{`
          div::-webkit-scrollbar { display: none; }
          textarea::placeholder { color: rgba(255,255,255,0.58); font-family: 'Georgia', serif; font-style: italic; }
input::placeholder { color: rgba(255,255,255,0.58); font-family: 'Georgia', serif; font-style: italic; }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bounce { 0%,100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(-4px); opacity: 1; } }
        `}</style>

        {/* Header */}
        <div style={{ padding: '22px 36px', borderBottom: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative' }}>
          <button onClick={view === 'home' ? onBack : () => { setShowReflection(false); setView('home') }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.04em', padding: 0 }}>
            ← {view === 'home' ? 'Home' : 'Journal'}
          </button>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.75)', fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: '400' }}>Journal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '48px' }}>
            {view === 'write' && (
              <span style={{ color: saveStatus === 'saved' ? 'rgba(100,220,160,0.70)' : 'rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '0.04em', transition: 'color 0.3s ease' }}>
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : ''}
              </span>
            )}
            {view === 'home' && (
              <button onClick={() => { setCurrentText(''); setCurrentTitle(''); setCurrentPhoto(null); setMoodBefore(null); setMoodAfter(null); setSelectedMoodChip(null); setActivePrompt(null); setShowReflection(false); setAiReflection(''); setView('write') }}
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: '20px', color: 'rgba(255,255,255,0.80)', fontSize: '12px', letterSpacing: '0.04em', padding: '6px 16px', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
                + New Entry
              </button>
            )}
            {view === 'write' && !showReflection && (
              <button onClick={() => saveEntry()} disabled={!currentText.trim()}
                style={{ background: currentText.trim() ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.06)', border: `1px solid ${currentText.trim() ? 'rgba(255,255,255,0.50)' : 'rgba(255,255,255,0.20)'}`, borderRadius: '20px', color: currentText.trim() ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.80)', fontSize: '12px', letterSpacing: '0.04em', padding: '6px 16px', cursor: currentText.trim() ? 'pointer' : 'not-allowed', backdropFilter: 'blur(12px)', transition: 'all 0.3s ease', boxShadow: currentText.trim() ? '0 0 16px rgba(255,255,255,0.95)' : 'none' }}>
                Finish
              </button>
            )}
            {view === 'entry' && (
              <button onClick={() => deleteEntry(selectedEntry.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.60)', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.04em' }}>
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Breathing reminder */}
        {breatheReminder && view === 'write' && (
          <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'rgba(20,20,50,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', animation: 'fadeSlideIn 0.5s ease forwards' }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: '300', fontFamily: "'Georgia', serif", fontStyle: 'italic' }}>Take one slow breath?</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setBreatheReminder(false)} style={{ background: 'rgba(140,200,255,0.20)', border: '1px solid rgba(140,200,255,0.35)', borderRadius: '16px', color: 'rgba(200,230,255,0.90)', fontSize: '11px', padding: '4px 12px', cursor: 'pointer' }}>Yes</button>
              <button onClick={() => setBreatheReminder(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}>Dismiss</button>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', padding: '36px', boxSizing: 'border-box' }}>

          {/* HOME VIEW */}
          {view === 'home' && (
            <div style={{ maxWidth: '100%', margin: '0' }}>
              {entries.length === 0 ? (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 200px)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '20px', opacity: 0.4 }}>◻</div>
                  <h2 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 12px 0' }}>Welcome to your private journal.</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '300', lineHeight: '1.7', margin: '0 0 32px 0', maxWidth: '320px' }}>
                    This space is only for you. Write without worrying about grammar, structure, or being perfect.
                  </p>
                  <button onClick={() => setView('write')} style={{ padding: '12px 32px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.10)', color: 'white', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(12px)', letterSpacing: '0.03em' }}>
                    ✨ Start Writing
                  </button>
                </div>
              ) : (
                <>
                  {/* Stats row */}
                  <StatsRow entries={entries} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {entries.map((entry, i) => (
                      <div key={entry.id} onClick={() => { setSelectedEntry(entry); setView('entry') }}
                        style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.13)', cursor: 'pointer', transition: 'all 0.2s ease', animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: `${i * 0.05}s`, opacity: 0, overflow: 'hidden' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)' }}
                      >
                        {/* Photo thumbnail */}
                        {entry.photo && (
                          <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                            <img src={entry.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}

                        <div style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', fontWeight: '400', marginBottom: '3px' }}>{entry.title || 'Untitled entry'}</div>
                              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.04em' }}>{formatDate(entry.date)}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {entry.moodBefore && <span style={{ fontSize: '16px' }}>{MOOD_CHIPS.find(m => m.id === entry.moodBefore)?.emoji}</span>}
                              {entry.moodAfter && entry.moodAfter !== entry.moodBefore && (
                                <>
                                  <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '10px' }}>→</span>
                                  <span style={{ fontSize: '16px' }}>{MOOD_CHIPS.find(m => m.id === entry.moodAfter)?.emoji}</span>
                                </>
                              )}
                              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{entry.wordCount} words</span>
                              <button onClick={e => { e.stopPropagation(); deleteEntry(entry.id) }} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.45)', fontSize: '11px', cursor: 'pointer', padding: 0, transition: 'color 0.2s ease' }}
                                onMouseEnter={e => e.target.style.color = 'rgba(255,100,100,0.90)'}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,100,100,0.45)'}
                              >delete</button>
                            </div>
                          </div>
                          {entry.prompt && <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px', fontStyle: 'italic', margin: '0 0 8px 0', lineHeight: '1.5' }}>"{entry.prompt}"</p>}
                          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: '300', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {entry.text}
                          </p>
                          {entry.aiReflection && (
                            <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <span style={{ color: 'rgba(180,210,255,0.55)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Haven reflected</span>
                              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', fontWeight: '300', fontStyle: 'italic', margin: '4px 0 0 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entry.aiReflection}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* WRITE VIEW */}
          {view === 'write' && !showReflection && (
            <div style={{ maxWidth: '100%', margin: '0' }}>

              {/* Date */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', fontWeight: '300', fontFamily: "'Georgia', serif" }}>{date}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', letterSpacing: '0.04em' }}>{weekday} · {time}</div>
              </div>

              {/* Mood chips */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px', letterSpacing: '0.06em', marginBottom: '12px' }}>How are you feeling?</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {MOOD_CHIPS.map(chip => (
                    <button key={chip.id} onClick={() => selectMoodChip(chip.id)}
  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${selectedMoodChip === chip.id ? 'rgba(140,200,255,0.45)' : 'rgba(255,255,255,0.15)'}`, background: selectedMoodChip === chip.id ? 'rgba(140,200,255,0.15)' : 'rgba(255,255,255,0.06)', color: selectedMoodChip === chip.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.50)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.25s ease' }}
  onMouseEnter={e => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.18)'
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.40)'
    e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
    e.currentTarget.style.boxShadow = '0 0 16px rgba(200,220,255,0.30), inset 0 1px 0 rgba(255,255,255,0.25)'
    e.currentTarget.style.transform = 'translateY(-1px)'
  }}
  onMouseLeave={e => {
    const isSelected = selectedMoodChip === chip.id
    e.currentTarget.style.background = isSelected ? 'rgba(140,200,255,0.15)' : 'rgba(255,255,255,0.06)'
    e.currentTarget.style.border = isSelected ? '1px solid rgba(140,200,255,0.45)' : '1px solid rgba(255,255,255,0.15)'
    e.currentTarget.style.color = isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.50)'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.transform = 'translateY(0)'
  }}
>
  <span>{chip.emoji}</span><span>{chip.label}</span>
</button>
                  ))}
                </div>
              </div>

              {/* Active prompt */}
              {activePrompt && (
                <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', animation: 'fadeIn 0.4s ease forwards' }}>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', fontStyle: 'italic', fontWeight: '300', margin: 0, lineHeight: '1.6' }}>{activePrompt}</p>
                  <button onClick={() => { const p = MOOD_PROMPTS[selectedMoodChip]; setActivePrompt(p[Math.floor(Math.random() * p.length)]) }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.30)', fontSize: '11px', cursor: 'pointer', padding: '6px 0 0 0', letterSpacing: '0.04em' }}>
                    different prompt ↻
                  </button>
                </div>
              )}

              {/* Paper page */}
              <div style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.28)', padding: '32px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.20)', marginBottom: '12px', width: '100%', boxSizing: 'border-box' }}>

                {/* Photo preview inside page */}
                {currentPhoto && (
                  <div style={{ position: 'relative', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={currentPhoto} alt="" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
                    <button onClick={() => setCurrentPhoto(null)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: 'white', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}

                {/* Title input */}
                <input type="text" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder="Give this entry a title..."
                  style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.90)', fontSize: '20px', fontWeight: '300', fontFamily: "'Georgia', serif", padding: '0 0 14px 0', marginBottom: '20px', outline: 'none', letterSpacing: '0.01em', boxSizing: 'border-box' }} />

                {/* Textarea */}
                <textarea autoFocus value={currentText} onChange={e => setCurrentText(e.target.value)}
                  placeholder="There's no right way to journal. Write whatever is on your mind — even if it's only one sentence."
                  style={{ width: '100%', minHeight: '350px', padding: '0', border: 'none', background: 'none', color: 'rgba(255,255,255,0.88)', fontSize: '16px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: '1.9', resize: 'none', outline: 'none', caretColor: 'rgba(255,255,255,0.7)', boxSizing: 'border-box' }} />

                {/* Bottom of page — photo button + stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    <button onClick={() => photoInputRef.current.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '16px', color: 'rgba(255,255,255,0.75)', fontSize: '11px', padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.color = 'rgba(255,255,255,0.90)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                    >
                      📷 &nbsp;{currentPhoto ? 'Change photo' : 'Add photo'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', color: 'rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '0.04em' }}>
                    <span>{wordCount} words</span>
                    {writeMinutes > 0 && <span>· {writeMinutes} min</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REFLECTION VIEW */}
          {view === 'write' && showReflection && (
            <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', animation: 'fadeSlideIn 0.6s ease forwards' }}>
              <div style={{ fontSize: '32px', opacity: 0.7 }}>◎</div>
              <h2 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: 0 }}>Your thoughts today...</h2>

              <div style={{ width: '100%' }}>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '12px' }}>How do you feel now?</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {MOOD_CHIPS.map(chip => (
                    <button key={chip.id} onClick={() => setMoodAfter(chip.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${moodAfter === chip.id ? 'rgba(140,200,255,0.45)' : 'rgba(255,255,255,0.15)'}`, background: moodAfter === chip.id ? 'rgba(140,200,255,0.15)' : 'rgba(255,255,255,0.06)', color: moodAfter === chip.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.50)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <span>{chip.emoji}</span><span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

              {!aiReflection && !aiLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '300', margin: 0 }}>Would you like Haven to reflect on this?</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => saveEntry(true)} style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.50)', fontSize: '13px', cursor: 'pointer' }}>Skip</button>
                    <button onClick={getAiReflection} style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid rgba(140,200,255,0.35)', background: 'rgba(140,200,255,0.15)', color: 'rgba(255,255,255,0.90)', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>Reflect with Haven</button>
                  </div>
                </div>
              )}

              {aiLoading && (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: 'bounce 1.2s ease infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}

              {aiReflection && (
                <>
                  <div style={{ padding: '24px 28px', borderRadius: '20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', textAlign: 'left', animation: 'fadeSlideIn 0.6s ease forwards', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ color: 'rgba(180,210,255,0.60)', fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '10px' }}>Haven reflects</div>
                    <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: '15px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: '1.75', margin: 0, fontStyle: 'italic' }}>{aiReflection}</p>
                  </div>
                  <button onClick={() => saveEntry(true)} style={{ padding: '10px 32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.20)', background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.80)', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(12px)', letterSpacing: '0.03em' }}>
                    Save entry
                  </button>
                </>
              )}
            </div>
          )}

          {/* ENTRY VIEW */}
          {view === 'entry' && selectedEntry && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>

              {/* Photo full width */}
              {selectedEntry.photo && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                  <img src={selectedEntry.photo} alt="" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.06em', marginBottom: '8px' }}>{formatDate(selectedEntry.date)}</div>

              {selectedEntry.moodBefore && (
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{MOOD_CHIPS.find(m => m.id === selectedEntry.moodBefore)?.emoji}</span>
                  <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px' }}>{MOOD_CHIPS.find(m => m.id === selectedEntry.moodBefore)?.label}</span>
                  {selectedEntry.moodAfter && selectedEntry.moodAfter !== selectedEntry.moodBefore && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '12px' }}>→</span>
                      <span style={{ fontSize: '18px' }}>{MOOD_CHIPS.find(m => m.id === selectedEntry.moodAfter)?.emoji}</span>
                      <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px' }}>{MOOD_CHIPS.find(m => m.id === selectedEntry.moodAfter)?.label}</span>
                    </>
                  )}
                </div>
              )}

              <h2 style={{ color: 'rgba(255,255,255,0.90)', fontSize: '22px', fontWeight: '300', fontFamily: "'Georgia', serif", margin: '0 0 20px 0' }}>{selectedEntry.title}</h2>

              {selectedEntry.prompt && (
                <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '13px', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.6' }}>"{selectedEntry.prompt}"</p>
              )}

              {/* Paper page for entry view */}
              <div style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', padding: '32px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.18)', marginBottom: '24px' }}>
                <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '16px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: '1.85', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selectedEntry.text}
                </p>
              </div>

              {selectedEntry.aiReflection && (
                <div style={{ padding: '22px 26px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', marginBottom: '20px' }}>
                  <div style={{ color: 'rgba(180,210,255,0.55)', fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '10px' }}>Haven reflected</div>
                  <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '14px', fontWeight: '300', fontFamily: "'Georgia', serif", lineHeight: '1.75', margin: 0, fontStyle: 'italic' }}>{selectedEntry.aiReflection}</p>
                </div>
              )}

              <p style={{ color: 'rgba(255,255,255,0.20)', fontSize: '11px', marginTop: '8px' }}>{selectedEntry.wordCount} words</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JournalScreen