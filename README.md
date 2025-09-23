# House of Wura

Luxury event planning and fashion house website built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Editorial homepage with hero, services, testimonials, and Instagram grid
- Dedicated pages for services, shop catalogue, lookbook, about, contact, privacy, and terms
- WhatsApp-first lead flows including floating chat button, prefilled CTAs, and contact form automation
- Responsive layout with tailored typography (Playfair Display & Inter) and luxury-inspired palette
- JSON-LD organisation schema, Open Graph metadata, sitemap, and robots configuration for SEO
- Local storage log of enquiries (client-side only) to review recent submissions privately

## Getting Started

### Requirements

- Node.js 20 (see `.nvmrc`)
- pnpm (recommended via Corepack)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Visit `http://localhost:3000` to explore the site.

### Linting

```bash
pnpm lint
```

## Environment Variables

Create an `.env.local` file with the following values:

```
NEXT_PUBLIC_WA_NUMBER=234XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://houseofwura.vercel.app
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourhandle
```

- `NEXT_PUBLIC_WA_NUMBER` should be digits only (no plus sign). All WhatsApp links are generated from this value.
- `NEXT_PUBLIC_SITE_URL` is used for metadata, sitemap, and robots output.
- `NEXT_PUBLIC_INSTAGRAM_URL` is optional and powers Instagram links across the site.

## WhatsApp Deep Links

All primary calls-to-action route to WhatsApp using `lib/wa.ts`:

```ts
export function waLink(message: string) {
  const num = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/[^\d]/g, '') || '';
  return `https://wa.me/${num}?text=${encodeURIComponent(message.trim())}`;
}
```

Pass a plain-text message and the helper handles encoding.

## Updating the Shop Catalogue

Edit `data/products.json` to adjust the shop grid. Each product supports:

- `id`, `title`, `slug`, `priceFrom`, `category`
- `colors` (array of strings)
- `sizes` (array of strings)
- `images` (array of remote URLs)
- `description`, `tags`, `sku`

Product cards automatically pick up changes and include colour/size selectors that prefill WhatsApp enquiries with the chosen options.

## Deployment

1. Push this repository to GitHub and connect it to Vercel.
2. In Vercel project settings, set the environment variables listed above.
3. Deploy using the Next.js framework preset (Node.js 20 runtime).

## Accessibility & Performance

- High-contrast colour palette with focus states on interactive elements
- Prefers-reduced-motion support for scroll animations
- Semantic structure with landmarks (`header`, `main`, `footer`) and descriptive alt text
- Vercel Analytics integration for lightweight insights

## License

Proprietary — contact House of Wura for usage permissions.
