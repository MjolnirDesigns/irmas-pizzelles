import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { FLAVORS, type FlavorId, type PackSize } from "@shared/catalog";
import PizzelleMark, { useStylesheet } from "@/variants/PizzelleMark";
import { BagButton, CommerceDrawer, PaymentsNote } from "@/variants/shell";
import { useCommerceCart } from "@/commerce/cart";
import { formatCents, priceFor, useCommerceConfig } from "@/commerce/use-config";
import SurveyForm from "@/variants/SurveyForm";

const StoryCanvas = lazy(() => import("./PizzelleScene"));
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

const CHAPTERS = [
  {
    kicker: "The iron",
    title: "It comes down hot.",
    body: "One wafer, five inches, the pattern still hiding in the batter.",
  },
  {
    kicker: "The pattern",
    title: "The iron leaves the flower.",
    body: "Spokes, petals, a ring of diamonds. That is the whole decoration.",
  },
  {
    kicker: "The cylinder",
    title: "Then it stacks, and the tin closes.",
    body: "Six or twelve. Clear PET. Florida only, while this is a cottage kitchen.",
  },
];

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function wantsStillLife() {
  if (typeof window === "undefined") return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return reduce || saveData || memory <= 2;
}

export default function ExperienceHome() {
  useStylesheet(FONT);
  const [menu, setMenu] = useState(false);
  const [mode, setMode] = useState<"3d" | "still">(() => (wantsStillLife() ? "still" : "3d"));
  const [flavor, setFlavor] = useState<FlavorId>("anise");
  const [pack, setPack] = useState<PackSize>("12");
  const [chapter, setChapter] = useState(0);
  const storyRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  const price = priceFor(data, pack);
  const active = FLAVORS.find((item) => item.id === flavor)!;

  useEffect(() => {
    if (mode !== "3d") return;
    const story = storyRef.current;
    if (!story) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    const update = () => {
      const rect = story.getBoundingClientRect();
      const total = story.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      progressRef.current = progress;
      const next = progress < 0.32 ? 0 : progress < 0.68 ? 1 : 2;
      setChapter((current) => (current === next ? current : next));
    };
    lenis.on("scroll", update);
    let frame = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });
    update();
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [mode]);

  const copy = CHAPTERS[chapter];

  return (
    <div style={theme} className="min-h-screen bg-[var(--asynd-bg)] text-[var(--asynd-ink)] font-[var(--asynd-sans)]">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-black focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-8">
        <Link href="/v/experience" className="font-[var(--asynd-display)] text-lg tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4b15a]">
          Irma’s
        </Link>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-[#f4efe6] md:flex" aria-label="Experience">
          <a href="#batch">Batch</a>
          <Link href="/v/experience/shop">Shop</Link>
          <a href="#note">Note</a>
          <Link href="/">Original</Link>
        </nav>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em]">
          <button type="button" className="md:hidden" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>
            {menu ? "Close" : "Menu"}
          </button>
          <BagButton className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e4b15a]" />
        </div>
      </header>
      {menu && (
        <nav className="fixed inset-x-0 top-14 z-40 flex flex-col gap-3 bg-[#100e0c] px-5 py-4 text-sm md:hidden" aria-label="Experience mobile">
          <a href="#batch" onClick={() => setMenu(false)}>Batch</a>
          <Link href="/v/experience/shop" onClick={() => setMenu(false)}>Shop</Link>
          <a href="#note" onClick={() => setMenu(false)}>Note</a>
          <Link href="/" onClick={() => setMenu(false)}>Original</Link>
        </nav>
      )}

      {mode === "3d" ? (
        <section ref={storyRef} id="content" className="relative h-[320vh]" aria-label="A scroll through the press, the pattern, and the cylinder">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-0" aria-hidden>
              <SceneBoundary fallback={<StillLife flavor={flavor} />}>
                <Suspense fallback={<div className="h-full w-full bg-[#14110e]" />}>
                  <StoryCanvas progressRef={progressRef} flavor={flavor} pack={pack} />
                </Suspense>
              </SceneBoundary>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[#100e0c] via-[#100e0c]/85 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 md:px-10 md:pb-12">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#e4b15a]">{copy.kicker}</p>
              <h1 className="mt-2 max-w-xl font-[var(--asynd-display)] text-4xl leading-none sm:text-6xl">{copy.title}</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#f4efe6]">{copy.body}</p>
              <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3">
                <FlavorSwitch flavor={flavor} onChange={setFlavor} />
                <PackSwitch pack={pack} onChange={setPack} />
                <button
                  type="button"
                  onClick={() => setMode("still")}
                  className="text-xs uppercase tracking-[0.16em] text-[#c9bfb2] underline underline-offset-4"
                >
                  Still life
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section id="content" className="px-5 pb-16 pt-28 md:px-10">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
            <StillLife flavor={flavor} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#e4b15a]">Still life</p>
              <h1 className="mt-3 font-[var(--asynd-display)] text-5xl leading-none sm:text-6xl">The press, held still.</h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#c9bfb2]">
                Motion is off — either you asked for less of it, or this device is saving power. The wafer is the same: five inches, anise or vanilla, stacked in a clear cylinder.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <FlavorSwitch flavor={flavor} onChange={setFlavor} />
                <PackSwitch pack={pack} onChange={setPack} />
              </div>
              <button
                type="button"
                onClick={() => setMode("3d")}
                className="mt-6 bg-[#e4b15a] px-4 py-3 text-sm text-[#1a140c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Play the press
              </button>
            </div>
          </div>
        </section>
      )}

      <section id="batch" className="border-t border-[#3a342c] px-5 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-[var(--asynd-display)] text-4xl sm:text-5xl">{active.name}, {pack === "12" ? "a dozen" : "a six"}.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#c9bfb2]">{active.description}</p>
            <p className="mt-4 text-sm text-[#c9bfb2]">{active.tasting}</p>
            <p className="mt-6 font-[var(--asynd-display)] text-5xl text-[#e4b15a]">{formatCents(price.early)}</p>
            <p className="text-xs text-[#c9bfb2]">List {formatCents(price.list)} · early bird {price.percent}%</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => cart.addLine({ flavor, packSize: pack })}
                className="bg-[#e4b15a] px-5 py-3 text-sm text-[#1a140c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Add to bag
              </button>
              <Link href={`/v/experience/p/${flavor}`} className="self-center text-sm underline underline-offset-4">
                Label & nutrition
              </Link>
            </div>
            <PaymentsNote className="mt-4 max-w-md text-sm text-[#c9bfb2]" />
            <p className="mt-6 text-sm">CONTAINS: WHEAT, EGG, MILK.</p>
          </div>
          <div className="grid gap-4">
            {FLAVORS.map((item) => (
              <Link key={item.id} href={`/v/experience/p/${item.id}`} className="border border-[#3a342c] p-5 transition hover:border-[#e4b15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e4b15a]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#e4b15a]">{item.epithet}</p>
                <p className="mt-2 font-[var(--asynd-display)] text-3xl">{item.name}</p>
                <p className="mt-2 text-sm text-[#c9bfb2]">{item.tasting}</p>
              </Link>
            ))}
            <div className="border border-dashed border-[#3a342c] p-5">
              <p className="font-[var(--asynd-display)] text-3xl">Third flavor</p>
              <p className="mt-2 text-sm text-[#c9bfb2]">Not pressed yet. The note below is where it gets a name.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="note" className="border-t border-[#3a342c] px-5 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-[var(--asynd-display)] text-4xl">Tell us what to press next.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#c9bfb2]">
              Kerrygold grass-fed butter, about sixty wafers a batch, $10 a dozen before the early bird. Pickup, Tampa Bay delivery, or shipping that stays in Florida.
            </p>
            <p className="mt-6 text-sm leading-relaxed">
              Made in a cottage food operation that is not subject to Florida’s food safety regulations.
            </p>
          </div>
          <SurveyForm variant="experience" idPrefix="experience-survey" />
        </div>
      </section>
      <CommerceDrawer checkoutHref="/v/experience/checkout" />
    </div>
  );
}

function StillLife({ flavor }: { flavor: FlavorId }) {
  return (
    <div className="flex items-center justify-center bg-[#14110e] p-8">
      <PizzelleMark
        className="w-full max-w-md"
        paper={flavor === "vanilla" ? "#f6e3c4" : "#f1e6d2"}
        ink={flavor === "vanilla" ? "#8d6844" : "#6d5438"}
        title={`${flavor} pizzelle, held still`}
      />
    </div>
  );
}

function FlavorSwitch({ flavor, onChange }: { flavor: FlavorId; onChange: (flavor: FlavorId) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">Flavor</legend>
      <div className="flex gap-2">
        {(["anise", "vanilla"] as FlavorId[]).map((id) => (
          <label key={id}>
            <input type="radio" name="exp-flavor" className="peer sr-only" checked={flavor === id} onChange={() => onChange(id)} />
            <span className="block border border-[#f4efe6]/30 px-3 py-2 text-xs uppercase tracking-[0.16em] peer-checked:border-[#e4b15a] peer-checked:text-[#e4b15a] peer-focus-visible:outline peer-focus-visible:outline-2">
              {id}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PackSwitch({ pack, onChange }: { pack: PackSize; onChange: (pack: PackSize) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">Pack size</legend>
      <div className="flex gap-2">
        {(["6", "12"] as PackSize[]).map((id) => (
          <label key={id}>
            <input type="radio" name="exp-pack" className="peer sr-only" checked={pack === id} onChange={() => onChange(id)} />
            <span className="block border border-[#f4efe6]/30 px-3 py-2 text-xs uppercase tracking-[0.16em] peer-checked:border-[#e4b15a] peer-checked:text-[#e4b15a] peer-focus-visible:outline peer-focus-visible:outline-2">
              {id === "6" ? "Six" : "Dozen"}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
