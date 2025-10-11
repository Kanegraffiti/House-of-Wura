'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Status =
  | { state: 'idle' }
  | { state: 'uploading' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string };

export default function ProofForm({ orderId }: { orderId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const onSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setStatus({ state: 'error', message: 'File must be 5 MB or less.' });
      event.target.value = '';
      return;
    }
    setStatus({ state: 'idle' });
    setFile(selected);
  };

  const upload = async () => {
    if (!file) {
      setStatus({ state: 'error', message: 'Attach a payment proof before submitting.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStatus({ state: 'uploading' });
    try {
      const response = await fetch(`/api/orders/${orderId}/proof`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Upload failed. Please try again.');
      }
      setStatus({ state: 'success', message: 'Proof uploaded successfully. Thank you!' });
      setFile(null);
    } catch (error) {
      setStatus({
        state: 'error',
        message: error instanceof Error ? error.message : 'Unable to upload proof. Please retry.'
      });
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-wura-black">Upload payment proof</h2>
        <p className="text-sm text-wura-black/70">Share a clear screenshot, bank transfer receipt, or PDF (max 5 MB).</p>
      </div>
      <input type="file" accept="image/*,application/pdf" onChange={onSelect} />
      {file && (
        <p className="text-xs text-wura-black/60">Selected: {file.name}</p>
      )}
      {status.state === 'error' && (
        <p className="text-sm text-wura-wine" role="alert">
          {status.message}
        </p>
      )}
      {status.state === 'success' && (
        <p className="text-sm text-green-700" role="status">
          {status.message}
        </p>
      )}
      <Button
        type="button"
        onClick={upload}
        disabled={status.state === 'uploading'}
        className="w-full rounded-full bg-wura-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-wura-black/90"
      >
        {status.state === 'uploading' ? 'Uploading…' : 'Submit Proof'}
      </Button>
    </div>
  );
}
