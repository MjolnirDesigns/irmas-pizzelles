import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useStylesheet } from "@/variants/PizzelleMark";
import { useCommerceCart } from "@/commerce/cart";
import { formatCents, priceFor, useCommerceConfig } from "@/commerce/use-config";
import { flavorById, packById, type FulfillmentMethod } from "@shared/catalog";

export type VariantId = "atelier" | "heritage" | "experience";

const THEMES: Record<VariantId, { href: string; style: React.CSSProperties; home: string; label: string }> = {
  atelier: {
    href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&display=swap",
    home: "/v/atelier",
    label: "Atelier",
    style: {
      "--asynd-bg": "#f3efe8",
      "--asynd-ink": "#1b1714",
      "--asynd-muted": "#5e564e",
      "--asynd-line": "#d5cdc2",
      "--asynd-accent": "#1b1714",
      "--asynd-accent-ink": "#f3efe8",
      "--asynd-display": '"Instrument Serif", Georgia, serif',
      "--asynd-sans": '"Outfit", sans-serif',
    } as React.CSSProperties,
  },
  heritage: {
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,560;1,9..144,500&family=Source+Sans+3:wght@400;600&display=swap",
    home: "/v/heritage",
    label: "Heritage",
    style: {
      "--asynd-bg": "#f3e6d0",
      "--asynd-ink": "#2a1612",
      "--asynd-muted": "#5c463c",
      "--asynd-line": "#c9b39a",
      "--asynd-accent": "#6e2433",
      "--asynd-accent-ink": "#f8f1e4",
      "--asynd-display": '"Fraunces", Georgia, serif',
      "--asynd-sans": '"Source Sans 3", sans-serif',
    } as React.CSSProperties,
  },
  experience: {
    href: "https://fonts.googleapis.com/css2?family=Syne:wght@500;700&family=Manrope:wght@400;500;600&display=swap",
    home: "/v/experience",
    label: "Experience",
    style: {
      "--asynd-bg": "#100e0c",
      "--asynd-ink": "#f4efe6",
      "--asynd-muted": "#c9bfb2",
      "--asynd-line": "#3a342c",
      "--asynd-accent": "#e4b15a",
      "--asynd-accent-ink": "#1a140c",
      "--asynd-display": '"Syne", sans-serif',
      "--asynd-sans": '"Manrope", sans-serif',
    } as React.CSSProperties,
  },
};

export default function VariantCheckout({ variant = "atelier" }: { variant?: VariantId }) {
  const theme = THEMES[variant] ?? THEMES.atelier;
  useStylesheet(theme.href);
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  const [, navigate] = useLocation();
  const canceled = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("canceled") === "1";

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("FL");
  const [zipCode, setZipCode] = useState("");
  const [reorder, setReorder] = useState(false);
  const [idea, setIdea] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const lines = cart.lines.map((line) => {
      const price = priceFor(data, line.packSize);
      return {
        ...line,
        name: flavorById(line.flavor)?.name ?? line.flavor,
        pack: packById(line.packSize)?.name ?? line.packSize,
        early: price.early,
        list: price.list,
      };
    });
    const early = lines.reduce((sum, line) => sum + line.early * line.quantity, 0);
    const list = lines.reduce((sum, line) => sum + line.list * line.quantity, 0);
    const shipping =
      fulfillment === "local_delivery"
        ? data?.fulfillment.local_delivery.cents ?? 500
        : fulfillment === "in_state_shipping"
          ? data?.fulfillment.in_state_shipping.cents ?? 800
          : 0;
    return { lines, early, list, shipping, total: early + shipping, savings: list - early };
  }, [cart.lines, data, fulfillment]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (cart.lines.length === 0) {
      setError("Your bag is empty.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phone,
          items: cart.lines,
          fulfillment,
          address: fulfillment === "pickup" ? undefined : { street, city, state, zipCode },
          wouldReorderMonthly: reorder,
          thirdFlavorIdea: idea || undefined,
          customerNotes: notes || undefined,
          marketingOptIn: true,
          variant,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error || "Could not reserve this batch.");
        setBusy(false);
        return;
      }
      if (body.checkoutUrl) {
        window.location.assign(body.checkoutUrl);
        return;
      }
      cart.clear();
      navigate(`/v/order/${body.orderNumber}?v=${variant}`);
    } catch {
      setError("Could not reach checkout.");
      setBusy(false);
    }
  }

  const field = "mt-1 w-full border border-[var(--asynd-line)] bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--asynd-ink)]";

  return (
    <div style={theme.style} className="min-h-screen bg-[var(--asynd-bg)] text-[var(--asynd-ink)] font-[var(--asynd-sans)]">
      <header className="border-b border-[var(--asynd-line)] px-5 py-5 md:px-8">
        <Link href={theme.home} className="text-sm underline-offset-4 hover:underline">← {theme.label}</Link>
        <h1 className="mt-3 font-[var(--asynd-display)] text-5xl">Reserve the batch</h1>
      </header>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 md:grid-cols-12 md:px-8">
        <form onSubmit={onSubmit} className="space-y-6 md:col-span-7" noValidate>
          {canceled && (
            <p role="status" className="border border-[var(--asynd-line)] px-4 py-3 text-sm">
              Stripe checkout was canceled. Nothing was charged. Your bag is still here.
            </p>
          )}
          {data && !data.stripeConfigured && (
            <p role="status" className="border border-[var(--asynd-line)] px-4 py-3 text-sm leading-relaxed">
              Payments are not configured. Submitting records a reservation and does not charge a card.
            </p>
          )}
          {data && !data.preorderOpen && (
            <p role="status" className="border border-[var(--asynd-line)] px-4 py-3 text-sm">This batch is closed.</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">First name
              <input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className={field} autoComplete="given-name" />
            </label>
            <label className="text-sm">Last name
              <input required value={lastName} onChange={(event) => setLastName(event.target.value)} className={field} autoComplete="family-name" />
            </label>
          </div>
          <label className="block text-sm">Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={field} autoComplete="email" />
          </label>
          <label className="block text-sm">Phone
            <input required value={phone} onChange={(event) => setPhone(event.target.value)} className={field} autoComplete="tel" />
          </label>

          <fieldset>
            <legend className="text-sm">How should this batch reach you?</legend>
            <div className="mt-3 space-y-3 text-sm">
              <FulfillmentOption
                name="pickup"
                current={fulfillment}
                onChange={setFulfillment}
                title="Pickup · free"
                detail={data?.fulfillment.pickup.note || "Tampa Bay pickup. We confirm the window by email."}
              />
              <FulfillmentOption
                name="local_delivery"
                current={fulfillment}
                onChange={setFulfillment}
                title={`Local delivery · ${formatCents(data?.fulfillment.local_delivery.cents ?? 500)}`}
                detail={`ZIP prefixes ${(data?.fulfillment.local_delivery.zipPrefixes || ["335", "336", "337", "338", "342", "346"]).join(", ")}. Florida only.`}
              />
              <FulfillmentOption
                name="in_state_shipping"
                current={fulfillment}
                onChange={setFulfillment}
                title={`Florida shipping · ${formatCents(data?.fulfillment.in_state_shipping.cents ?? 800)}`}
                detail="Cottage-food orders ship inside Florida only. Other states are refused."
              />
            </div>
          </fieldset>

          {fulfillment !== "pickup" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">Street
                <input required value={street} onChange={(event) => setStreet(event.target.value)} className={field} autoComplete="address-line1" />
              </label>
              <label className="text-sm">City
                <input required value={city} onChange={(event) => setCity(event.target.value)} className={field} autoComplete="address-level2" />
              </label>
              <label className="text-sm">State
                <input required value={state} onChange={(event) => setState(event.target.value)} className={field} autoComplete="address-level1" aria-describedby="state-help" />
              </label>
              <p id="state-help" className="text-xs text-[var(--asynd-muted)] sm:col-span-2">
                Use FL. Any other state is turned away — interstate cottage-food shipping is not part of this launch.
              </p>
              <label className="text-sm">ZIP
                <input required value={zipCode} onChange={(event) => setZipCode(event.target.value)} className={field} autoComplete="postal-code" inputMode="numeric" />
              </label>
            </div>
          )}

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={reorder} onChange={(event) => setReorder(event.target.checked)} className="mt-1" />
            I would reorder a cylinder monthly.
          </label>
          <label className="block text-sm">If we press a third flavor
            <input value={idea} onChange={(event) => setIdea(event.target.value)} className={field} maxLength={200} />
          </label>
          <label className="block text-sm">Note for the kitchen
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className={field} rows={3} maxLength={500} />
          </label>

          <p className="text-sm">CONTAINS: WHEAT, EGG, MILK.</p>
          <p className="text-sm leading-relaxed">
            Made in a cottage food operation that is not subject to Florida’s food safety regulations.
          </p>
          {data?.tax?.note && <p className="text-xs leading-relaxed text-[var(--asynd-muted)]">{data.tax.note}</p>}

          {error && <p role="alert" className="text-sm">{error}</p>}
          <button
            type="submit"
            disabled={busy || cart.lines.length === 0}
            className="bg-[var(--asynd-accent)] px-6 py-3 text-sm text-[var(--asynd-accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-50"
          >
            {busy ? "Saving…" : data?.stripeConfigured ? "Continue to Stripe test checkout" : "Reserve without payment"}
          </button>
        </form>

        <aside className="h-fit border border-[var(--asynd-line)] p-6 md:col-span-5">
          <h2 className="font-[var(--asynd-display)] text-3xl">This batch</h2>
          {summary.lines.length === 0 && <p className="mt-4 text-sm text-[var(--asynd-muted)]">Nothing in the bag yet.</p>}
          <ul className="mt-4 space-y-4">
            {summary.lines.map((line) => (
              <li key={`${line.flavor}-${line.packSize}`} className="flex justify-between gap-4 text-sm">
                <span>{line.quantity} × {line.name}, {line.pack}</span>
                <span>{formatCents(line.early * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><dt>List</dt><dd>{formatCents(summary.list)}</dd></div>
            <div className="flex justify-between"><dt>Early bird</dt><dd>−{formatCents(summary.savings)}</dd></div>
            <div className="flex justify-between"><dt>Fulfillment</dt><dd>{formatCents(summary.shipping)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>$0.00</dd></div>
            <div className="flex justify-between font-[var(--asynd-display)] text-2xl"><dt>Total</dt><dd>{formatCents(summary.total)}</dd></div>
          </dl>
          {data && (
            <p className="mt-4 text-xs text-[var(--asynd-muted)]">
              {data.batchLabel}. About {data.dozenUnitsRemaining.toFixed(0)} dozen still open in this batch.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function FulfillmentOption({
  name,
  current,
  onChange,
  title,
  detail,
}: {
  name: FulfillmentMethod;
  current: FulfillmentMethod;
  onChange: (value: FulfillmentMethod) => void;
  title: string;
  detail: string;
}) {
  return (
    <label className="block cursor-pointer border border-[var(--asynd-line)] px-4 py-3">
      <input type="radio" name="fulfillment" className="mr-3" checked={current === name} onChange={() => onChange(name)} />
      <span className="font-medium">{title}</span>
      <span className="mt-1 block pl-6 text-[var(--asynd-muted)]">{detail}</span>
    </label>
  );
}
