'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Invalid credentials');
      }
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl text-wura-black">Admin login</h1>
        <p className="text-sm text-wura-black/70">Protected access for the House of Wura concierge team.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <p className="rounded-2xl bg-wura-wine/10 p-3 text-sm text-wura-wine" role="alert">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Signing in…
            </span>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
      <p className="text-center text-xs text-wura-black/50">
        Password is configured via the <code className="rounded bg-wura-black/5 px-2 py-1">ADMIN_PASSWORD</code> environment variable.
      </p>
    </div>
  );
}
