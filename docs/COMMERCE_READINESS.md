# Commerce readiness — Irma’s Pizzelles

What the pre-order can do today, and what has to be true before a stranger’s card is charged. This is an operating checklist for the owner. It is not legal, tax, or food-safety advice. Confirm the statute readings with FDACS, the Florida Department of Revenue, and whoever files the LLC’s taxes.

Prices and copy in the new pages follow the November 26, 2026 product presentation: anise and vanilla, 5-inch wafers, 6- and 12-cookie clear cylinders, $10 / dozen list, $6 / six list, early bird inside 15–20% (the default in code is 18%).

## What is real, and what is a stub

| Piece | State |
|---|---|
| Cart (flavor × pack × quantity), shared by all three variants | Real. Stored in `localStorage` under `irmas-asynd-cart-v1`. The original site’s cart is a separate context and was not changed. |
| Early-bird price | Real. Computed on the server from list price and `EARLY_BIRD_PERCENT`. The client displays the same numbers from `/api/commerce/config`. |
| Customer record | Real. `customers` table (or the in-memory store): email, name, phone, preferred flavor and pack, monthly-reorder flag, third-flavor idea. |
| Order + line items + status | Real. Existing `orders` / `order_items` tables, plus fulfillment, pre-order flag, early-bird percent, batch label, variant, Stripe session id, and `payment_state`. Status enum was already `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`. |
| Florida guard | Real. Delivery and shipping require a Florida state and a Florida ZIP (32000–34999). Local delivery also requires a ZIP prefix in `LOCAL_DELIVERY_ZIPS` (default Tampa Bay: 335, 336, 337, 338, 342, 346). Pickup skips the street address. |
| Batch capacity | Real, and simple. Pending, paid, and in-progress pre-orders count toward `BATCH_CAPACITY_DOZENS` (default 80). A six is half a dozen. Cancelled and refunded orders release the hold. There is no timer that expires an unpaid Stripe session until the webhook receives `checkout.session.expired`. |
| Stripe Checkout | Real when `STRIPE_SECRET_KEY` starts with `sk_test_`. The browser is sent to Stripe’s hosted page. Live keys are refused. |
| Stripe webhook | A working stub. `POST /api/stripe/webhook` checks the signature with `STRIPE_WEBHOOK_SECRET`, marks `checkout.session.completed` orders paid, sends the confirmation email, and cancels an order when the session expires. It does nothing else (no refunds, no disputes). |
| No Stripe key | Real degradation. Checkout still saves the order with `payment_state = not_configured`. The page says the customer was not charged. |
| Confirmation page | Real. `/v/order/:orderNumber`. |
| Confirmation email | Hook is real. Resend sends it when `RESEND_API_KEY` is set, or when the Replit Resend connector is present. Otherwise it logs a no-op and the order still exists. |
| Survey / newsletter | Real. `POST /api/commerce/survey` upserts a customer and, if they opted in, a newsletter row. |
| Admin list | Real, and thin. `/v/admin` plus `GET /api/admin/orders` and `PATCH /api/admin/orders/:id`. Opens with `ADMIN_TOKEN` (`x-admin-token`) or with `session.userId` if some future login sets it. Nothing in the current app sets that session. There is no login screen. |
| Sales tax calculation | Not collected. See below. Do not turn on Stripe Tax until the exemption is confirmed. |
| Inventory per cookie | Not per-SKU stock. The limit is the batch, in dozens. |
| Shipping labels, tracking purchase, refunds | Not built. Admin can store a tracking number and a status. |
| Original `/checkout` | Unchanged. It still collects a card number in the page and does not charge it. Do not send customers there. |

Run `npm run db:push` on the production database before the first real order. The new columns and the `customers` table are in `shared/schema.ts`. Without that push, Postgres inserts from the new checkout will fail. With no `DATABASE_URL` at all, the app uses memory and will forget orders on restart — fine for design review, not for a launch.

## Environment

See `.env.example`. Minimum to take a test payment:

- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...` (from the Stripe CLI or the dashboard endpoint)
- `DATABASE_URL` if the order has to survive a restart
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on a verified domain, if the email has to actually arrive
- `ADMIN_TOKEN` for the order desk

Local webhook forward:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Test card `4242 4242 4242 4242`, any future expiry, any CVC. Use a Florida address.

## Stripe account and tax setup

1. Create a Stripe account for the LLC, not a personal account. Finish identity verification before switching out of test mode. This repo will not accept an `sk_live_` key until that refusal is deliberately removed — do not remove it on a Friday.
2. Statement descriptor: something a buyer recognizes on a card line, e.g. `IRMAS PIZZELLE`.
3. Business address on the Stripe account should match the cottage-food label.
4. Do not enable Stripe Tax automatically yet. If the sale is exempt (below), collecting tax is its own problem. If a later channel is taxable (a hot cookie, an event with an admission charge), tax has to be on for that channel only.
5. Webhook endpoint in live mode: `https://irmaspizzelles.com/api/stripe/webhook`, events `checkout.session.completed` and `checkout.session.expired`. Store the signing secret in the host, not in git.
6. Turn on email receipts inside Stripe as a second copy. Our Resend mail is the one that carries the cottage sentence and the allergen line; keep it.
7. Payout bank account, and a habit of matching payouts to the order desk. There is no accounting export yet.

## Florida sales tax on these cookies

Read on November 28, 2026. Sources:

- [Fla. Stat. § 212.08(1)](https://www.flsenate.gov/Laws/Statutes/2026/0212.08) (2026). Food products for human consumption are exempt. The definition includes baked goods, and specifically “bakery products sold by bakeries, pastry shops, or like establishments that do not have eating facilities.” The exemption does **not** apply to hot prepared food, food sold for immediate consumption, candy, or food sold where the entrance has an admission charge. Bakery products from a shop that *does* have eating facilities are taxable except when sold for consumption off the premises.
- [Rule 12A-1.011, F.A.C.](https://floridarevenue.com/TaxLaw/Documents/23A-006.pdf), as applied in DOR TAA 23A-006 (March 23, 2023): cookies kept warm by a heat source are taxable hot prepared food. Cookies sold chilled or at room temperature, boxed, are not. Cookies still warm from the initial bake, and not held on a warmer, are not hot prepared food.
- [DOR TAA 15A-016](https://floridarevenue.com/TaxLaw/Documents/15A-016.pdf) (a home bakery under the cottage-food law): sales from the home for consumption elsewhere were exempt. Sales at a vendor event were exempt unless the event charged admission. Products regarded as candy were taxable. The cottage-food permit exemption does **not** by itself decide sales tax; § 500.80(5) says the cottage-food section does not exempt anyone from tax laws. TAA 15A-016 was written when the gross-sales cap was much lower. The tax reasoning is about the food exemption, not the cap.
- Grocery food that is exempt is also outside discretionary surtax. Confirm that with the registering county; do not assume a 1% add-on.

How that lands on this product, if the facts stay as designed:

- Cylinders are sealed, sold cold or at room temperature, for someone to take home. No seats, no warmer, no “eat it here.”
- That is the exempt case in the statute and in both TAAs, **as long as the product is not held out as candy**. “Italian wafer cookies” / “pizzelle” is a bakery good. Do not market them as confection or candy.
- A festival that charges admission is the exception that makes the sale taxable. Price that channel separately or do not sell inside the gate.
- The site currently charges **$0** and says so. That is intentional. It is not a determination.

What the owner still has to do:

- Call the Department of Revenue or a Florida CPA, describe the cylinder and the channels (porch pickup, Tampa delivery, in-state parcel, farmers market), and ask whether a certificate of registration is required even if every sale is exempt. Many exempt sellers still register and file a zero return. [DOR registration](https://floridarevenue.com/taxes/taxesfees/Pages/sales_tax.aspx).
- If any channel is taxable, collect that tax in Stripe for those orders only. Do not smear one rate across the whole cart.
- Keep the TAA and the CPA note with the tax file. Cottage-food operations are not exempt from tax recordkeeping.

## Cottage-food disclosure — where it has to appear

Statute: [Fla. Stat. § 500.80](https://www.flsenate.gov/Laws/Statutes/2026/500.80) (2026). UF/IFAS fact sheet FS425, revised October 2026: [Cottage Food in Florida](https://ask.ifas.ufl.edu/publication/FS425/pdf). FDACS overview: [Cottage Foods](https://www.fdacs.gov/Business-Services/Food/Food-Establishments/Cottage-Foods).

The label on the cylinder must include, in at least 10-point type and a color that contrasts with the background:

> Made in a cottage food operation that is not subject to Florida's food safety regulations.

Also on the label, from § 500.80(3): the operation’s name and address, the product name, ingredients by weight, net weight, and allergens. Nutrition Facts only if a nutrition claim is made.

On the site, the same sentence is in the footer of each variant, on the product detail, on checkout, on the confirmation page, and in the confirmation email. That is not a substitute for the label. The website is where a buyer sees it before they pay, which is the point.

Two launch constraints from the same reading:

- **Wholesale is prohibited.** Do not add a “for cafés” SKU, a consignment note, or a wholesale form.
- **Shipping.** The statute allows USPS or a commercial carrier and does not draw a state line. UF/IFAS (October 2026) says ship only to Florida customers, because food that crosses a state line is in interstate commerce and needs a licensed facility. FDACS’s public page does not spell the state line out. This build follows UF/IFAS: Florida only, until FDACS says otherwise in writing. The checkout refuses a non-Florida address.

Gross sales cap: $250,000 a year, all cottage-food sales, all channels, all people in the operation. The order desk does not enforce the cap. Someone has to add the year’s totals before taking an order that would cross it.

The operation’s street address is **not** in the repo, because it was a blank in the presentation (`Irma's Pizzelles LLC, [address]`). The label cannot be printed, and the site footer should not invent one. Put the real address in the footer and on the label together.

Nutrition numbers on the new pages are labeled as FDA-rounded estimates awaiting a lab. Showing calories can be read as a nutrition claim, which would force a real Nutrition Facts panel onto the cottage label. If you want to avoid that, take the numbers off the site until Eurofins or AGT sends the panel. The presentation’s own note: do not print a retail panel from the estimate.

Allergens on every selling surface: **CONTAINS: WHEAT, EGG, MILK.** No nuts, sesame, or soy are in the recipe. Add a “made in a facility that also processes…” line only if the kitchen actually has that risk. Do not add it as decoration.

Do not claim a certification the bakery does not hold. Ingredient names on the launch label should be the plain ones in the presentation (unbleached wheat flour, eggs, cane sugar, butter). Individual certified ingredients may be named in the ingredient list only, and only with three years of records. The front of the label and the front of the site stay silent on that.

## Shipping, packaging, perishability

- Packs: clear PET cylinder. Six is short (presentation: Packaging Decor 1141 class, about 6" × 3"). Dozen is the taller tube. Net weight placeholders: 4.2 oz (119 g) and 8.4 oz (238 g), at 20 g a wafer, rounded down. Weigh ten cookies per flavor and replace both numbers before a label is printed. The site copy says these weights are placeholders.
- A thin 5-inch wafer breaks. The presentation flags untested shelf life and breakage in parcel. The shipping option on the site says that out loud. Do a drop test — one six and one dozen, in the mailer you will actually buy — before promising parcel.
- Pack for a dry, cool, airtight arrival. No ice pack theater unless you have a reason; these are low-moisture cookies, and condensation is worse than warmth. Do not ship them warm.
- Pickup copy says Tampa Bay and that the address is confirmed by email. There is no public street address until you choose one.
- Local delivery is a flat $5 inside the ZIP list. In-state shipping is a flat $8. Neither is a carrier rate. Replace them when you know the mailer and the zone.
- Cottage food has to be stored at the cottage operation. Do not stage parcels at a friend’s house or a shared kitchen while you are still under § 500.80.

## Policies you still have to write

None of these are in the repo. They need a URL in the footer before a card is charged.

- **Terms of sale.** Pre-order means the cookies are not baked yet. Say when the batch closes, when it is delivered, and that a flavor can sell out. Say that the contract is formed when payment succeeds, not when the bag is filled.
- **Refunds.** Cookies are perishable. A reasonable policy: full refund if you cancel before the batch is baked; replacement or refund if a cylinder arrives broken or not as described; no refund for “I don’t like anise” once it was described as anise. Spell out who pays return shipping (probably no one — you don’t want broken wafers mailed back). Allergen: if someone tells you they need a kitchen that is free of wheat, egg, or milk, the answer is that this product contains all three and there is no refund for that surprise after they have read the line.
- **Allergen.** Repeat wheat, egg, milk next to the buy button (already on the pages) and in the terms.
- **Privacy.** You are collecting email, phone, address, flavor preference, and a card token that Stripe holds. Say what you keep, that you do not sell the list, how to unsubscribe, and how long order records stay. Newsletter opt-in on checkout is currently on when they submit. Make it a separate checkbox before launch if you want it to be honest consent. The survey form sends `marketingOptIn: true` today — change that to an explicit box.
- **Cottage limitation.** One sentence in the terms: sold direct to consumers under Fla. Stat. § 500.80, not inspected as a commercial food facility, Florida delivery only.

Have a person who practices in Florida read the four pages. Do not ship a generated policy as if it were counsel.

## Batch capacity, cutoff, and the pre-order window

- Default capacity is 80 dozen-equivalents (`BATCH_CAPACITY_DOZENS`). A six counts as 0.5. At about 60 cookies a batch, 80 dozen is 16 bakes. Change the number to whatever the owner can actually press in the window.
- `PREORDER_CUTOFF` as an ISO timestamp closes checkout with a plain error. There is no timezone UI. Set it in America/New_York and write the same date on the page (the batch label is `BATCH_LABEL`).
- Unpaid Stripe sessions hold capacity until they expire or you cancel them in the order desk. If someone opens Checkout and walks away, that hold sits until Stripe expires the session (usually 24 hours) **and** the webhook fires. In test mode, forward the webhook or cancel stale `awaiting_stripe` rows by hand.
- The early-bird discount is not a coupon code the customer types. It is applied to every pre-order while the batch is open. `promoCode` is stored as `EARLYBIRD` so the order row shows why the price moved.
- Goal from the presentation: 50–100 pre-orders in two to four weeks, before any 10,000-unit tin order. The order desk is the tally. It does not email you when you hit 50.

## Analytics

Nothing is installed. Before launch, pick one and keep it small:

- Plausible, Fathom, or Cloudflare Web Analytics if you want page counts without a cookie banner fight.
- If you add Google Analytics or Meta, you need a privacy policy that names them, and you should not fire them before consent if you are being careful.
- The questions that matter are already in the order: flavor mix, six vs twelve, monthly-reorder checkbox, third-flavor free text, fulfillment mix. Read the order desk. Do not buy a funnel tool to learn that.

UTM parameters are not captured. If you run one ad, add `source` onto the customer row before you spend money, or you will not know which sentence worked.

## Launch checklist

- [ ] Legal name, street address, and phone are real, and they match the label, the footer, Stripe, and the bank.
- [ ] `npm run db:push` has been run on the database you will actually use.
- [ ] Weigh ten wafers per flavor. Replace net weight on the label and on the site.
- [ ] Baking-powder and extract sub-ingredients copied off the packages in the kitchen, not off this document.
- [ ] Decision on flavor three, or a decision to launch with two.
- [ ] Decision on the early-bird percent and whether $8.20 / $4.92 should be rounded.
- [ ] `EARLY_BIRD_PERCENT`, `BATCH_CAPACITY_DOZENS`, `BATCH_LABEL`, `PREORDER_CUTOFF`, `LOCAL_DELIVERY_ZIPS` set on purpose.
- [ ] Pickup address and hours written down. Delivery ZIP list matches where you will actually drive.
- [ ] Drop-test the mailer. Decide whether parcel stays on the menu.
- [ ] Cottage sentence on the printed label at ≥ 10 pt, high contrast, and the same sentence still on the site.
- [ ] Allergen line on the label and the site. No certification seal, no front-panel certification claim.
- [ ] Lab panel ordered if you are keeping calorie numbers anywhere public.
- [ ] Stripe in test mode: one six, one dozen, pickup, Tampa delivery, Florida ship, and a New York address that must fail.
- [ ] Webhook verified with the CLI. Order moves to `paid`. Email arrives.
- [ ] Resend domain authenticated (SPF, DKIM). From-address is the LLC, not a personal Gmail, if you can manage it.
- [ ] `ADMIN_TOKEN` is long, stored in the host, and the order desk opens.
- [ ] Terms, refund, allergen, privacy pages linked from the footer.
- [ ] CPA or DOR answer on sales tax filed with the bookkeeping.
- [ ] Only then: live Stripe key, and only after the test-key refusal in `server/commerce.ts` is removed on purpose.
- [ ] Point the public URL at one variant (recommendation in `docs/ASYND_ENHANCEMENT_PLAN.md`: Heritage). Leave `/`, `/shop`, and `/checkout` off the ads until they sell the same product.

## Owner decisions still open

- Legal name and the street address that go on the label and the footer.
- Flavor three.
- Early-bird percent and whether to round $8.20 / $4.92.
- Batch size and the cutoff date.
- Whether parcel shipping stays, after a breakage test.
- The real pickup address and the real delivery radius (the ZIP list is a default, not a promise).
- Whether calorie estimates stay on the site before the lab panel.
- Whether marketing email is opt-in by checkbox (it should be) — today checkout and the survey record opt-in when the form is submitted.
- Which variant is the public URL.
- A CPA’s answer on registering for sales tax even if every cylinder is exempt.
- Written confirmation from FDACS if anyone ever wants to ship past Florida. Until that exists, the guard stays.
