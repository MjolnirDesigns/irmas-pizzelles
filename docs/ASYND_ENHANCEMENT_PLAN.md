# Asynd enhancement plan — Irma’s Pizzelles

Mjolnir Design Studios engagement. The existing site stays on its current routes. Three front-end directions live under `/v`, and they share one pre-order commerce path.

This is a design and engineering plan, not a legal opinion. Cottage-food, tax, and labeling calls below are cited so the owner can confirm them before taking money.

## 1. Site scan

Stack, from the repo: Express, Vite, React 18, Tailwind, shadcn/Radix, wouter, Drizzle, Postgres. Built for Replit (`reusePort`, Replit Vite plugins, a Resend connector, an OpenAI integration used only by the newsletter job).

### What already exists

| Route | What it is |
|---|---|
| `/` | Home: hero, product grid, about, testimonials, FAQ, snowfall |
| `/shop` | Four-product grid and the original cart |
| `/about`, `/faq`, `/nutrition`, `/recipes` | Content pages |
| `/waitlist` | Email waitlist |
| `/checkout` | A form that collects a card number in the browser and then pretends to charge it |
| `/account` | Profile shell behind a session that is never actually created |

The API already has products, promo codes, orders, addresses, waitlist, and newsletter routes. Drizzle already has `orders`, `order_items`, and an `order_status` enum. There is no Stripe call, no fulfillment choice, and no cottage-food constraint. `server/db.ts` threw on import when `DATABASE_URL` was missing, and `server/newsletter-service.ts` constructed an OpenAI client at import, so the whole server refused to boot on a laptop.

### What is weak, relative to the launch

The catalog does not match the product the owner is actually making.

- Seeded products are vanilla, anise, cinnamon, and chocolate at $14.99–$16.99 a dozen. The launch is anise and vanilla only, $10 a dozen list, $6 a six, with a third flavor still undecided.
- Checkout asks for a raw card number (`client/src/pages/checkout.tsx` logs it and shows a toast). That cannot go live.
- Shipping is a flat fee to any US state. Florida cottage food, as UF/IFAS reads it, does not support shipping out of state. See `docs/COMMERCE_READINESS.md`.
- Nothing on the live pages carries the cottage-food sentence, the allergen line, or a Florida-only fulfillment choice.
- Testimonials are presented as customer quotes. There are no customers yet. The new pages do not invent any.
- The word the owner cannot use in a product claim does not appear in the new copy. The old FAQ still praises “the finest ingredients” in a way that is easy to over-read. Left untouched, on purpose.
- `reusePort: true` in `server/index.ts` throws `ENOTSUP` on Windows.
- There is no `.env.example`.

The visual system (cream, gold, Italiana/Cormorant/Lato, heritage stripe) is a competent Italian-grocery template. It is not yet a specific bakery, and it does not explain the pre-order.

## 2. What this engagement kept

Every existing route, page, and component is still there, with the same chrome: promo banner, header, footer, cart slide-over, snowfall. New work is mounted only under `/v` and under new `/api/commerce`, `/api/stripe/webhook`, and `/api/admin` routes.

Boot behavior on Replit is unchanged when `DATABASE_URL` is set. `reusePort` is still enabled on Linux.

## 3. Enhancement plan

The business question for the next month is not “which theme.” It is: will people pay about $8–$10 a dozen, which flavor leads, and do they want a six or a twelve — before anyone commits to a 10,000-unit tin.

So the pages do four jobs:

1. Show the actual product: 5-inch wafer, anise or vanilla, clear cylinder, Kerrygold grass-fed butter, small batch of about sixty.
2. Say the legal sentence, the allergens (wheat, egg, milk), and that shipping stops at Florida.
3. Take a reservation: pack × flavor × quantity, early-bird price, pickup / local delivery / in-state shipping.
4. Ask the survey even from people who are not ready to buy: email, flavor, pack, monthly reorder, idea for flavor three.

Prices in code: dozen list $10.00, six list $6.00, early bird 18% ($8.20 and $4.92). Eighteen percent sits inside the $8–$8.50 dozen band in the brief if they would rather round; the percent is `EARLY_BIRD_PERCENT`. Tax is $0 in this flow, with the reason documented rather than a hardcoded 8%.

## 4. The three directions

### Atelier — `/v/atelier`

A fashion-house edit. Instrument Serif and Outfit, warm paper, almost no color, hairline rules, a numbered look (01 Anise, 02 Vanilla, 03 not yet). The wafer is a drawn mark, not a stock photo. Motion is a single fade on the headline, and it turns off for `prefers-reduced-motion`.

Why this direction: pizzelle are a pattern as much as a flavor. Treated like a small leather good, the cylinder can be a gift. This is the right room if the brand grows past the cottage kitchen into a packaged good. It is a cooler first impression for a home kitchen asking for trust.

Shop `/v/atelier/shop`. Detail `/v/atelier/p/anise` and `/v/atelier/p/vanilla`. Checkout `/v/atelier/checkout`.

### Heritage — `/v/heritage`

The kitchen, done carefully. Fraunces and Source Sans, oxblood, olive, a paper-noise ground drawn in SVG (no photo). The page opens as a letter, then the tins, then a table where you leave a note. The cottage sentence sits in the footer in cream on a near-black ground so it is actually readable.

Why this direction: the buyer is trusting a person and a law, not a lifestyle brand. The story (the iron, the butter, the batch of sixty, Florida only) is the product. This is the page we would put on a business card at a market.

Shop `/v/heritage/shop`. Detail `/v/heritage/p/:flavor`. Checkout `/v/heritage/checkout`.

### Experience — `/v/experience`

The press, as a short film you scroll. `react-three-fiber` draws a scalloped wafer, a procedural iron pattern (canvas texture, also used as a bump map), a dark iron that lifts away, and a clear cylinder with gold rims. Scroll progress, smoothed with Lenis, drives the camera, the pattern depth, and how many wafers drop into the tin. Flavor and pack are live controls.

The 3D chunk is loaded with `React.lazy` from `App.tsx`, and the canvas module is loaded again only when that page (or a product still-life) asks for it. `prefers-reduced-motion`, Save-Data, or `deviceMemory <= 2` starts on a still drawing, with a button to play the press. A render error boundary falls back to the same drawing. The shop and the label page share the dark type system; the label page can show a small rotating cylinder, or the still drawing.

Shop `/v/experience/shop`. Detail `/v/experience/p/:flavor`. Checkout `/v/experience/checkout`.

### Index

`/v` links the three studies, the original site, and the order desk at `/v/admin`.

## 5. Recommendation

Ship **Heritage** as the public pre-order page.

The first hundred orders are a trust problem: home kitchen, cottage-food sentence, allergens, “we only ship in Florida.” Heritage says those things in the same voice as the product. Atelier is the better system once the label and the tin are final and the sale is a gift. Experience is the link you send to someone who already wants to see the iron — use it as the campaign URL, not as the only door, because a portion of phones should never be asked to start WebGL to buy a cookie.

Keep the original site unlinked from ads until its catalog, checkout, and shipping copy match the launch. Right now it sells four flavors, at the wrong price, to any state.

## 6. Running it locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5000/v`.

- `reusePort` is set only when `process.platform === "linux"`, which covers Replit and avoids `ENOTSUP` on Windows.
- With no `DATABASE_URL`, storage is an in-memory copy of the legacy catalog (so `/shop` still has products) plus whatever reservations you create. They vanish on restart.
- With no Stripe test key, checkout still creates an order and the confirmation page says you were not charged.
- With no `RESEND_API_KEY` (and no Replit connector), the confirmation email is logged and skipped.
- With no OpenAI key, the server still boots. The newsletter sender throws only when someone actually calls it.
- `npm run db:push` and `tsx server/seed.ts` still require `DATABASE_URL`. After the schema change (customers, fulfillment, pre-order columns), run `npm run db:push` against the real database before taking a Postgres order.

Libraries added: `stripe`, `three`, `@react-three/fiber`, `@react-three/drei`, `lenis`.
