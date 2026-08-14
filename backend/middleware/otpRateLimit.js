// In-memory rate limiting for OTP request/verify endpoints, keyed by phone number (primary
// abuse vector) and falling back to IP for unparseable input. This is process-local -- fine for
// a single backend instance / local dev. For a multi-instance production deployment, swap the
// Map below for a shared store (Redis) so limits are enforced across all instances.

const buckets = new Map(); // key -> { count, firstAttemptAt, blockedUntil }

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds between OTP sends for the same phone

function cleanup() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.firstAttemptAt > WINDOW_MS && (!bucket.blockedUntil || bucket.blockedUntil < now)) {
      buckets.delete(key);
    }
  }
}

function checkAndIncrement(key, { maxAttempts, cooldownMs }) {
  cleanup();
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { count: 0, firstAttemptAt: now, lastAttemptAt: 0, blockedUntil: null };
    buckets.set(key, bucket);
  }

  if (bucket.blockedUntil && bucket.blockedUntil > now) {
    return { allowed: false, reason: 'rate_limited', retryAfterMs: bucket.blockedUntil - now };
  }

  if (cooldownMs && now - bucket.lastAttemptAt < cooldownMs) {
    return { allowed: false, reason: 'cooldown', retryAfterMs: cooldownMs - (now - bucket.lastAttemptAt) };
  }

  if (now - bucket.firstAttemptAt > WINDOW_MS) {
    bucket.count = 0;
    bucket.firstAttemptAt = now;
  }

  bucket.count += 1;
  bucket.lastAttemptAt = now;

  if (bucket.count > maxAttempts) {
    bucket.blockedUntil = now + WINDOW_MS;
    return { allowed: false, reason: 'rate_limited', retryAfterMs: WINDOW_MS };
  }

  return { allowed: true };
}

const otpRequestLimiter = (req, res, next) => {
  const key = `req:${req.body?.phone || req.ip}`;
  const result = checkAndIncrement(key, { maxAttempts: 5, cooldownMs: RESEND_COOLDOWN_MS });
  if (!result.allowed) {
    return res.status(429).json({
      message: result.reason === 'cooldown'
        ? 'Please wait before requesting another code.'
        : 'Too many code requests. Please try again later.',
      retryAfterSeconds: Math.ceil(result.retryAfterMs / 1000),
    });
  }
  next();
};

const otpVerifyLimiter = (req, res, next) => {
  const key = `verify:${req.body?.phone || req.ip}`;
  const result = checkAndIncrement(key, { maxAttempts: 8, cooldownMs: 0 });
  if (!result.allowed) {
    return res.status(429).json({
      message: 'Too many verification attempts. Please request a new code.',
      retryAfterSeconds: Math.ceil(result.retryAfterMs / 1000),
    });
  }
  next();
};

module.exports = { otpRequestLimiter, otpVerifyLimiter };
