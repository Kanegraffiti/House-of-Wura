'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { waLink } from '@/lib/wa';

const DEFAULT_MESSAGE = "Hello House of Wura! I'd love to plan something extraordinary.";

export function WhatsAppFloat() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <Button className="shadow-glow" aria-label="Chat on WhatsApp" asChild>
        <Link href={waLink(DEFAULT_MESSAGE)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" aria-hidden />
          <span className="link-glint">Chat on WhatsApp</span>
        </Link>
      </Button>
    </div>
  );
}
