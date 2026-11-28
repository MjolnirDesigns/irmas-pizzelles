import { useEffect } from "react";
import { Link } from "wouter";
import { formatCents, priceFor, useCommerceConfig } from "@/commerce/use-config";
import { useCommerceCart, type CommerceLine } from "@/commerce/cart";
import { flavorById, packById } from "@shared/catalog";

export function CommerceDrawer({ checkoutHref }: { checkoutHref: string }) {
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();

  useEffect(() => {
    if (!cart.open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") cart.setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart]);

  if (!cart.open) return null;

  const subtotal = cart.lines.reduce((sum, line) => sum + priceFor(data, line.packSize).early * line.quantity, 0);

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close bag"
        onClick={() => cart.setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--asynd-bg)] text-[var(--asynd-ink)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--asynd-line)] px-6 py-5">
          <h2 className="font-[var(--asynd-display)] text-3xl">Your batch</h2>
          <button
            type="button"
            onClick={() => cart.setOpen(false)}
            className="rounded-full px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--asynd-ink)]"
          >
            Close
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-auto px-6 py-6">
          {cart.lines.length === 0 && (
            <p className="text-sm leading-relaxed text-[var(--asynd-muted)]">
              Nothing reserved yet. Choose Anise or Vanilla, then a six or a dozen.
            </p>
          )}
          {cart.lines.map((line) => (
            <LineEditor key={`${line.flavor}-${line.packSize}`} line={line} />
          ))}
        </div>
        <div className="border-t border-[var(--asynd-line)] px-6 py-5">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm">Early-bird subtotal</span>
            <span className="font-[var(--asynd-display)] text-2xl">{formatCents(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-[var(--asynd-muted)]">
            {data?.allergenStatement || "CONTAINS: WHEAT, EGG, MILK."} Florida pickup, local delivery, or in-state shipping only.
          </p>
          <Link
            href={checkoutHref}
            onClick={() => cart.setOpen(false)}
            className="block bg-[var(--asynd-accent)] px-4 py-3 text-center text-sm tracking-wide text-[var(--asynd-accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--asynd-ink)]"
          >
            Reserve this batch
          </Link>
        </div>
      </aside>
    </div>
  );
}

function LineEditor({ line }: { line: CommerceLine }) {
  const cart = useCommerceCart();
  const { data } = useCommerceConfig();
  const flavor = flavorById(line.flavor);
  const pack = packById(line.packSize);
  const price = priceFor(data, line.packSize);
  return (
    <div className="border-b border-[var(--asynd-line)] pb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[var(--asynd-display)] text-2xl">{flavor?.name}</p>
          <p className="text-sm text-[var(--asynd-muted)]">{pack?.name} · {pack?.cookies} wafers</p>
        </div>
        <p className="text-sm">{formatCents(price.early * line.quantity)}</p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs uppercase tracking-wider text-[var(--asynd-muted)]" htmlFor={`qty-${line.flavor}-${line.packSize}`}>
          Quantity
        </label>
        <input
          id={`qty-${line.flavor}-${line.packSize}`}
          type="number"
          min={1}
          max={12}
          value={line.quantity}
          onChange={(event) => cart.setQuantity(line.flavor, line.packSize, Number(event.target.value))}
          className="w-16 border border-[var(--asynd-line)] bg-transparent px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--asynd-ink)]"
        />
        <button
          type="button"
          onClick={() => cart.removeLine(line.flavor, line.packSize)}
          className="text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function BagButton({ className }: { className?: string }) {
  const cart = useCommerceCart();
  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className={className}
      aria-label={`Open bag, ${cart.totalItems} packs`}
    >
      Bag{cart.totalItems > 0 ? ` ${String(cart.totalItems).padStart(2, "0")}` : ""}
    </button>
  );
}

export function PaymentsNote({ className }: { className?: string }) {
  const { data } = useCommerceConfig();
  if (!data || data.stripeConfigured) return null;
  return (
    <p className={className} role="status">
      Payments are not configured. You can reserve a batch; you will not be charged.
    </p>
  );
}
