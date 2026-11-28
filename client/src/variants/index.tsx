import { Link } from "wouter";
import { useStylesheet } from "@/variants/PizzelleMark";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&display=swap";

const DIRECTIONS = [
  {
    href: "/v/atelier",
    index: "01",
    name: "Atelier",
    line: "Editorial. A fashion-house page for a five-inch wafer.",
  },
  {
    href: "/v/heritage",
    index: "02",
    name: "Heritage",
    line: "The kitchen, told straight. Paper, oxblood, Irma’s iron.",
  },
  {
    href: "/v/experience",
    index: "03",
    name: "Experience",
    line: "The press, in three dimensions. Scroll, and the pattern appears.",
  },
];

export default function VariantIndex() {
  useStylesheet(FONT);
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1c1915]" style={{ fontFamily: '"Outfit", sans-serif' }}>
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b625a]">Mjolnir Design Studios · Asynd</p>
        <h1 className="mt-4 text-5xl leading-none sm:text-6xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
          Three ways to open the batch.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#5c564c]">
          The site you already have stays at the root. These are front-end studies for the pre-order — same cookies, three different rooms.
        </p>
        <ul className="mt-12 divide-y divide-[#ddd4c8] border-y border-[#ddd4c8]">
          {DIRECTIONS.map((direction) => (
            <li key={direction.href}>
              <Link href={direction.href} className="flex items-baseline justify-between gap-6 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                <span>
                  <span className="mr-4 text-xs tracking-[0.2em] text-[#6b625a]">{direction.index}</span>
                  <span className="text-3xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>{direction.name}</span>
                  <span className="mt-2 block text-sm text-[#5c564c]">{direction.line}</span>
                </span>
                <span aria-hidden className="text-sm">→</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/" className="flex items-baseline justify-between gap-6 py-6">
              <span>
                <span className="mr-4 text-xs tracking-[0.2em] text-[#6b625a]">00</span>
                <span className="text-3xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>Current site</span>
                <span className="mt-2 block text-sm text-[#5c564c]">Unchanged. The shop, the waitlist, the snowfall.</span>
              </span>
              <span aria-hidden className="text-sm">→</span>
            </Link>
          </li>
        </ul>
        <p className="mt-10 text-sm">
          <Link href="/v/admin" className="underline underline-offset-4">Order desk</Link>
        </p>
      </div>
    </div>
  );
}
