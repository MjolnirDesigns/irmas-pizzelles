import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { Link, useParams } from "wouter";
import { FLAVORS, NUTRITION, flavorById, type FlavorId, type PackSize } from "@shared/catalog";
import PizzelleMark, { useStylesheet } from "@/variants/PizzelleMark";
import { BagButton, CommerceDrawer, PaymentsNote } from "@/variants/shell";
import { useCommerceCart } from "@/commerce/cart";
import { formatCents, priceFor, useCommerceConfig } from "@/commerce/use-config";

const StillCanvas = lazy(() => import("./PizzelleScene").then((mod) => ({ default: mod.StillScene })));
const FONT = "https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap";

const theme = {
  "--asynd-bg": "#100e0c",
  "--asynd-ink": "#f4efe6",
  "--asynd-muted": "#c9bfb2",
  "--asynd-line": "#3a342c",
  "--asynd-accent": "#e4b15a",
  "--asynd-accent-ink": "#1a140c",
  "--asynd-display": '"Syne", "Avenir Next", sans-serif',
  "--asynd-sans": '"Manrope", "Avenir Next", sans-serif',
} as React.CSSProperties;

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function Shell({ children }: { children: ReactNode }) {
  useStylesheet(FONT);
  const [menu, setMenu] = useState(false);
  return (
    <div style={theme} className="min-h-screen bg-[#100e0c] text-[#f4efe6] font-[var(--asynd-sans)]">
      <header className="flex items-center justify-between border-b border-[#3a342c] px-5 py-4 md:px-8">
        <Link href="/v/experience" className="font-[var(--asynd-display)] text-lg">Irma’s</Link>
        <nav className="hidden gap-6 text-xs uppercase tracking-[0.18em] md:flex" aria-label="Experience shop">
          <Link href="/v/experience">The press</Link>
          <Link href="/v/experience/shop">Shop</Link>
          <Link href="/">Original</Link>
        </nav>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em]">
          <button type="button" className="md:hidden" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>Menu</button>
          <BagButton />
        </div>
      </header>
      {menu && (
        <nav className="flex flex-col gap-3 px-5 py-4 text-sm md:hidden">
          <Link href="/v/experience" onClick={() => setMenu(false)}>The press</Link>
          <Link href="/v/experience/shop" onClick={() => setMenu(false)}>Shop</Link>
          <Link href="/" onClick={() => setMenu(false)}>Original</Link>
        </nav>
      )}
      <main>{children}</main>
      <footer className="border-t border-[#3a342c] px-5 py-10 text-sm leading-relaxed text-[#c9bfb2] md:px-8">
        <p>CONTAINS: WHEAT, EGG, MILK.</p>
        <p className="mt-2 text-[#f4efe6]">Made in a cottage food operation that is not subject to Florida’s food safety regulations.</p>
      </footer>
      <CommerceDrawer checkoutHref="/v/experience/checkout" />
    </div>
  );
}

export function ExperienceShop() {
  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#e4b15a]">Shop</p>
        <h1 className="mt-3 font-[var(--asynd-display)] text-5xl sm:text-6xl">Two cylinders.</h1>
        <PaymentsNote className="mt-4 max-w-xl text-sm text-[#c9bfb2]" />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
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
    <article className="border border-[#3a342c] p-6">
      <PizzelleMark className="w-40" paper={flavor.id === "vanilla" ? "#f6e3c4" : "#f1e6d2"} title={`${flavor.name} pizzelle`} />
      <h2 className="mt-6 font-[var(--asynd-display)] text-4xl">{flavor.name}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#c9bfb2]">{flavor.tasting}</p>
      <fieldset className="mt-5">
        <legend className="sr-only">Pack</legend>
        <div className="flex gap-2">
          {(["6", "12"] as PackSize[]).map((id) => (
            <label key={id}>
              <input type="radio" name={`exp-shop-${flavor.id}`} className="peer sr-only" checked={pack === id} onChange={() => setPack(id)} />
              <span className="block border border-[#3a342c] px-3 py-2 text-xs uppercase tracking-[0.14em] peer-checked:border-[#e4b15a] peer-checked:text-[#e4b15a]">
                {id === "6" ? "Six" : "Dozen"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-5 font-[var(--asynd-display)] text-4xl text-[#e4b15a]">{formatCents(price.early)}</p>
      <div className="mt-5 flex gap-4">
        <button type="button" onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack })} className="bg-[#e4b15a] px-4 py-3 text-sm text-[#1a140c]">
          Add
        </button>
        <Link href={`/v/experience/p/${flavor.id}`} className="self-center text-sm underline underline-offset-4">Details</Link>
      </div>
    </article>
  );
}

export function ExperienceDetail() {
  const params = useParams<{ flavor: string }>();
  const flavor = flavorById(params.flavor || "");
  const [pack, setPack] = useState<PackSize>("6");
  const [quantity, setQuantity] = useState(1);
  const [stillOnly, setStillOnly] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  if (!flavor) {
    return (
      <Shell>
        <div className="px-5 py-24">
          <h1 className="font-[var(--asynd-display)] text-5xl">Not in this press.</h1>
          <Link href="/v/experience/shop" className="mt-4 inline-block underline">Shop</Link>
        </div>
      </Shell>
    );
  }
  const price = priceFor(data, pack);
  return (
    <Shell>
      <article className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
        <div className="relative min-h-[420px] bg-[#14110e]">
          {stillOnly ? (
            <PizzelleMark className="h-full w-full p-8" paper={flavor.id === "vanilla" ? "#f6e3c4" : "#f1e6d2"} title={`${flavor.name} pizzelle`} />
          ) : (
            <Boundary fallback={<PizzelleMark className="h-full w-full p-8" title={`${flavor.name} pizzelle`} />}>
              <Suspense fallback={<div className="absolute inset-0 bg-[#14110e]" />}>
                <div className="absolute inset-0">
                  <StillCanvas flavor={flavor.id} pack={pack} />
                </div>
              </Suspense>
            </Boundary>
          )}
          <button type="button" onClick={() => setStillOnly((value) => !value)} className="absolute bottom-4 left-4 z-10 text-xs uppercase tracking-[0.16em] text-[#e4b15a]">
            {stillOnly ? "Show the cylinder" : "Hide motion"}
          </button>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e4b15a]">{flavor.epithet}</p>
          <h1 className="mt-2 font-[var(--asynd-display)] text-5xl">{flavor.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#c9bfb2]">{flavor.description}</p>
          <fieldset className="mt-6">
            <legend className="text-sm">Pack</legend>
            <div className="mt-2 flex gap-2">
              {(["6", "12"] as PackSize[]).map((id) => (
                <label key={id}>
                  <input type="radio" name="exp-detail-pack" className="peer sr-only" checked={pack === id} onChange={() => setPack(id)} />
                  <span className="block border border-[#3a342c] px-3 py-2 text-sm peer-checked:border-[#e4b15a] peer-checked:text-[#e4b15a]">
                    {id === "6" ? "Six" : "Dozen"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label htmlFor="exp-qty" className="mt-5 block text-sm">
            Quantity
            <input id="exp-qty" type="number" min={1} max={12} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-2 w-24 border border-[#3a342c] bg-transparent px-3 py-2" />
          </label>
          <p className="mt-5 font-[var(--asynd-display)] text-5xl text-[#e4b15a]">{formatCents(price.early * quantity)}</p>
          <button type="button" onClick={() => cart.addLine({ flavor: flavor.id, packSize: pack }, quantity)} className="mt-5 bg-[#e4b15a] px-5 py-3 text-sm text-[#1a140c]">
            Add to bag
          </button>
          <p className="mt-8 text-sm font-semibold">CONTAINS: WHEAT, EGG, MILK.</p>
          <p className="mt-3 text-sm leading-relaxed text-[#c9bfb2]">{flavor.ingredients}</p>
          <p className="mt-4 text-sm">Made in a cottage food operation that is not subject to Florida’s food safety regulations.</p>
          <p className="mt-4 text-xs leading-relaxed text-[#c9bfb2]">
            {NUTRITION.servingSize}. {NUTRITION.calories} calories. Fat {NUTRITION.totalFat}. Sodium {NUTRITION.sodium}. Carbohydrate {NUTRITION.totalCarb}. Protein {NUTRITION.protein}. {NUTRITION.servingsNote}
          </p>
        </div>
      </article>
    </Shell>
  );
}
