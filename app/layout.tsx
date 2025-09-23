import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Inter, Playfair_Display } from 'next/font/google';

import './globals.css';

import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { WhatsAppFloat } from '@/components/site/WhatsAppFloat';
import { CartProvider } from '@/providers/CartProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'House of Wura',
    template: '%s · House of Wura'
  },
  description: 'House of Wura is a luxury event planning and fashion house crafting couture experiences.',
  openGraph: {
    type: 'website',
    siteName: 'House of Wura',
    url: siteUrl,
    title: 'House of Wura',
    description: 'Luxury event planning and couture fashion.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'House of Wura editorial portrait'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Wura',
    description: 'Luxury event planning and couture fashion.',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80']
  },
  alternates: {
    canonical: '/'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="bg-wura-white text-wura-black antialiased selection:bg-wura-wine/20 focus:outline-none">
        <ToastProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <WhatsAppFloat />
          </CartProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
