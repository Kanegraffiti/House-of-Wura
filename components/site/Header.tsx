'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
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
    <header className="sticky top-0 z-50 border-b border-wura-black/10 bg-white/90 backdrop-blur-xl">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-display text-2xl tracking-widest text-wura-black">
          House of Wura
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      <span
                        className="relative"
                        style={{
                          color: pathname === item.href ? '#7B002C' : undefined
                        }}
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
              WhatsApp
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <CartIcon className="h-10 border-wura-black/10 px-3 text-xs" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="flex items-center justify-center rounded-md border border-wura-gold/30 p-2 text-wura-black transition hover:border-wura-gold focus:outline-none focus:ring-2 focus:ring-wura-gold focus:ring-offset-2 focus:ring-offset-white"
                onClick={() => setOpen(true)}
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-xs">
              <div className="mt-16 flex flex-col gap-6">
                <Link href="/" className="font-display text-2xl text-wura-black">
                  House of Wura
                </Link>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm font-semibold uppercase tracking-[0.3em] text-wura-black"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <Button className="w-full" asChild>
                  <Link href={waLink(HERO_MESSAGE)} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-wura-gold" asChild onClick={() => setOpen(false)}>
                  <Link href="/cart">Review cart</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
