import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { useStylesheet } from "@/variants/PizzelleMark";
import type { VariantId } from "@/variants/checkout";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&display=swap";

export default function OrderConfirmation() {
  useStylesheet(FONT);
  const params = useParams<{ orderNumber: string }>();
  const variant = (typeof window !== "undefined"
    ? (new URLSearchParams(window.location.search).get("v") as VariantId | null)
    : null) || "atelier";
  const home = variant === "heritage" ? "/v/heritage" : variant === "experience" ? "/v/experience" : "/v/atelier";

  const query = useQuery({
    queryKey: ["order", params.orderNumber],
    enabled: Boolean(params.orderNumber),
    queryFn: async () => {
      const response = await fetch(`/api/orders/${params.orderNumber}`);
      if (!response.ok) throw new Error("Order not found");
      return response.json();
    },
  });

  const dark = variant === "experience";
  const bg = dark ? "#100e0c" : variant === "heritage" ? "#f3e6d0" : "#f3efe8";
  const ink = dark ? "#f4efe6" : variant === "heritage" ? "#2a1612" : "#1b1714";

  return (
    <div className="min-h-screen px-5 py-16" style={{ background: bg, color: ink, fontFamily: '"Outfit", sans-serif' }}>
      <div className="mx-auto max-w-xl">
        <Link href={home} className="text-sm underline underline-offset-4">Back</Link>
        {query.isLoading && <p className="mt-10 text-sm">Looking up the reservation…</p>}
        {query.isError && <h1 className="mt-10 font-[var(--font)] text-4xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>We couldn’t find that order.</h1>}
        {query.data && <Receipt order={query.data} />}
      </div>
    </div>
  );
}

function Receipt({ order }: { order: Record<string, any> }) {
  const paid = order.paymentState === "paid" || order.status === "paid";
  const unconfigured = order.paymentState === "not_configured";
  return (
    <article className="mt-8">
      <p className="text-xs uppercase tracking-[0.22em] opacity-70">{order.batchLabel || "Pre-order"}</p>
      <h1 className="mt-3 text-5xl leading-none" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
        {paid ? "You’re in the batch." : unconfigured ? "Reservation saved." : "Waiting on payment."}
      </h1>
      <p className="mt-4 text-sm leading-relaxed">
        Order {order.orderNumber}. {paid && "Stripe marked this paid."}
        {unconfigured && " Payments are not configured, so this reservation was recorded and you were not charged."}
        {!paid && !unconfigured && " If you just left Stripe, this page updates when the webhook marks the order paid. Until then it stays as a hold."}
      </p>
      <dl className="mt-8 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Status</dt><dd>{order.status}</dd></div>
        <div className="flex justify-between"><dt>Payment</dt><dd>{order.paymentState || "pending"}</dd></div>
        <div className="flex justify-between"><dt>Fulfillment</dt><dd>{String(order.fulfillmentMethod || "pickup").replaceAll("_", " ")}</dd></div>
        <div className="flex justify-between"><dt>Total</dt><dd>${order.total}</dd></div>
      </dl>
      <ul className="mt-6 space-y-2 text-sm">
        {(order.items || []).map((item: { id: string; quantity: number; productName: string; total: string }) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span>{item.quantity} × {item.productName}</span>
            <span>${item.total}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">CONTAINS: WHEAT, EGG, MILK.</p>
      <p className="mt-3 text-sm leading-relaxed">
        Made in a cottage food operation that is not subject to Florida’s food safety regulations.
      </p>
    </article>
  );
}
