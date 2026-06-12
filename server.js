
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

app.listen(3001, () => {
  console.log('Haven server running on http://localhost:3001')
})