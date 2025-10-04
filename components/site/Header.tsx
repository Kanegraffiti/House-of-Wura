'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Container } from '@/components/site/Container';
import { CartIcon } from '@/components/site/CartIcon';
import { waLink } from '@/lib/wa';
import { cn } from '@/lib/utils';
import { motionDur, slideDown, trans } from '@/lib/motion';

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

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 border-b border-wura-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/65"
    >
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="focus-ring font-display text-2xl tracking-widest text-wura-black">
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
                        'focus-ring will-change-transform transition-transform duration-200 ease-std hover:-translate-y-0.5 hover:text-wura-wine'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      <span
                        className={cn(
                          'link-glint inline-block px-1',
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
          <Link
            href={waLink(HERO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-wura-gold/70 bg-wura-wine/10 text-wura-wine transition-transform duration-200 ease-std hover:-translate-y-0.5 hover:bg-wura-wine/20 hover:text-wura-wine"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            <span className="sr-only">Chat on WhatsApp</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <CartIcon className="h-11 w-11 border-wura-black/15 bg-white" />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <motion.button
                type="button"
                aria-label="Open menu"
                className="focus-ring rounded-md border border-wura-gold/40 p-3 text-wura-black transition-transform duration-200 ease-std will-change-transform hover:-translate-y-0.5 hover:border-wura-gold"
                whileTap={{ scale: 0.96 }}
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </motion.button>
            </Dialog.Trigger>
            <AnimatePresence>
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div
                      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: trans(motionDur.sm) }}
                      exit={{ opacity: 0, transition: { duration: motionDur.xs } }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild>
                    <motion.div
                      initial={{ opacity: 0, y: -16 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { type: 'spring', stiffness: 320, damping: 30 }
                      }}
                      exit={{ opacity: 0, y: -12, transition: { duration: motionDur.sm } }}
                      className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white/95 p-6 shadow-[0_28px_60px_rgba(11,11,11,0.28)]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-display text-xl text-wura-black">House of Wura</p>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="focus-ring rounded-full border border-transparent p-3 text-wura-black transition hover:border-wura-gold"
                          >
                            <X className="h-4 w-4" aria-hidden />
                          </button>
                        </Dialog.Close>
                      </div>
                      <nav className="mt-8 flex flex-col gap-4">
                        {navItems.map((item) => (
                          <Dialog.Close asChild key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                'text-sm font-semibold uppercase tracking-[0.3em] text-wura-black transition-colors duration-200 ease-std',
                                pathname === item.href ? 'text-wura-wine' : 'hover:text-wura-wine'
                              )}
                            >
                              <span className="link-glint">{item.label}</span>
                            </Link>
                          </Dialog.Close>
                        ))}
                      </nav>
                      <div className="mt-8 flex flex-col gap-3">
                        <Button className="min-h-[44px] w-full px-5 py-2.5" asChild>
                          <Link href={waLink(HERO_MESSAGE)} target="_blank" rel="noopener noreferrer">
                            <span className="link-glint">Chat on WhatsApp</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="min-h-[44px] w-full border-wura-gold px-5 py-2.5"
                          asChild
                        >
                          <Link href="/cart" onClick={() => setOpen(false)}>
                            Review cart
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </Container>
    </motion.header>
  );
}
