const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.warn(
    `[supabase] Missing env vars: ${missing.join(', ')}. Auth/AI endpoints that depend on ` +
    'Supabase will fail until these are set in backend/.env (see .env.example).'
  );
}

// Public/anon client: safe for user-facing auth operations (OTP request/verify, session
// refresh). Never used for anything that needs to bypass Row Level Security.
const supabasePublic = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Service-role client: server-only, bypasses RLS. Never expose this key or this client to the
// frontend/mobile app -- it is only imported by backend controllers/services.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

module.exports = { supabasePublic, supabaseAdmin };
