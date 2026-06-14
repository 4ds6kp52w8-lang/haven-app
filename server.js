
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const placeholderResponses = [
  "I hear you. That sounds really difficult — can you tell me more about how that's been making you feel?",
  "Thank you for sharing that with me. It takes courage to put those feelings into words.",
  "I'm here with you. What's been weighing on you the most lately?",
  "That makes a lot of sense given what you're going through. How long have you been feeling this way?",
  "You don't have to figure everything out right now. What would feel like a small step forward for you?",
  "It sounds like you've been carrying a lot. Is there someone in your life you feel safe talking to about this?",
  "I notice you mentioned that — I'd love to understand it better. What does that feel like for you?",
  "You're not alone in this. A lot of people feel exactly what you're describing, even if it doesn't seem that way.",
  "That's a really honest reflection. What do you think is underneath that feeling?",
  "I'm glad you're here. Take all the time you need — there's no rush."
]

let responseIndex = 0

app.post('/api/chat', async (req, res) => {
  // Simulate a small delay so it feels like Haven is thinking
  await new Promise(resolve => setTimeout(resolve, 1000))

  const reply = placeholderResponses[responseIndex % placeholderResponses.length]
  responseIndex++

  res.json({ reply })
})

app.post('/api/music', async (req, res) => {
  const { message, playlists } = req.body

  await new Promise(resolve => setTimeout(resolve, 1000))

  const msg = message.toLowerCase()

  let recommended = null

  if (msg.includes('sleep') || msg.includes('tired') || msg.includes('rest')) {
    recommended = playlists.find(p => p.name === 'Sleep')
  } else if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('nervous') || msg.includes('worried')) {
    recommended = playlists.find(p => p.name === 'Peaceful Piano')
  } else if (msg.includes('sad') || msg.includes('cry') || msg.includes('grief') || msg.includes('loss')) {
    recommended = playlists.find(p => p.name === 'Melancholy')
  } else if (msg.includes('focus') || msg.includes('work') || msg.includes('study') || msg.includes('concentrate')) {
    recommended = playlists.find(p => p.name === 'Deep Focus')
  } else if (msg.includes('happy') || msg.includes('joy') || msg.includes('good') || msg.includes('great')) {
    recommended = playlists.find(p => p.name === 'Feeling Happy')
  } else if (msg.includes('nature') || msg.includes('rain') || msg.includes('ocean') || msg.includes('outside')) {
    recommended = playlists.find(p => p.name === 'Nature Sounds')
  } else if (msg.includes('heal') || msg.includes('hurt') || msg.includes('pain') || msg.includes('difficult')) {
    recommended = playlists.find(p => p.name === 'Healing')
  } else {
    recommended = playlists.find(p => p.name === 'Ambient Relaxation')
  }

  const replies = [
    `Based on what you shared, I think ${recommended.name} might be a good fit right now.`,
    `It sounds like ${recommended.name} could be helpful for what you're feeling.`,
    `${recommended.name} feels right for this moment. Give it a try.`,
    `I'd suggest ${recommended.name} — it tends to work well for moments like this.`
  ]

  const reply = replies[Math.floor(Math.random() * replies.length)]

  res.json({ reply, playlist: recommended })
})

app.listen(3001, () => {
  console.log('Haven server running on http://localhost:3001')
})