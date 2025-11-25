import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjoreefjryvmewihubut.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqb3JlZWZqcnl2bWV3aWh1YnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTAzNjMsImV4cCI6MjA3OTY2NjM2M30.KZf7EyVhsJa_7vC9hReoLPmw_tl-jVZ5qd1JtR_Udhs'

export const supabase = createClient(supabaseUrl, supabaseKey)
