"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FOUNDER, FOUNDER_SESSION, SESSION_FOCUS, SESSION_URL } from "@/lib/seo";

export function SessionBookingForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [focus, setFocus] = useState<(typeof SESSION_FOCUS)[number]["id"]>("beginner");
  const [day, setDay] = useState<(typeof FOUNDER_SESSION.availableDays)[number]>("Monday");
  const [when, setWhen] = useState("");
  const [goal, setGoal] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [copied, setCopied] = useState(false);

  const focusLabel = useMemo(
    () => SESSION_FOCUS.find((f) => f.id === focus)?.title ?? "Beginner start",
    [focus]
  );

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hello ${FOUNDER.name}, I want to book a Talk with Founder session.`,
      ``,
      `Session: ${FOUNDER_SESSION.durationMinutes} minutes · ${FOUNDER_SESSION.currencyLabel}`,
      `Name: ${name.trim() || "—"}`,
      `WhatsApp/Phone: ${contact.trim() || "—"}`,
      `Focus: ${focusLabel}`,
      `Preferred day: ${day}`,
      `Preferred time: ${when.trim() || "Flexible"}`,
      `What I need help with: ${goal.trim() || "—"}`,
      ``,
      `I understand the session fee is $${FOUNDER_SESSION.priceUsd} and I am ready to confirm payment details with you.`,
      ``,
      `Session page: ${SESSION_URL}`,
    ];
    return `https://wa.me/${FOUNDER.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [name, contact, focusLabel, day, when, goal]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !contact.trim() || !agreed) return;
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SESSION_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            Your name
          </span>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ada"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            WhatsApp / phone
          </span>
          <input
            className="input-field"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. 0901…"
            required
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">
            Session focus
          </legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {SESSION_FOCUS.map((item) => (
              <label
                key={item.id}
                className={`rounded-xl border p-3 cursor-pointer transition ${
                  focus === item.id
                    ? "border-[rgba(200,255,60,0.45)] bg-[var(--lime-dim)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]"
                }`}
              >
                <input
                  type="radio"
                  name="focus"
                  className="sr-only"
                  checked={focus === item.id}
                  onChange={() => setFocus(item.id)}
                />
                <span className="block font-semibold text-sm mb-1">{item.title}</span>
                <span className="block text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.body}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">
            Available day
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {FOUNDER_SESSION.availableDays.map((d) => (
              <label
                key={d}
                className={`rounded-xl border px-2 py-3 text-center cursor-pointer transition text-sm font-semibold ${
                  day === d
                    ? "border-[rgba(200,255,60,0.45)] bg-[var(--lime-dim)] text-[var(--lime)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                }`}
              >
                <input
                  type="radio"
                  name="day"
                  className="sr-only"
                  checked={day === d}
                  onChange={() => setDay(d)}
                />
                {d.slice(0, 3)}
              </label>
            ))}
          </div>
          <p className="text-xs text-[var(--text-dim)]">
            Founder is available Monday, Tuesday, and Friday only.
          </p>
        </fieldset>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            Preferred time
          </span>
          <input
            className="input-field"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="e.g. 4:00pm WAT"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            What do you need help with?
          </span>
          <textarea
            className="textarea-field"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Your goal, level, home or gym, and what is blocking you…"
            rows={4}
          />
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span className="text-sm text-[var(--text-muted)] leading-relaxed">
            I understand this is a paid{" "}
            <strong className="text-[var(--text)]">${FOUNDER_SESSION.priceUsd}</strong> founder
            session (20 minutes). Scrolling is free — this call is for people ready to invest at
            least a ${FOUNDER_SESSION.entryBudgetUsd}+ mindset in clear guidance.
          </span>
        </label>

        <Button type="submit" className="w-full !min-h-[3.1rem] gap-2" disabled={!agreed}>
          <MessageCircle size={18} aria-hidden />
          Continue on WhatsApp · ${FOUNDER_SESSION.priceUsd}
        </Button>
      </form>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-[var(--lime)] font-semibold mb-1">
            Social share link
          </p>
          <p className="text-sm text-[var(--text-muted)] break-all">{SESSION_URL}</p>
        </div>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="btn-secondary !min-h-0 !py-2.5 shrink-0 inline-flex gap-2"
        >
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
