// f:\my_projects\vlms\server\configs\db.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE; // optional (server-only)

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_PROJECT_URL in environment variables.');
}
if (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

// Prefer service role on the server if provided; otherwise fall back to anon key
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false }, // server-side: no session persistence
    global: { headers: { 'X-Client-Info': 'vlms-server' } },
  }
);

console.log('Supabase client initialized.');

// Keep default export to avoid breaking existing imports
module.exports = supabase;
