import { useState } from "react";
import type { FlavorId, PackSize } from "@shared/catalog";

export default function SurveyForm({
  variant,
  idPrefix = "survey",
}: {
  variant: string;
  idPrefix?: string;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [preferredFlavor, setPreferredFlavor] = useState<FlavorId>("anise");
  const [preferredPackSize, setPreferredPackSize] = useState<PackSize>("12");
  const [reorder, setReorder] = useState<"yes" | "no" | "unsure">("unsure");
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/commerce/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          preferredFlavor,
          preferredPackSize,
          wouldReorderMonthly: reorder === "yes" ? true : reorder === "no" ? false : undefined,
          thirdFlavorIdea: idea || undefined,
          marketingOptIn: true,
          variant,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus("error");
        setMessage(body.error || "Could not save that.");
        return;
      }
      setStatus("saved");
      setMessage("Saved. We’ll write when this batch, or the next iron, is ready.");
    } catch {
      setStatus("error");
      setMessage("Could not reach the kitchen. Try again.");
    }
  }

  const field = "mt-2 w-full border border-[var(--asynd-line)] bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--asynd-ink)]";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor={`${idPrefix}-name`} className="text-sm">Name</label>
        <input id={`${idPrefix}-name`} value={firstName} onChange={(event) => setFirstName(event.target.value)} className={field} autoComplete="given-name" />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className="text-sm">Email</label>
        <input id={`${idPrefix}-email`} type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={field} autoComplete="email" />
      </div>
      <fieldset>
        <legend className="text-sm">Flavor you’d reorder</legend>
        <div className="mt-2 flex gap-4 text-sm">
          {(["anise", "vanilla"] as FlavorId[]).map((flavor) => (
            <label key={flavor} className="capitalize">
              <input
                type="radio"
                name={`${idPrefix}-flavor`}
                checked={preferredFlavor === flavor}
                onChange={() => setPreferredFlavor(flavor)}
                className="mr-2"
              />
              {flavor}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm">Pack</legend>
        <div className="mt-2 flex gap-4 text-sm">
          <label>
            <input type="radio" name={`${idPrefix}-pack`} checked={preferredPackSize === "6"} onChange={() => setPreferredPackSize("6")} className="mr-2" />
            Six
          </label>
          <label>
            <input type="radio" name={`${idPrefix}-pack`} checked={preferredPackSize === "12"} onChange={() => setPreferredPackSize("12")} className="mr-2" />
            Dozen
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm">Would you reorder monthly?</legend>
        <div className="mt-2 flex gap-4 text-sm">
          {(["yes", "no", "unsure"] as const).map((option) => (
            <label key={option} className="capitalize">
              <input type="radio" name={`${idPrefix}-reorder`} checked={reorder === option} onChange={() => setReorder(option)} className="mr-2" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${idPrefix}-idea`} className="text-sm">If there is a third flavor, what should it be?</label>
        <input id={`${idPrefix}-idea`} value={idea} onChange={(event) => setIdea(event.target.value)} maxLength={200} className={field} />
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-[var(--asynd-accent)] px-5 py-3 text-sm text-[var(--asynd-accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Send the note"}
      </button>
      {message && (
        <p role="status" className="text-sm leading-relaxed">
          {message}
        </p>
      )}
    </form>
  );
}
