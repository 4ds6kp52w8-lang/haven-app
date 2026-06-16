export function shouldShowMoodCheck() {
  const saved = localStorage.getItem('haven-mood')
  if (!saved) return true

  const entries = JSON.parse(saved)
  if (entries.length === 0) return true

  const lastEntry = new Date(entries[0].date)
  const now = new Date()
  const diffMinutes = (now - lastEntry) / 1000 / 60

  return diffMinutes > 60
}

export function logMoodQuick(moodId) {
  const saved = localStorage.getItem('haven-mood')
  const entries = saved ? JSON.parse(saved) : []

  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    mood: moodId,
    note: ''
  }

  const updated = [entry, ...entries]
  localStorage.setItem('haven-mood', JSON.stringify(updated))
}