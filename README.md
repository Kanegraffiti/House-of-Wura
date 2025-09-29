# House of Wura

Luxury event planning and fashion house website built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Feature Highlights

- Editorial homepage with hero, services, testimonials, and Instagram grid
- Dedicated pages for services, shop catalogue, lookbook, about, contact, privacy, and terms
- WhatsApp-first engagement including floating chat button and prefilled CTAs
- Fast, RAG-powered AI stylist assistant that streams replies from the Edge on demand
- Huly-inspired motion system with magnetic buttons, tilt cards, and smooth page transitions
- Client-side cart that assembles looks and now checks out via WhatsApp with signed order IDs
- Order storage, proof uploads, and admin dashboard powered by Vercel Blob (no traditional DB)
- Protected admin area to review orders, update statuses, and reply to customers from WhatsApp templates
- Responsive layout with refined typography (Playfair Display & Inter) and a luxury palette
- JSON-LD organisation schema, Open Graph metadata, sitemap, and robots configuration for SEO
- Accessibility-conscious interactions with focus rings, reduced-motion guards, and descriptive alt text

## Motion & Interaction Guidelines

- **Design tokens:** durations live in CSS variables (`--dur-1`…`--dur-4`) with easing curves exposed to Tailwind as `ease-std`, `ease-emph`, `ease-in`, and `ease-out`. Prefer 150–300ms transitions.
- **Global transitions:** body copy and link highlights rely on transform/opacity animations only. Keep hover effects lightweight (scale ≤ 1.03).
- **Route & section reveals:** wrap new sections in `<Reveal delay={...}>` to opt into the IntersectionObserver-powered fade/slide. Vary delays (0–0.25s) for staggered lists.
- **Reduced motion:** motion utilities automatically respect `prefers-reduced-motion`. If you add custom animations, call `useReducedMotion()` and fall back to static rendering.
- **Skeletons & loading:** use `components/ui/Skeleton` for perceived performance. Dedicated `loading.tsx` files exist for the homepage, shop, and lookbook—mirror their patterns for new routes.
- **Performance guardrails:** animate opacity and transforms only, limit simultaneous elements ≤ 12, and avoid chaining long-running animations.

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
GROQ_API_KEY=optional-groq-key
NEXT_PUBLIC_WA_NUMBER=2349060294599
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/_houseofwurafashions
NEXT_PUBLIC_SITE_URL=https://houseofwura.vercel.app
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=generate-a-long-random-string
BLOB_READ_WRITE_TOKEN=vercel-blob-rw-token
```

- `OPENAI_API_KEY` powers the embedding build script and is used by the chat route when a Groq key isn't supplied.
- `GROQ_API_KEY` (optional) enables the chat route to use Groq's Llama 3.1 models. If omitted the app falls back to OpenAI.
- `NEXT_PUBLIC_WA_NUMBER` should be digits only (no plus sign). All WhatsApp links are generated from this value.
- `NEXT_PUBLIC_INSTAGRAM_URL` powers footer links and the floating Instagram button.
- `NEXT_PUBLIC_SITE_URL` is used for sitemap/robots metadata and sharing links.
- `ADMIN_PASSWORD` secures the `/admin/login` route. Set this in Vercel → Project Settings → Environment Variables (do not commit secrets).
- `JWT_SECRET` signs the admin session cookie. Use a 32+ character random value.
- `BLOB_READ_WRITE_TOKEN` is required for Vercel Blob access (Project → Storage → Blob → “Create Token”).

> ℹ️ Never expose server-only values to the browser. Only `NEXT_PUBLIC_*` variables are available client-side.

## WhatsApp Checkout & Order Lifecycle

1. Guests curate looks in the cart. Quantities, colour, and size selections are stored in `localStorage` until checkout.
2. On checkout the client generates an order payload, requests `/api/orders`, and receives a ULID-backed order ID (`ow_01…`).
3. The order JSON (items, customer contact, notes, displayed subtotal) is stored at `orders/{orderId}.json` in Vercel Blob with `status=PENDING`.
4. The shopper is redirected to `/order/{orderId}`, a public page that shows their status, instructions, and a proof uploader. A WhatsApp deep link opens automatically with a concise summary that includes the order ID.
5. Proof uploads (images or PDF ≤5MB) hit `/api/orders/{orderId}/proof`. Each file streams directly to `proofs/{orderId}/…` in Blob and the order JSON is patched with URLs, reference notes, timestamps, and `status=PROOF_SUBMITTED`.
6. Once an admin confirms payment the status is updated to `CONFIRMED`. Rejections capture a reason and log `rejectedAt` timestamps.

Cart data, contact preferences, and the latest order ID remain client-only for convenience.

### Order States

- `PENDING` – awaiting proof upload
- `PROOF_SUBMITTED` – proof received and awaiting review
- `CONFIRMED` – payment verified
- `REJECTED` – admin rejected or needs action (stores `rejectReason`)

## Admin Dashboard

- `/admin/login` prompts for the `ADMIN_PASSWORD` and issues an HTTP-only JWT cookie signed with `JWT_SECRET`.
- `/admin` lists recent orders with filters for status and query search (order ID, SKU, contact details, notes). Refresh or apply filters without leaving the page.
- `/admin/orders/{orderId}` surfaces full order details, proof previews, contact info, and actions:
  - Confirm payment (sets `status=CONFIRMED`, logs `confirmedAt`)
  - Mark proof received / request new proof (toggling between `PROOF_SUBMITTED` and `PENDING`)
  - Reject with a custom reason (sets `status=REJECTED`, logs `rejectedAt`)
  - One-click WhatsApp replies for confirmation, reminders, or rejection messaging using the customer’s saved number

All admin routes and mutating API endpoints are protected by `middleware.ts`, which checks the signed cookie and redirects unauthenticated visitors to `/admin/login`.

## Blob Storage Setup

Vercel Blob is the only persistence layer. To configure:

1. In Vercel, open **Storage → Blob** and create a Read/Write token. Paste it into `BLOB_READ_WRITE_TOKEN`.
2. Deploy or run locally with the same token so `@vercel/blob` can list, read, and write private files.
3. Orders live under `orders/`. Proof uploads live under `proofs/{orderId}/`. All assets are private by default.
4. JSON helpers in `lib/blob.ts` handle parsing and minimal logging. Avoid storing sensitive financial data; only the submitted proof URLs and customer contact preference are recorded.

## Cart & WhatsApp Experience

- Cart drawer and `/cart` page offer full editing controls, subtotal preview, and a prominent “Checkout via WhatsApp” button.
- Checkout validates contact preference (WhatsApp or email) before creating the order. When successful it:
  - Clears the cart
  - Stores `{orderId, createdAt}` in `localStorage` (`wura_last_order`) for quick access
  - Dispatches a custom `wura:last-order` event so the header updates the “Latest order” link instantly
  - Opens WhatsApp with a compact summary listing order ID, line items, and customer contact details
- `/order/{orderId}` reminds guests to mention the order ID if they message manually, shows previously uploaded proofs, and offers another WhatsApp shortcut.

## Deployment Checklist

1. Connect the repository to Vercel and select the Next.js preset (Node.js 20 runtime).
2. Add all environment variables listed above to the project (Production + Preview as needed).
3. Enable Vercel Blob and create a Read/Write token.
4. Deploy – the app uses Next.js App Router with dynamic rendering for order pages and admin API endpoints.

## Security Notes

- Only the shopper-facing `/order/{orderId}` route is public. It supports proof uploads without exposing Blob tokens.
- Admin cookies are HTTP-only, SameSite=Lax, and (in production) `Secure`. Rotate `JWT_SECRET` if compromised.
- Proof uploads are validated server-side for MIME type and size (≤5MB). Add extra rate limiting via middleware or edge functions if needed.
- No payment processing or fintech integrations are included; all settlement happens off-platform.

## Updating the Shop Catalogue

Edit `data/products.json` to adjust the shop grid. Each product supports:

- `id`, `title`, `slug`, `priceFrom`, `category`
- `colors` (array of strings)
- `sizes` (array of strings)
- `images` (array of remote URLs)
- `description`, `tags`, `sku`

Product cards automatically pick up changes and include colour/size selectors that prefill WhatsApp enquiries.

## AI Helper (RAG) Setup

1. Edit or add Markdown files in `data/knowledge/` to capture brand storytelling, services, policies, sizing, care, shipping, and FAQ details.
2. Run `pnpm embed` to generate `data/embeddings.json` with OpenAI's `text-embedding-3-small` model. Commit the output for deterministic retrieval or regenerate whenever content changes.
3. Deploy with `OPENAI_API_KEY` set. The Edge route at `/api/chat` streams responses using Vercel AI SDK and retrieved knowledge snippets.
4. Optional: upload the generated embeddings to Vercel Blob if you prefer runtime storage outside the repo.

### Performance & Motion Notes

- The chat widget is dynamically imported, prefetched after idle (respecting `navigator.connection.saveData`), and only mounts after user intent or viewport visibility.
- Responses stream from the Edge for first-token latency under a second on broadband connections.
- Motion utilities in `lib/motion.ts` centralise easing and respect `prefers-reduced-motion`. 3D tilt cards and magnetic buttons only engage on pointer devices for accessibility.

## License

Proprietary — contact House of Wura for usage permissions.
