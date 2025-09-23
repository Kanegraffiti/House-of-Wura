'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { Container } from '@/components/site/Container';
import { waLink } from '@/lib/wa';
import { CartIcon } from '@/components/site/CartIcon';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

const HERO_MESSAGE = "Hello House of Wura! I'd love to talk about your bespoke services.";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-wura-black/10 bg-white/90 backdrop-blur-xl">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-display text-2xl tracking-widest text-wura-black">
          <span className="inline-block transition-shadow duration-200 [text-shadow:_0_0_0_rgba(201,162,39,0)] hover:[text-shadow:_0_0_24px_rgba(201,162,39,0.3)]">
            House of Wura
          </span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle,
                        'transition-all duration-200 ease-std hover:text-wura-wine'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      <span
                        className={cn(
                          'link-glint inline-block px-1 transition-colors duration-200 ease-std',
                          pathname === item.href && 'text-wura-wine'
                        )}
                      >
                        {item.label}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <CartIcon />
          <Button variant="outline" className="border-wura-gold" asChild>
            <Link href={waLink(HERO_MESSAGE)} target="_blank" rel="noopener noreferrer">
              <span className="link-glint">WhatsApp</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <CartIcon className="h-10 border-wura-black/10 px-3 text-xs" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={open}
                className="flex items-center justify-center rounded-md border border-wura-gold/40 p-2 text-wura-black transition-all duration-150 ease-std hover:border-wura-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Menu
                  aria-hidden="true"
                  className={cn(
                    'h-5 w-5 transition-transform duration-150 ease-std',
                    open && 'rotate-90'
                  )}
                />
              </button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="h-auto max-h-[80vh] overflow-y-auto border-none bg-white/95 text-wura-black shadow-[0_24px_60px_rgba(11,11,11,0.18)] sm:max-w-full"
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scaleY: 0.98 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                style={{ originY: 0 }}
                className="mt-16 flex flex-col gap-6"
              >
                <Link href="/" className="font-display text-2xl text-wura-black">
                  House of Wura
                </Link>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'text-sm font-semibold uppercase tracking-[0.3em] text-wura-black transition-colors duration-200 ease-std',
                          pathname === item.href && 'text-wura-wine'
                        )}
                      >
                        <span className="link-glint">{item.label}</span>
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <Button className="w-full" asChild>
                  <Link href={waLink(HERO_MESSAGE)} target="_blank" rel="noopener noreferrer">
                    <span className="link-glint">Chat on WhatsApp</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-wura-gold"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">Review cart</Link>
                </Button>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
