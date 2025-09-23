import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'insecure-dev-secret-change-me';
const secret = new TextEncoder().encode(secretKey);

export const ADMIN_COOKIE = 'wura_admin';
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function setAdminCookie(res: NextResponse, username = 'admin') {
  const jwt = await new SignJWT({ sub: username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  const parts = [
    `${ADMIN_COOKIE}=${jwt}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${WEEK_IN_SECONDS}`
  ];
  if (process.env.NODE_ENV !== 'development') {
    parts.push('Secure');
  }

  res.headers.append('Set-Cookie', parts.join('; '));
}

export async function clearAdminCookie(res: NextResponse) {
  const parts = [
    `${ADMIN_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];
  if (process.env.NODE_ENV !== 'development') {
    parts.push('Secure');
  }
  res.headers.append('Set-Cookie', parts.join('; '));
}

export async function getAdminFromCookie(cookies: string | null) {
  if (!cookies) return null;
  const token = cookies
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ADMIN_COOKIE}=`))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function isAdminRequest(request: Request) {
  const cookies = request.headers.get('cookie');
  const payload = await getAdminFromCookie(cookies);
  return Boolean(payload && payload.role === 'admin');
}
