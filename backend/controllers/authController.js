const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { supabasePublic, supabaseAdmin } = require('../config/supabaseClient');
const AuthAuditLog = require('../models/AuthAuditLog');
const Profile = require('../models/Profile');

function normalizePhone(rawPhone, defaultCountry) {
  const parsed = parsePhoneNumberFromString(rawPhone || '', defaultCountry || undefined);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number; // E.164, e.g. +14155552671
}

async function audit(eventType, { userId = null, phone = null, req, metadata = {} } = {}) {
  try {
    await AuthAuditLog.create({
      userId,
      phone,
      eventType,
      ipAddress: req?.ip || null,
      userAgent: req?.headers?.['user-agent'] || null,
      metadata,
    });
  } catch (err) {
    // Auditing must never break the auth flow itself.
    console.error('[auth audit] failed to record event', eventType, err.message);
  }
}

// --- Phone OTP (primary auth path) -----------------------------------------------------

// POST /api/auth/otp/request  { phone, countryCode? }
exports.requestOtp = async (req, res) => {
  const { phone: rawPhone, countryCode } = req.body;
  const phone = normalizePhone(rawPhone, countryCode);

  // Always return the same generic response whether or not the number is valid/registered,
  // to avoid phone-number enumeration. Only log server-side why it was actually rejected.
  const genericResponse = { message: 'If this number can receive a code, one has been sent.' };

  if (!phone) {
    await audit('otp_failed', { req, metadata: { reason: 'invalid_phone', rawPhone } });
    return res.status(200).json(genericResponse);
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return res.status(503).json({
      message: 'Phone sign-in is not configured yet. Set SUPABASE_URL/SUPABASE_ANON_KEY and an SMS provider in your Supabase project.',
    });
  }

  const { error } = await supabasePublic.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true },
  });

  if (error) {
    await audit('otp_failed', { phone, req, metadata: { reason: error.message } });
    // Still generic to the client -- Supabase's own provider errors (e.g. SMS provider down)
    // are logged, not exposed, except as a generic failure.
    return res.status(502).json({ message: 'Could not send the code right now. Please try again shortly.' });
  }

  await audit('otp_requested', { phone, req });
  return res.status(200).json(genericResponse);
};

// POST /api/auth/otp/verify  { phone, token, countryCode? }
exports.verifyOtp = async (req, res) => {
  const { phone: rawPhone, token, countryCode } = req.body;
  const phone = normalizePhone(rawPhone, countryCode);

  if (!phone || !token) {
    return res.status(400).json({ message: 'Phone number and code are required' });
  }

  const { data, error } = await supabasePublic.auth.verifyOtp({ phone, token, type: 'sms' });

  if (error || !data?.session) {
    await audit('otp_failed', { phone, req, metadata: { reason: error?.message || 'no_session' } });
    return res.status(401).json({ message: 'Invalid or expired code' });
  }

  const { session, user } = data;
  await audit('otp_verified', { userId: user.id, phone, req });

  const profile = await Profile.findByPk(user.id);

  return res.status(200).json({
    message: 'Signed in',
    session: {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
    },
    user: { id: user.id, phone: user.phone },
    profile: profile ? {
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      onboardingState: profile.onboardingState,
    } : { onboardingState: 'new' },
  });
};

// POST /api/auth/session/refresh  { refreshToken }
exports.refreshSession = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' });

  const { data, error } = await supabasePublic.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data?.session) {
    return res.status(401).json({ message: 'Session could not be refreshed, please sign in again' });
  }

  await audit('session_refresh', { userId: data.user?.id, req });

  return res.status(200).json({
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  });
};

// POST /api/auth/logout -- revokes the session tied to the presented access token
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(200).json({ message: 'Logged out' });

  await supabaseAdmin.auth.admin.signOut(token, 'local').catch(() => null);
  await audit('logout', { userId: req.user?.id, req });
  return res.status(200).json({ message: 'Logged out' });
};

// POST /api/auth/logout-all -- revokes every session/device for the current user
exports.logoutAllDevices = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  const { error } = await supabaseAdmin.auth.admin.signOut(token, 'global');
  if (error) return res.status(500).json({ message: 'Could not sign out of all devices' });

  await audit('logout_all', { userId: req.user?.id, req });
  return res.status(200).json({ message: 'Signed out of all devices' });
};

// POST /api/auth/phone/change/request  { newPhone, countryCode? } (requires auth)
exports.requestPhoneChange = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const newPhone = normalizePhone(req.body.newPhone, req.body.countryCode);
  if (!newPhone) return res.status(400).json({ message: 'Invalid phone number' });

  const { error } = await supabaseAdmin.auth.admin.updateUserById(req.user.id, { phone: newPhone });
  if (error) return res.status(400).json({ message: 'Could not start phone number change' });

  await audit('phone_change_requested', { userId: req.user.id, phone: newPhone, req });
  return res.status(200).json({ message: 'A verification code was sent to the new number' });
};

// POST /api/auth/phone/change/confirm  { newPhone, token, countryCode? } (requires auth)
exports.confirmPhoneChange = async (req, res) => {
  const newPhone = normalizePhone(req.body.newPhone, req.body.countryCode);
  const { token } = req.body;
  if (!newPhone || !token) return res.status(400).json({ message: 'Phone number and code are required' });

  const { error } = await supabasePublic.auth.verifyOtp({ phone: newPhone, token, type: 'phone_change' });
  if (error) return res.status(401).json({ message: 'Invalid or expired code' });

  await Profile.update({ phone: newPhone }, { where: { id: req.user.id } });
  await audit('phone_change_confirmed', { userId: req.user.id, phone: newPhone, req });
  return res.status(200).json({ message: 'Phone number updated' });
};

// --- Email/password (secondary, linkable identity) --------------------------------------

// POST /api/auth/register  { fullName, email, password }
exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    // Don't reveal whether the email is already registered vs. some other failure.
    return res.status(400).json({ message: 'Registration failed' });
  }

  await Profile.upsert({ id: data.user.id, fullName });

  const { data: signInData, error: signInError } = await supabasePublic.auth.signInWithPassword({ email, password });
  if (signInError || !signInData?.session) {
    return res.status(201).json({ message: 'Account created, please sign in' });
  }

  await audit('login', { userId: data.user.id, req, metadata: { method: 'register' } });

  return res.status(201).json({
    message: 'Account created',
    user: { id: data.user.id, email, fullName },
    session: {
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      expiresAt: signInData.session.expires_at,
    },
  });
};

// POST /api/auth/login  { email, password }
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });
  if (error || !data?.session) {
    await audit('otp_failed', { req, metadata: { reason: 'password_login_failed', email } });
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  await audit('login', { userId: data.user.id, req, metadata: { method: 'password' } });

  return res.status(200).json({
    message: 'Login successful',
    user: { id: data.user.id, email: data.user.email },
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  });
};

// --- Account deletion ---------------------------------------------------------------------

// DELETE /api/auth/account (requires auth)
exports.deleteAccount = async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(req.user.id);
  if (error) return res.status(500).json({ message: 'Account deletion failed' });

  await audit('logout_all', { userId: req.user.id, req, metadata: { reason: 'account_deleted' } });
  return res.status(200).json({ message: 'Account deleted' });
};

module.exports.normalizePhone = normalizePhone;
