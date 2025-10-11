# House of Wura

Luxury event planning and fashion house website built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

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

Create an `.env.local` file and add the following values:

```
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_WA_NUMBER=2349060294599
NEXT_PUBLIC_CONTACT_EMAIL=floraadebisi1999@gmail.com
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/_houseofwurafashions
NEXT_PUBLIC_SITE_URL=https://houseofwura.vercel.app
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=generate-a-long-random-string
BLOB_READ_WRITE_TOKEN=vercel-blob-rw-token
DEBUG_WURA=false
```

- `OPENAI_API_KEY` powers the embedding build script and is required by the chat route.
- `NEXT_PUBLIC_WA_NUMBER` should be digits only (no plus sign). All WhatsApp links are generated from this value.
- `NEXT_PUBLIC_CONTACT_EMAIL` sets the concierge inbox surfaced throughout the cart and order experience.
- `NEXT_PUBLIC_INSTAGRAM_URL` powers footer links and the floating Instagram button.
- `NEXT_PUBLIC_SITE_URL` is used for sitemap/robots metadata and sharing links.
- `ADMIN_PASSWORD` secures the `/admin/login` route. Set this in Vercel → Project Settings → Environment Variables (do not commit secrets).
- `JWT_SECRET` signs the admin session cookie. Use a 32+ character random value.
- `BLOB_READ_WRITE_TOKEN` is required for Vercel Blob access (Project → Storage → Blob → “Create Token”).
- `DEBUG_WURA` (optional) enables verbose server-side logging for troubleshooting during development.

> Never expose server-only values to the browser. Only `NEXT_PUBLIC_*` variables are available client-side.

## License

Proprietary — contact House of Wura for usage permissions.
