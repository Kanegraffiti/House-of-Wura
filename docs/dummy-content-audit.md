# Dummy Content Audit

This document inventories the placeholder copy, stock imagery, and temporary links currently used across the site so real brand assets can replace them.

## Home page (`app/page.tsx`)
- **Hero headline and CTAs:** Tagline (“High-touch celebrations…”) and WhatsApp CTA copy plus default number derived from `NEXT_PUBLIC_WA_NUMBER` fallback `2349060294599` are demo text. The hero WhatsApp message is hard-coded to a sample inquiry (`heroMessage`).【F:app/page.tsx†L23-L230】
- **Ribbon and stats:** Marquee ribbon items and the experience stats (150+ events, 65 editorials, etc.) are illustrative achievements rather than verified metrics.【F:app/page.tsx†L39-L67】
- **Service teasers:** Three service cards (“Signature Wedding Planning,” etc.) with bullet points and prefilled WhatsApp enquiry messages are sample offers.【F:app/page.tsx†L69-L88】
- **Case studies and testimonials:** The three case studies with gallery keys plus testimonials, and the separate testimonial quotes section, are fictional stories meant as placeholders.【F:app/page.tsx†L90-L142】
- **Hero/background media:** The slideshow uses stock image keys (`hero`, `heroEditorial`, etc.) defined in `data/media.json`; all captions/alt text map to placeholder media.【F:app/page.tsx†L25-L29】【F:data/media.json†L2-L114】

## About page (`app/about/page.tsx`)
- **Founding story and headline:** Intro headline (“Modern luxury rooted in African brilliance”) and founder blurb are placeholder brand story text, including WhatsApp CTA copy.【F:app/about/page.tsx†L43-L74】
- **Philosophy highlights:** Three values (“Craftsmanship,” etc.) with descriptive copy are sample positioning statements.【F:app/about/page.tsx†L18-L31】【F:app/about/page.tsx†L78-L99】
- **Wedding mastery section:** Bulleted service promises and accompanying image pull from stock media (`heroCelebration`).【F:app/about/page.tsx†L102-L134】【F:data/media.json†L10-L31】
- **Private client CTA:** Invitation, privacy promise, and WhatsApp request text are placeholders; circular avatar uses stock `hero` media.【F:app/about/page.tsx†L137-L172】【F:data/media.json†L2-L21】

## Services page (`app/services/page.tsx`)
- **Service menu:** All three packages, their bullet lists, and WhatsApp template messages contain dummy deliverables and instructions to replace with actual offerings.【F:app/services/page.tsx†L17-L54】
- **Intro copy and CTAs:** Opening paragraph, “Start consultation,” and “View packages” CTAs with WhatsApp messaging are placeholder onboarding text.【F:app/services/page.tsx†L59-L87】
- **Guarantees and custom request:** “Included with every project” bullets and the custom enquiry block are sample benefits and language.【F:app/services/page.tsx†L109-L135】

## Lookbook page (`app/lookbook/page.tsx`)
- **Gallery entries:** All six entries come from stock media keys mapped in `data/media.json`; captions and prompts are not tied to real shoots.【F:app/lookbook/page.tsx†L18-L60】【F:data/media.json†L2-L84】
- **WhatsApp prompt:** The enquiry invitation text is a placeholder call-to-action.【F:app/lookbook/page.tsx†L46-L60】

## Shop and catalogue (`app/shop/page.tsx` & `data/products.json`)
- **Section copy:** Shop headline and description invite WhatsApp enquiries using placeholder language.【F:app/shop/page.tsx†L24-L48】
- **Product catalogue:** All 10 products with names, pricing, SKUs, colors, sizes, and descriptions are fabricated items tied to stock image keys; replace with real inventory and photography.【F:data/products.json†L1-L132】【F:data/media.json†L2-L114】

## Booking page (`app/booking/page.tsx`)
- **Process steps:** The four-step booking flow and descriptions are illustrative and should be confirmed or replaced.【F:app/booking/page.tsx†L15-L73】
- **Payment options:** Milestone splits, payment methods, and vendor management notes are placeholder policies.【F:app/booking/page.tsx†L34-L104】
- **Urgent request CTA:** Copy about Lagos/London teams and WhatsApp link is sample language.【F:app/booking/page.tsx†L104-L114】

## Contact page (`app/contact/page.tsx`)
- **Quick contact cards:** Titles, descriptions, and links (WhatsApp template, `hello@houseofwura.com`, Instagram handle) are placeholder contact points.【F:app/contact/page.tsx†L17-L79】
- **Appointment notice:** Statement about invitation-only studio visits and WhatsApp CTA is sample messaging.【F:app/contact/page.tsx†L69-L79】

## Events page (`app/events/page.tsx`)
- **Featured events:** All three event write-ups (titles, locations, mood descriptions) and testimonials are fictional; galleries draw from stock media keys and videos hosted on Pexels.【F:app/events/page.tsx†L25-L137】【F:data/media.json†L2-L114】

## Legal pages
- **Privacy policy (`app/privacy/page.tsx`):** Overview, data collection notes, local storage disclaimer, and contact email are generic placeholders pending legal review.【F:app/privacy/page.tsx†L11-L49】
- **Terms & conditions (`app/terms/page.tsx`):** Service scope, payments, cancellations, IP, and liability clauses are templated language needing real terms.【F:app/terms/page.tsx†L11-L53】

## Media library (`data/media.json`)
- All image references across the site point to Unsplash/Pexels URLs with descriptive alt text; these are stock assets to be replaced with brand-approved photography.【F:data/media.json†L2-L114】
