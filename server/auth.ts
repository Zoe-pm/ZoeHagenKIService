import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-key';

export interface JWTPayload {
  type: 'admin' | 'test';
  email: string;
  exp: number;
}

export function generateAdminToken(email: string): string {
  const expiresIn = '24h';
  const payload: JWTPayload = {
    type: 'admin',
    email,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, SESSION_SECRET, { expiresIn });
}

export function generateTestToken(email: string): string {
  const expiresIn = '72h';
  const payload: JWTPayload = {
    type: 'test', 
    email,
    exp: Math.floor(Date.now() / 1000) + (72 * 60 * 60) // 72 hours
  };
  
  return jwt.sign(payload, SESSION_SECRET, { expiresIn });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as JWTPayload;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromAuth(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Admin password - in production this should be from environment
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';