import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rquhjiikzhpkuwlbkbvo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdWhqaWlremhwa3V3bGJrYnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTA2NjYsImV4cCI6MjA5ODMyNjY2Nn0.gP1ce6BsQVRO80R8FCFOhwP8z5ZDlc-OcQYz-Gqm7aA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)