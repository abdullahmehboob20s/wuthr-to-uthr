import { createClient } from '@supabase/supabase-js'

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY required")

const supabaseUrl = process.env.SUPABASE_PROJECT_URL!
const supabaseKey = process.env.SUPABASE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)