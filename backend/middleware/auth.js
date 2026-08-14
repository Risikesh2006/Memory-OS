const jwt = require('jsonwebtoken');
const { createRemoteJWKSet, jwtVerify } = require('jose');

// Supabase Auth signs session tokens one of two ways depending on when the project was created:
//  - Legacy projects: a shared HS256 secret (Project Settings -> API -> JWT Secret).
//  - Newer projects (and anything using the new sb_publishable_/sb_secret_ key format): an
//    asymmetric signing key, verifiable via the project's public JWKS endpoint -- no secret
//    needed, since it's a public/private keypair.
// We support both: if SUPABASE_JWT_SECRET is set, verify locally (fast, no network call).
// Otherwise, fetch and cache the project's JWKS and verify against that.
let remoteJwks = null;
function getRemoteJwks() {
  if (!remoteJwks) {
    if (!process.env.SUPABASE_URL) {
      throw new Error('SUPABASE_URL is not configured');
    }
    remoteJwks = createRemoteJWKSet(new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`));
  }
  return remoteJwks;
}

async function verifySupabaseToken(token) {
  if (process.env.SUPABASE_JWT_SECRET) {
    return jwt.verify(token, process.env.SUPABASE_JWT_SECRET, { algorithms: ['HS256'] });
  }
  const { payload } = await jwtVerify(token, getRemoteJwks());
  return payload;
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = await verifySupabaseToken(token);
    req.user = {
      id: decoded.sub,
      phone: decoded.phone || null,
      email: decoded.email || null,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
