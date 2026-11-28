import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { FLAVORS, NUTRITION, flavorById, type FlavorId, type PackSize } from "@shared/catalog";
import PizzelleMark, { useStylesheet } from "@/variants/PizzelleMark";
import { BagButton, CommerceDrawer, PaymentsNote } from "@/variants/shell";
import { useCommerceCart } from "@/commerce/cart";
import { formatCents, priceFor, useCommerceConfig } from "@/commerce/use-config";
import SurveyForm from "@/variants/SurveyForm";

const FONT = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,620;1,9..144,500&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap";

const theme = {
  "--asynd-bg": "#f3e6d0",
  "--asynd-ink": "#2a1612",
  "--asynd-muted": "#5c463c",
  "--asynd-line": "#c9b39a",
  "--asynd-accent": "#6e2433",
  "--asynd-accent-ink": "#f8f1e4",
  "--asynd-display": '"Fraunces", Georgia, serif',
  "--asynd-sans": '"Source Sans 3", "Source Sans Pro", sans-serif',
} as React.CSSProperties;

function Shell({ children }: { children: React.ReactNode }) {
  useStylesheet(FONT);
  const [menu, setMenu] = useState(false);
  return (
    <div style={theme} className="relative min-h-screen bg-[var(--asynd-bg)] text-[var(--asynd-ink)] font-[var(--asynd-sans)]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-[#f8f1e4] focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="relative z-40 border-b border-[#2a1612]/15 bg-[#f3e6d0]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/v/heritage" className="font-[var(--asynd-display)] text-xl tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            Cucina di Irma
          </Link>
          <nav className="hidden gap-7 text-sm md:flex" aria-label="Heritage">
            <a href="/v/heritage#letter">The letter</a>
            <Link href="/v/heritage/shop">The tins</Link>
            <a href="/v/heritage#table">The table</a>
            <Link href="/">The current site</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button type="button" className="text-sm md:hidden" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>
              {menu ? "Close" : "Menu"}
            </button>
            <BagButton className="text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" />
          </div>
        </div>
        {menu && (
          <nav className="flex flex-col gap-3 border-t border-[#2a1612]/15 px-5 py-4 text-sm md:hidden" aria-label="Heritage mobile">
            <a href="/v/heritage#letter" onClick={() => setMenu(false)}>The letter</a>
            <Link href="/v/heritage/shop" onClick={() => setMenu(false)}>The tins</Link>
            <a href="/v/heritage#table" onClick={() => setMenu(false)}>The table</a>
            <Link href="/" onClick={() => setMenu(false)}>The current site</Link>
          </nav>
        )}
      </header>
      <main id="content" className="relative">{children}</main>
      <footer className="relative bg-[#2a1612] text-[#f6efe4]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3 md:px-8">
          <div>
            <p className="font-[var(--asynd-display)] text-3xl">Irma’s Pizzelle</p>
            <p className="mt-3 text-sm leading-relaxed text-[#e7d7c4]">Small batches. Grass-fed butter. A clear cylinder, so you can see the iron’s work.</p>
          </div>
          <div className="text-sm leading-relaxed">
            <p>CONTAINS: WHEAT, EGG, MILK.</p>
            <p className="mt-2 text-[#e7d7c4]">No nuts, sesame, or soy in the recipe.</p>
          </div>
          <p className="text-sm leading-relaxed text-[#f6efe4]">
            Made in a cottage food operation that is not subject to Florida’s food safety regulations.
          </p>
        </div>
      </footer>
      <CommerceDrawer checkoutHref="/v/heritage/checkout" />
    </div>
  );
}

function usePackPrice(pack: PackSize) {
  const { data } = useCommerceConfig();
  return { ...priceFor(data, pack), data };
}

export function HeritageHome() {
  const reduce = useReducedMotion();
  return (
    <Shell>
      <section className="bg-[#6e2433] text-[#f8f1e4]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#f0c9a0]">Florida cottage kitchen · Batch 01</p>
            <motion.h1
              className="mt-5 font-[var(--asynd-display)] text-5xl font-normal leading-[1.02] sm:text-6xl lg:text-7xl"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              She pressed them thin enough to see the pattern.
            </motion.h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#f6e4d4]">
              Anise or vanilla. Six in a short cylinder, twelve in a tall one. Reserve the first batch and tell us which tin you would buy again.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#tins" className="bg-[#f3e6d0] px-5 py-3 text-sm font-semibold text-[#2a1612] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f8f1e4]">
                Choose a tin
              </a>
              <a href="#table" className="border border-[#f8f1e4]/50 px-5 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                Leave a note
              </a>
            </div>
          </div>
          <PizzelleMark
            className="mx-auto w-full max-w-md"
            paper="#f6e7cf"
            ink="#6e2433"
            edge="#e7c99a"
            title="Pizzelle pressed on Irma's iron"
          />
        </div>
      </section>

      <section id="letter" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[#6e2433]">From the kitchen</p>
          <h2 className="mt-3 font-[var(--asynd-display)] text-4xl leading-tight">A letter, not a slogan.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="font-[var(--asynd-display)] text-2xl leading-snug">
            <span className="float-left mr-3 mt-1 font-[var(--asynd-display)] text-6xl leading-none text-[#6e2433]">T</span>
            he iron does the decorating. A five-inch wafer, about twenty grams, comes off crisp enough to snap and thin enough that the floral pattern is the whole cookie. Butter is Kerrygold, unsalted, grass-fed. The rest is flour, eggs, cane sugar, baking powder, and either anise extract or vanilla extract.
          </p>
          <p className="mt-6 leading-relaxed text-[#3d2a24]">
            We are starting under Florida cottage food law: direct to you, no wholesale, and a plain sentence on the label and on this site. Pickup in Tampa Bay, delivery in a short list of local ZIP codes, or shipping that stops at the state line. A batch is about sixty cookies. This pre-order is how we learn whether to buy the next case of cylinders — and which flavor leads.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[#5c463c]">
            {NUTRITION.servingsNote} About {NUTRITION.calories} calories a wafer.
          </p>
        </div>
      </section>

      <section id="tins" className="border-y border-[#2a1612]/15 bg-[#f8f1e4]/70">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h2 className="font-[var(--asynd-display)] text-5xl">The tins</h2>
          <PaymentsNote className="mt-4 max-w-xl text-sm" />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {FLAVORS.map((flavor) => (
              <TinCard key={flavor.id} flavorId={flavor.id} />
            ))}
          </div>
          <article className="mt-8 border-2 border-dashed border-[#6e2433]/40 p-6 md:p-8">
            <h3 className="font-[var(--asynd-display)] text-3xl">The third flavor is still a rumor.</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed">It is not for sale. If you have one in mind — lemon, espresso, almond — write it at the table below. We will not invent a review to fill the space.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-3 md:px-8">
        {[
          ["At the door", "Pickup is free. We confirm a Tampa Bay address and a window by email."],
          ["Down the street", "Local delivery is five dollars inside the Tampa Bay ZIP list. Florida, of course."],
          ["Across the state", "Eight dollars, Florida ZIP codes only. These are thin wafers; transit is still a test, not a promise of a perfect stack."],
        ].map(([title, copy]) => (
          <article key={title} className="border border-[#2a1612]/20 bg-[#f8f1e4] p-6">
            <h3 className="font-[var(--asynd-display)] text-2xl">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed">{copy}</p>
          </article>
        ))}
      </section>

      <section id="table" className="bg-[#3e4a32] text-[#f6efe4]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-[var(--asynd-display)] text-5xl leading-tight">Pull up a chair.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-[#e4ecd8]">
              Email, the flavor you want again, six or twelve, and whether a monthly tin sounds like something you’d actually do. That is the whole survey.
            </p>
          </div>
          <div className="text-[#f6efe4] [--asynd-line:#8ea184] [--asynd-ink:#f6efe4] [--asynd-accent:#f3e6d0] [--asynd-accent-ink:#2a1612]">
            <SurveyForm variant="heritage" idPrefix="heritage-survey" />
          </div>
        </div>
      </section>
    </Shell>
  );
}

function TinCard({ flavorId }: { flavorId: FlavorId }) {
  const flavor = flavorById(flavorId)!;
  const [pack, setPack] = useState<PackSize>("12");
  const cart = useCommerceCart();
  const price = usePackPrice(pack);
  return (
    <article className="border-2 border-[#2a1612] bg-[#f3e6d0] p-6 shadow-[6px_6px_0_#6e2433]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6e2433]">{flavor.epithet}</p>
          <h3 className="mt-2 font-[var(--asynd-display)] text-4xl">{flavor.name}</h3>
        </div>
        <PizzelleMark className="h-24 w-24" ink="#6e2433" paper="#f8f1e4" edge="#c4a27a" title={`${flavor.name} pizzelle pattern`} />
      </div>
      <p className="mt-4 text-sm leading-relaxed">{flavor.description}</p>
      <fieldset className="mt-5">
        <legend className="sr-only">Pack size for {flavor.name}</legend>
        <div className="flex gap-3">
          {(["6", "12"] as PackSize[]).map((id) => (
            <label key={id} className="cursor-pointer">
              <input type="radio" name={`tin-${flavor.id}`} className="peer sr-only" checked={pack === id} onChange={() => setPack(id)} />
              <span className="block border border-[#2a1612]/30 px-3 py-2 text-sm peer-checked:bg-[#2a1612] peer-checked:text-[#f8f1e4] peer-focus-visible:outline peer-focus-visible:outline-2">
                {id === "6" ? "Six" : "Dozen"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-5 font-[var(--asynd-display)] text-4xl">
        {formatCents(price.early)}
        <span className="ml-3 text-base text-[#5c463c] line-through">{formatCents(price.list)}</span>
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack })}
          className="bg-[#6e2433] px-4 py-3 text-sm text-[#f8f1e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Add the tin
        </button>
        <Link href={`/v/heritage/p/${flavor.id}`} className="self-center text-sm underline underline-offset-4">
          Read the label
        </Link>
      </div>
    </article>
  );
}

export function HeritageShop() {
  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#6e2433]">The tins</p>
        <h1 className="mt-3 font-[var(--asynd-display)] text-6xl">What leaves the kitchen.</h1>
        <p className="mt-4 max-w-xl leading-relaxed">Two flavors in this batch. Cylinders are clear PET, so the stack is the display. Early bird is {useEarly()}% off the $10 dozen and the $6 six.</p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {FLAVORS.map((flavor) => (
            <TinCard key={flavor.id} flavorId={flavor.id} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

function useEarly() {
  const { data } = useCommerceConfig();
  return data?.earlyBirdPercent ?? 18;
}

export function HeritageDetail() {
  const params = useParams<{ flavor: string }>();
  const flavor = flavorById(params.flavor || "");
  const [pack, setPack] = useState<PackSize>("12");
  const [quantity, setQuantity] = useState(1);
  const cart = useCommerceCart();
  const price = usePackPrice(pack);
  if (!flavor) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-24">
          <h1 className="font-[var(--asynd-display)] text-5xl">Not on this iron.</h1>
          <Link href="/v/heritage/shop" className="mt-4 inline-block underline">Back to the tins</Link>
        </div>
      </Shell>
    );
  }
  return (
    <Shell>
      <article className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
        <div className="border-2 border-[#2a1612] bg-[#f8f1e4] p-8">
          <PizzelleMark className="w-full" ink="#6e2433" paper="#f6e7cf" title={`${flavor.name} pizzelle`} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#6e2433]">{flavor.epithet}</p>
          <h1 className="mt-2 font-[var(--asynd-display)] text-6xl">{flavor.name} pizzelle</h1>
          <p className="mt-5 leading-relaxed">{flavor.description}</p>
          <p className="mt-3 text-sm">{flavor.tasting}</p>
          <fieldset className="mt-6">
            <legend className="text-sm">Pack</legend>
            <div className="mt-2 flex gap-3">
              {(["6", "12"] as PackSize[]).map((id) => (
                <label key={id}>
                  <input type="radio" name="heritage-detail-pack" className="peer sr-only" checked={pack === id} onChange={() => setPack(id)} />
                  <span className="block border border-[#2a1612] px-3 py-2 text-sm peer-checked:bg-[#2a1612] peer-checked:text-[#f8f1e4]">
                    {id === "6" ? "Six · 4.2 oz" : "Dozen · 8.4 oz"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label htmlFor="heritage-qty" className="mt-5 block text-sm">
            How many cylinders
            <input id="heritage-qty" type="number" min={1} max={12} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-2 block w-24 border border-[#2a1612] bg-transparent px-3 py-2" />
          </label>
          <p className="mt-5 font-[var(--asynd-display)] text-5xl">{formatCents(price.early * quantity)}</p>
          <button
            type="button"
            onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack }, quantity)}
            className="mt-5 bg-[#6e2433] px-5 py-3 text-sm text-[#f8f1e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Add the tin
          </button>
          <p className="mt-8 text-sm font-semibold">CONTAINS: WHEAT, EGG, MILK.</p>
          <p className="mt-3 text-sm leading-relaxed">{flavor.ingredients}</p>
          <p className="mt-4 text-sm leading-relaxed">Made in a cottage food operation that is not subject to Florida’s food safety regulations.</p>
          <p className="mt-4 text-xs leading-relaxed text-[#5c463c]">
            Per pizzelle: {NUTRITION.calories} cal, fat {NUTRITION.totalFat}, sodium {NUTRITION.sodium}, carb {NUTRITION.totalCarb}, protein {NUTRITION.protein}. {NUTRITION.servingsNote}
          </p>
        </div>
      </article>
    </Shell>
  );
}
