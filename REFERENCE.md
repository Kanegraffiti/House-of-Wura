# House of Wura Code Reference

## App Router (`app/`)
- `layout.tsx` wires global fonts, wraps the `ToastProvider` and `CartProvider`, and renders the shared `Header`, `Footer`, and floating chat widget around every page. 【F:app/layout.tsx†L1-L54】
- `page.tsx` is the editorial homepage with the hero slideshow, services grid, featured products, testimonials, and Instagram feed. It pulls data from `data/products.json` and shared media helpers. 【F:app/page.tsx†L1-L153】
- Content pages such as `about/page.tsx`, `services/page.tsx`, `lookbook/page.tsx`, `shop/page.tsx`, `cart/page.tsx`, and `contact/page.tsx` follow the same section/Reveal pattern and reuse the site components for layout polish. The shop route also surfaces the cart summary bar and product cards fed by `data/products.json`. 【F:app/shop/page.tsx†L1-L42】
- Order tracking lives under `order/[orderId]/page.tsx`, while legal copy is in `privacy/page.tsx` and `terms/page.tsx`. Loading fallbacks (`loading.tsx`) and the route template (`template.tsx`) keep transitions smooth. Metadata helpers include `sitemap.ts`, `robots.ts`, and the JSON-LD injection inside `page.tsx`.
- API handlers under `app/api/` cover chat streaming, cart checkout, and order management. The `middleware.ts` file protects `/admin` routes and sensitive order endpoints by checking the admin session cookie. 【F:middleware.ts†L1-L47】

## Components (`components/`)
- `components/site/` holds the polished UI building blocks: navigation (`Header.tsx`), footer (`Footer.tsx`), hero slideshow, reveal animations, parallax wrapper, tilt cards, magnetic buttons, Instagram grid, WhatsApp utilities, and the `ChatWidget` ensemble. 【F:components/site/Header.tsx†L1-L120】【F:components/site/Footer.tsx†L1-L78】【F:components/site/ChatWidget.tsx†L1-L124】
- `components/site/ChatWidgetPanel.tsx` contains the streamed assistant conversation UI, skeleton state, and WhatsApp fallback. 【F:components/site/ChatWidgetPanel.tsx†L1-L120】
- `components/ui/` wraps shadcn/ui primitives (buttons, cards, dialogs, navigation menu, sheet, inputs, skeleton) with the House of Wura styling. 【F:components/ui/card.tsx†L1-L16】【F:components/ui/button.tsx†L1-L40】
- `components/admin/` provides the admin dashboard and order detail views, while `components/lookbook/LookbookFigure.tsx` renders gallery imagery. 【F:components/admin/AdminDashboard.tsx†L1-L40】【F:components/lookbook/LookbookFigure.tsx†L1-L48】

## Data & Content (`data/`)
- `products.json` seeds the shop grid and homepage highlights, while `media.json` and `lib/media.ts` centralise remote asset metadata. 【F:data/products.json†L1-L200】【F:lib/media.ts†L1-L80】
- Knowledge base markdown files under `data/knowledge/` drive the AI assistant embeddings produced by `data/embeddings.json` via the `scripts/build-embeddings.ts` script. 【F:scripts/build-embeddings.ts†L1-L88】

## State & Utilities (`lib/`)
- Cart logic lives in `lib/cart/` with storage helpers, reducers, and selectors used by the `CartProvider`. 【F:lib/cart/storage.ts†L1-L56】【F:providers/CartProvider.tsx†L1-L92】
- Order schema, storage, and WhatsApp message formatting are in `lib/orders/`. Authentication helpers (`lib/auth.ts`), ID generators (`lib/ids.ts`), motion tokens (`lib/motion.ts`), responsive utilities, and WhatsApp link builders (`lib/wa.ts`) support the rest of the app. 【F:lib/orders/storage.ts†L1-L82】【F:lib/wa.ts†L1-L52】

## Providers & Context
- `providers/CartProvider.tsx` hydrates cart state from localStorage and exposes mutation actions. `providers/ToastProvider.tsx` wraps Radix toast primitives for sitewide notifications. 【F:providers/CartProvider.tsx†L1-L92】【F:providers/ToastProvider.tsx†L1-L160】

## Other Notables
- Global styles, typography tokens, and motion-friendly utilities are defined in `app/globals.css`. 【F:app/globals.css†L1-L78】
- Static assets live in `public/`, environment-aware config sits in `next.config.mjs` and `next-env.d.ts`, and project scripts use pnpm as configured in `package.json`.
