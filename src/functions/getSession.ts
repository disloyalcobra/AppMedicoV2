import type { AstroCookies } from 'astro';

export interface SessionUser {
  userId: number;
  roleId: number;
  firstName: string;
  lastName: string;
}

/**
 * Mocks reading a signed session cookie. 
 * In production, you would verify a JWT with jose or similar.
 */
export function getSession(cookies: AstroCookies): SessionUser | null {
  const sessionCookie = cookies.get('session');
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    // Expected format: base64 string of JSON
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    return JSON.parse(decoded) as SessionUser;
  } catch (error) {
    console.error('Failed to parse session cookie', error);
    return null;
  }
}
