'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Trash2, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ProofUploaderProps {
  orderId: string;
  reference?: string | null;
  onUploaded?: () => void;
}

type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; current: number; total: number }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

function fileAllowed(file: File) {
  return file.type.startsWith('image/') || file.type === 'application/pdf';
}

function describeFile(file: File) {
  const sizeKb = Math.round(file.size / 1024);
  return `${file.name} · ${sizeKb}KB`;
}

export default function ProofUploader({ orderId, reference: initialReference = '', onUploaded }: ProofUploaderProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [reference, setReference] = useState(initialReference || '');
  const [state, setState] = useState<UploadState>({ status: 'idle' });

  useEffect(() => {
    setReference(initialReference || '');
  }, [initialReference]);

  const previews = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      isImage: file.type.startsWith('image/'),
      url: URL.createObjectURL(file)
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const accepted: File[] = [];
    const errors: string[] = [];

    Array.from(list).forEach((file) => {
      if (!fileAllowed(file)) {
        errors.push(`${file.name} is not a supported type.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} is larger than 5MB.`);
        return;
      }
      accepted.push(file);
    });

    setFiles((prev) => [...prev, ...accepted]);
    if (errors.length) {
      setState({ status: 'error', message: errors.join(' ') });
    } else {
      setState({ status: 'idle' });
    }
  };

  const clearSelection = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setState({ status: 'idle' });
  };

  const upload = async () => {
    if (!files.length) {
      setState({ status: 'error', message: 'Select at least one proof file before uploading.' });
      return;
    }

    setState({ status: 'uploading', current: 0, total: files.length });

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const formData = new FormData();
      formData.append('file', file);
      if (reference.trim()) {
        formData.append('reference', reference.trim());
      }

      const response = await fetch(`/api/orders/${orderId}/proof`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        setState({ status: 'error', message: data?.error || 'Upload failed. Please try again.' });
        return;
      }
      setState({ status: 'uploading', current: index + 1, total: files.length });
    }

    clearSelection();
    setState({ status: 'success', message: 'Proof uploaded successfully. Thank you!' });
    setTimeout(() => {
      if (onUploaded) onUploaded();
      router.refresh();
    }, 300);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-wura-black/15 bg-white/90 p-6">
      <div className="space-y-2">
        <label
          htmlFor="proof-upload"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black"
        >
          Upload payment proof
        </label>
        <p className="text-sm text-wura-black/70">
          Accepts clear screenshots, photos, or PDFs up to 5MB each. Multiple files are welcome if needed.
        </p>
      </div>

      <div className="grid gap-3">
        <input
          ref={inputRef}
          id="proof-upload"
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="justify-center gap-2 border-dashed border-wura-black/30 text-wura-black hover:border-wura-gold"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" aria-hidden /> Choose files
        </Button>
        {files.length > 0 && (
          <ul className="grid gap-3 md:grid-cols-2">
            {files.map((file, index) => {
              const preview = previews[index];
              return (
                <li
                  key={`${file.name}-${index}`}
                  className="relative rounded-2xl border border-wura-black/10 bg-white/80 p-3"
                >
                  <div className="flex items-center gap-3">
                    {preview?.isImage ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-wura-black/5">
                        <Image
                          src={preview.url}
                          alt={`${file.name} preview`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-wura-black/5 text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60">
                        PDF
                      </div>
                    )}
                    <div className="flex-1 text-sm text-wura-black/80">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-wura-black/60">{describeFile(file)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-wura-black/60 hover:text-wura-black"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="reference" className="text-xs uppercase tracking-[0.3em] text-wura-black/60">
          Bank reference or note (optional)
        </label>
        <Textarea
          id="reference"
          rows={3}
          placeholder="Reference number or anything Flora should know about the transfer."
          value={reference}
          onChange={(event) => setReference(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={upload}
          disabled={state.status === 'uploading'}
        >
          {state.status === 'uploading' ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Uploading {`${state.current}/${state.total}`}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" aria-hidden />
              Submit proof
            </span>
          )}
        </Button>
        {files.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black sm:w-auto"
            onClick={clearSelection}
          >
            <Trash2 className="h-4 w-4" aria-hidden /> Clear selection
          </Button>
        )}
      </div>

      <p className="text-xs text-wura-black/60" aria-live="polite">
        {state.status === 'uploading' && `Uploading ${state.current}/${state.total}…`}
        {state.status === 'success' && state.message}
        {state.status === 'error' && state.message}
      </p>
    </div>
  );
}
