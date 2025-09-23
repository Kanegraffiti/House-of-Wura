import { NextRequest, NextResponse } from 'next/server';

import { setAdminCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  await setAdminCookie(response, 'admin');
  return response;
}
