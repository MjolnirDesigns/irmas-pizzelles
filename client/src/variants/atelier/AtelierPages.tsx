import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { FLAVORS, NUTRITION, flavorById, type FlavorId, type PackSize } from "@shared/catalog";
import PizzelleMark, { useStylesheet } from "@/variants/PizzelleMark";
import { BagButton, CommerceDrawer, PaymentsNote } from "@/variants/shell";
import { useCommerceCart } from "@/commerce/cart";
import { formatCents, priceFor, useCommerceConfig } from "@/commerce/use-config";
import SurveyForm from "@/variants/SurveyForm";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&display=swap";

const theme = {
  "--asynd-bg": "#f3efe8",
  "--asynd-ink": "#1b1714",
  "--asynd-muted": "#5e564e",
  "--asynd-line": "#d5cdc2",
  "--asynd-accent": "#1b1714",
  "--asynd-accent-ink": "#f3efe8",
  "--asynd-display": '"Instrument Serif", Georgia, serif',
  "--asynd-sans": '"Outfit", "Avenir Next", sans-serif',
} as React.CSSProperties;

function Shell({ children }: { children: React.ReactNode }) {
  useStylesheet(FONT);
  const [menu, setMenu] = useState(false);
  return (
    <div style={theme} className="min-h-screen bg-[var(--asynd-bg)] text-[var(--asynd-ink)] font-[var(--asynd-sans)] antialiased">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--asynd-line)] bg-[var(--asynd-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/v/atelier" className="font-[var(--asynd-display)] text-2xl italic tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            Irma’s
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] uppercase tracking-[0.18em] md:flex" aria-label="Atelier">
            <a href="/v/atelier#batch" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">The batch</a>
            <Link href="/v/atelier/shop" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Shop</Link>
            <a href="/v/atelier#reserve" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Reserve</a>
            <Link href="/" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Original</Link>
          </nav>
          <div className="flex items-center gap-4 text-[13px] uppercase tracking-[0.18em]">
            <button type="button" className="md:hidden focus-visible:outline focus-visible:outline-2" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>
              {menu ? "Close" : "Menu"}
            </button>
            <BagButton className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" />
          </div>
        </div>
        {menu && (
          <nav className="flex flex-col gap-4 border-t border-[var(--asynd-line)] px-5 py-5 text-sm uppercase tracking-[0.18em] md:hidden" aria-label="Atelier mobile">
            <a href="/v/atelier#batch" onClick={() => setMenu(false)}>The batch</a>
            <Link href="/v/atelier/shop" onClick={() => setMenu(false)}>Shop</Link>
            <a href="/v/atelier#reserve" onClick={() => setMenu(false)}>Reserve</a>
            <Link href="/" onClick={() => setMenu(false)}>Original site</Link>
          </nav>
        )}
      </header>
      <main id="content">{children}</main>
      <footer className="border-t border-[var(--asynd-line)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
          <div className="md:col-span-2">
            <p className="font-[var(--asynd-display)] text-3xl italic">Irma’s Pizzelle</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--asynd-muted)]">
              Five-inch Italian wafers, pressed in small batches of about sixty with Kerrygold grass-fed butter. Direct to you, from a Florida kitchen.
            </p>
          </div>
          <div className="text-sm leading-relaxed">
            <p className="uppercase tracking-[0.18em] text-[11px] text-[var(--asynd-muted)]">Visit</p>
            <Link href="/v/atelier/shop" className="mt-3 block underline-offset-4 hover:underline">Shop the batch</Link>
            <Link href="/v" className="mt-2 block underline-offset-4 hover:underline">All directions</Link>
            <Link href="/" className="mt-2 block underline-offset-4 hover:underline">Current site</Link>
          </div>
          <div className="text-sm leading-relaxed">
            <p className="uppercase tracking-[0.18em] text-[11px] text-[var(--asynd-muted)]">Allergens</p>
            <p className="mt-3">CONTAINS: WHEAT, EGG, MILK.</p>
            <p className="mt-2 text-[var(--asynd-muted)]">No nuts, sesame, or soy in the recipe.</p>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-10 text-sm leading-relaxed md:px-8">
          Made in a cottage food operation that is not subject to Florida’s food safety regulations.
        </p>
      </footer>
      <CommerceDrawer checkoutHref="/v/atelier/checkout" />
    </div>
  );
}

function PackChoice({
  name,
  value,
  onChange,
}: {
  name: string;
  value: PackSize;
  onChange: (pack: PackSize) => void;
}) {
  const { data } = useCommerceConfig();
  return (
    <fieldset>
      <legend className="sr-only">Pack size</legend>
      <div className="flex gap-6 text-sm">
        {(["6", "12"] as PackSize[]).map((pack) => {
          const price = priceFor(data, pack);
          return (
            <label key={pack} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={pack}
                checked={value === pack}
                onChange={() => onChange(pack)}
                className="peer sr-only"
              />
              <span className="block border-b border-transparent pb-1 peer-checked:border-[var(--asynd-ink)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4">
                {pack === "6" ? "Six" : "Dozen"} · {formatCents(price.early)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function AtelierHome() {
  const reduce = useReducedMotion();
  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 pb-20 pt-16 md:grid-cols-12 md:px-8 md:pt-24">
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--asynd-muted)]">Soft launch · Batch 01 · Florida</p>
          <motion.h1 {...rise} className="mt-6 font-[var(--asynd-display)] text-6xl font-normal leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            Pressed<br />thin.
          </motion.h1>
          <p className="mt-8 max-w-md text-lg font-light leading-relaxed text-[var(--asynd-muted)]">
            Anise and vanilla pizzelle, five inches across, stacked in a clear cylinder. Reserve the first batch at the early-bird price — before we order a single extra tin.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
            <a href="#batch" className="bg-[var(--asynd-ink)] px-6 py-3 text-[var(--asynd-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
              Reserve a cylinder
            </a>
            <Link href="/v/atelier/shop" className="underline underline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
              View both flavors
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <PizzelleMark className="mx-auto w-full max-w-sm" />
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-[var(--asynd-muted)]">Iron pattern · drawn, not photographed</p>
        </div>
      </section>

      <section id="batch" className="border-t border-[var(--asynd-line)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-[var(--asynd-display)] text-4xl md:text-5xl">The batch</h2>
            <p className="hidden max-w-xs text-right text-sm text-[var(--asynd-muted)] sm:block">List is $10 a dozen and $6 a six. Early bird takes eighteen percent off.</p>
          </div>
          <PaymentsNote className="mt-6 max-w-xl text-sm text-[var(--asynd-muted)]" />
          <div className="mt-12 divide-y divide-[var(--asynd-line)] border-y border-[var(--asynd-line)]">
            {FLAVORS.map((flavor, index) => (
              <FlavorRow key={flavor.id} index={index + 1} flavorId={flavor.id} />
            ))}
            <div className="grid gap-6 py-10 md:grid-cols-12 md:items-center">
              <p className="font-[var(--asynd-display)] text-3xl text-[var(--asynd-muted)] md:col-span-2">03</p>
              <div className="md:col-span-7">
                <h3 className="font-[var(--asynd-display)] text-4xl italic">Third flavor</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--asynd-muted)]">Not in this iron. Tell us what should be pressed next — the survey is the whole point of the soft launch.</p>
              </div>
              <a href="#reserve" className="text-sm uppercase tracking-[0.18em] underline underline-offset-8 md:col-span-3 md:text-right">Suggest one</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-16 px-5 py-20 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--asynd-muted)]">The kitchen</p>
          <h2 className="mt-4 font-[var(--asynd-display)] text-5xl leading-none">Butter, then everything else.</h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 text-lg font-light leading-relaxed">
          <p>
            A batch is about sixty wafers. Flour, eggs, cane sugar, and a full cup of Kerrygold unsalted grass-fed butter — the butter is nearly half the ingredient cost, and it is the flavor. Anise extract or vanilla extract, never both in the same iron.
          </p>
          <p className="mt-6">
            Each cookie is about twenty grams and eighty calories. Wheat, egg, and milk. Packed in a clear PET cylinder: six cookies, or a dozen. We are selling direct, under Florida cottage food law, which is why the cylinder — and this page — says so plainly.
          </p>
          <p className="mt-6 text-base text-[var(--asynd-muted)]">
            Nutrition figures are FDA-rounded estimates and need a lab panel before a retail label is printed. {NUTRITION.calories} calories, {NUTRITION.totalFat} fat, {NUTRITION.totalCarb} carbohydrate, {NUTRITION.protein} protein, per pizzelle.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--asynd-line)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8">
          {[
            ["01", "Pickup", "Tampa Bay. We write with the address and a window. No fee."],
            ["02", "Local delivery", "A short list of Tampa Bay ZIP codes. Five dollars."],
            ["03", "Florida shipping", "In-state only, eight dollars. Thin wafers. We pack them to travel, and we are still learning how they hold up in a box."],
          ].map(([index, title, copy]) => (
            <article key={index}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--asynd-muted)]">{index}</p>
              <h3 className="mt-3 font-[var(--asynd-display)] text-3xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--asynd-muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reserve" className="border-t border-[var(--asynd-line)] bg-[#ebe4da]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-[var(--asynd-display)] text-5xl leading-none">Before the tin order.</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--asynd-muted)]">
              Fifty to a hundred reservations tell us whether the dozen or the six wins, and whether anise or vanilla should lead the next iron. No payment required to answer.
            </p>
          </div>
          <SurveyForm variant="atelier" />
        </div>
      </section>
    </Shell>
  );
}

function FlavorRow({ flavorId, index }: { flavorId: FlavorId; index: number }) {
  const flavor = flavorById(flavorId)!;
  const [pack, setPack] = useState<PackSize>("12");
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  const price = priceFor(data, pack);
  return (
    <article className="grid gap-6 py-10 md:grid-cols-12 md:items-center">
      <p className="font-[var(--asynd-display)] text-3xl md:col-span-2">0{index}</p>
      <div className="md:col-span-5">
        <h3 className="font-[var(--asynd-display)] text-4xl">{flavor.name}</h3>
        <p className="mt-2 text-sm italic text-[var(--asynd-muted)]">{flavor.epithet}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed">{flavor.tasting}</p>
        <Link href={`/v/atelier/p/${flavor.id}`} className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] underline underline-offset-8">
          Details
        </Link>
      </div>
      <div className="md:col-span-5 md:text-right">
        <div className="md:ml-auto md:w-fit">
          <PackChoice name={`home-${flavor.id}`} value={pack} onChange={setPack} />
        </div>
        <p className="mt-4 text-sm text-[var(--asynd-muted)]">
          <span className="line-through">{formatCents(price.list)}</span>
          <span className="ml-3 font-[var(--asynd-display)] text-3xl text-[var(--asynd-ink)]">{formatCents(price.early)}</span>
        </p>
        <button
          type="button"
          onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack }, 1)}
          className="mt-5 border border-[var(--asynd-ink)] px-5 py-2 text-[12px] uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Add to bag
        </button>
      </div>
    </article>
  );
}

export function AtelierShop() {
  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--asynd-muted)]">Shop</p>
        <h1 className="mt-4 font-[var(--asynd-display)] text-6xl">Two flavors.</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--asynd-muted)]">
          Clear cylinders. Six wafers, net wt 4.2 oz (119 g). A dozen, net wt 8.4 oz (238 g). Weights are placeholders until ten cookies of each flavor are weighed.
        </p>
        <div className="mt-14 grid gap-16 md:grid-cols-2">
          {FLAVORS.map((flavor) => (
            <ShopCard key={flavor.id} flavorId={flavor.id} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

function ShopCard({ flavorId }: { flavorId: FlavorId }) {
  const flavor = flavorById(flavorId)!;
  const [pack, setPack] = useState<PackSize>("12");
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  const price = priceFor(data, pack);
  return (
    <article className="border-t border-[var(--asynd-line)] pt-8">
      <PizzelleMark
        className="w-48"
        paper={flavor.id === "vanilla" ? "#f6e4c4" : "#f0e6d2"}
        title={`${flavor.name} pizzelle`}
      />
      <h2 className="mt-8 font-[var(--asynd-display)] text-5xl">{flavor.name}</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--asynd-muted)]">{flavor.description}</p>
      <div className="mt-6">
        <PackChoice name={`shop-${flavor.id}`} value={pack} onChange={setPack} />
      </div>
      <p className="mt-4 font-[var(--asynd-display)] text-4xl">{formatCents(price.early)}</p>
      <p className="text-xs text-[var(--asynd-muted)]">List {formatCents(price.list)} · early bird {price.percent}% </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack })}
          className="bg-[var(--asynd-ink)] px-5 py-3 text-sm text-[var(--asynd-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Add to bag
        </button>
        <Link href={`/v/atelier/p/${flavor.id}`} className="self-center text-sm underline underline-offset-4">
          Open
        </Link>
      </div>
    </article>
  );
}

export function AtelierDetail() {
  const params = useParams<{ flavor: string }>();
  const flavor = flavorById(params.flavor || "");
  const [pack, setPack] = useState<PackSize>("12");
  const [quantity, setQuantity] = useState(1);
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  if (!flavor) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-24">
          <h1 className="font-[var(--asynd-display)] text-5xl">That flavor isn’t in this batch.</h1>
          <Link href="/v/atelier/shop" className="mt-6 inline-block underline">Back to the shop</Link>
        </div>
      </Shell>
    );
  }
  const price = priceFor(data, pack);
  return (
    <Shell>
      <article className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
        <PizzelleMark className="w-full" paper={flavor.id === "vanilla" ? "#f6e4c4" : "#f0e6d2"} title={`${flavor.name} pizzelle`} />
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--asynd-muted)]">{flavor.epithet}</p>
          <h1 className="mt-3 font-[var(--asynd-display)] text-6xl">{flavor.name}</h1>
          <p className="mt-6 text-base leading-relaxed">{flavor.description}</p>
          <p className="mt-4 text-sm text-[var(--asynd-muted)]">{flavor.tasting}</p>
          <div className="mt-8">
            <PackChoice name="detail-pack" value={pack} onChange={setPack} />
          </div>
          <label className="mt-6 block text-sm" htmlFor="atelier-qty">
            Quantity
            <input
              id="atelier-qty"
              type="number"
              min={1}
              max={12}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="mt-2 block w-24 border border-[var(--asynd-line)] bg-transparent px-3 py-2 focus-visible:outline focus-visible:outline-2"
            />
          </label>
          <p className="mt-6 font-[var(--asynd-display)] text-5xl">{formatCents(price.early * quantity)}</p>
          <button
            type="button"
            onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack }, quantity)}
            className="mt-6 bg-[var(--asynd-ink)] px-6 py-3 text-sm uppercase tracking-[0.16em] text-[var(--asynd-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Add to bag
          </button>
          <p className="mt-8 text-sm font-medium">CONTAINS: WHEAT, EGG, MILK.</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--asynd-muted)]">{flavor.ingredients}</p>
          <p className="mt-4 text-sm leading-relaxed">
            Made in a cottage food operation that is not subject to Florida’s food safety regulations.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-[var(--asynd-muted)]">Serving</dt><dd>{NUTRITION.servingSize}</dd>
            <dt className="text-[var(--asynd-muted)]">Calories</dt><dd>{NUTRITION.calories}</dd>
            <dt className="text-[var(--asynd-muted)]">Total fat</dt><dd>{NUTRITION.totalFat}</dd>
            <dt className="text-[var(--asynd-muted)]">Sodium</dt><dd>{NUTRITION.sodium}</dd>
            <dt className="text-[var(--asynd-muted)]">Carb</dt><dd>{NUTRITION.totalCarb}</dd>
            <dt className="text-[var(--asynd-muted)]">Protein</dt><dd>{NUTRITION.protein}</dd>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-[var(--asynd-muted)]">{NUTRITION.servingsNote}</p>
        </div>
      </article>
    </Shell>
  );
}
