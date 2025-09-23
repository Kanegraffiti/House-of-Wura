import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getAdminFromCookie } from '@/lib/auth';

const ADMIN_LOGIN_PATH = '/admin/login';

async function isAdmin(req: NextRequest) {
  const cookies = req.headers.get('cookie');
  const admin = await getAdminFromCookie(cookies);
  return Boolean(admin);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const authed = await isAdmin(req);

    if (!authed && pathname !== ADMIN_LOGIN_PATH) {
      const url = req.nextUrl.clone();
      url.pathname = ADMIN_LOGIN_PATH;
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    if (authed && pathname === ADMIN_LOGIN_PATH) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/api/orders')) {
    if (req.method === 'POST' && pathname === '/api/orders') {
      return NextResponse.next();
    }
    if (pathname.match(/^\/api\/orders\/[^/]+\/proof/)) {
      return NextResponse.next();
    }
    if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      return NextResponse.next();
    }

    const authed = await isAdmin(req);
    if (!authed) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/orders/:path*']
};
