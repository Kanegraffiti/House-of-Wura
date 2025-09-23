'use client';

import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { waLink } from '@/lib/wa';

const SERVICE_OPTIONS = [
  'Luxury Wedding Planning',
  'Fashion Styling & Couture',
  'Corporate or Brand Event',
  'Private Celebration',
  'Other'
];

interface LeadEntry {
  name: string;
  service: string;
  messagePreview: string;
  ts: number;
}

export function ContactForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [leads, setLeads] = useState<LeadEntry[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(window.localStorage.getItem('wura_leads') || '[]') as LeadEntry[];
      setLeads(stored.slice(-5).reverse());
    } catch (error) {
      console.error('Unable to read leads log', error);
    }
  }, []);

  const resetForm = () => {
    setName('');
    setContact('');
    setService(SERVICE_OPTIONS[0]);
    setMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: name.trim() || 'Guest',
      contact: contact.trim() || 'Not provided',
      service,
      message: message.trim() || 'No additional message'
    };

    const waMessage = `New enquiry:\nName: ${payload.name}\nContact: ${payload.contact}\nService: ${payload.service}\nMessage: ${payload.message}`;

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(window.localStorage.getItem('wura_leads') || '[]') as LeadEntry[];
        const entry: LeadEntry = {
          name: payload.name,
          service: payload.service,
          messagePreview: payload.message.slice(0, 80),
          ts: Date.now()
        };
        const updated = [...existing, entry].slice(-20);
        window.localStorage.setItem('wura_leads', JSON.stringify(updated));
        setLeads(updated.slice(-5).reverse());
      } catch (error) {
        console.error('Unable to save lead log', error);
      }
      window.open(waLink(waMessage), '_blank', 'noopener,noreferrer');
    }

    resetForm();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-[0_30px_80px_rgba(11,11,11,0.08)]">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-wura-black/70">
            Your name
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="contact" className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-wura-black/70">
            WhatsApp number or email
          </label>
          <Input
            id="contact"
            name="contact"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="234XXXXXXXXXX or email"
            required
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="service" className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-wura-black/70">
            Service interested in
          </label>
          <div className="relative">
            <select
              id="service"
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="w-full appearance-none rounded-full border border-wura-black/15 bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.3em] text-wura-black focus:border-wura-gold focus:outline-none"
            >
              {SERVICE_OPTIONS.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-wura-black/70">
            Tell us about your vision
          </label>
          <Textarea
            id="message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Share key details, dates, locations, aesthetics..."
          />
        </div>
        <Button type="submit" className="w-full">
          Send via WhatsApp
        </Button>
        <p className="text-xs text-wura-black/50">
          Clicking send opens WhatsApp in a new tab. We store an optional enquiry log in your browser only.
        </p>
      </form>
      <aside className="space-y-4 rounded-3xl border border-wura-black/10 bg-wura-black/5 p-6">
        <h3 className="font-display text-xl text-wura-black">Recent enquiries (private)</h3>
        {leads.length === 0 ? (
          <p className="text-sm text-wura-black/50">
            Your browser will display the last few enquiries you submit. No data leaves your device.
          </p>
        ) : (
          <ul className="space-y-3 text-sm text-wura-black/70">
            {leads.map((lead) => (
              <li key={lead.ts} className="rounded-2xl bg-white/70 p-3">
                <p className="font-semibold text-wura-black">{lead.service}</p>
                <p className="text-xs text-wura-black/60">{lead.messagePreview || 'No message added'}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-wura-black/40">
                  {new Date(lead.ts).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
