import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xwhznrqjsytgyupfsqxd.supabase.co'
const SUPABASE_KEY = 'sb_publishable_SkwBazBbfVxuA1dEMAdRdQ_vbRpHYNK'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)