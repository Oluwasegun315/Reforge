"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FOUNDER, SESSION_FOCUS, SESSION_URL } from "@/lib/seo";

export function SessionBookingForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [focus, setFocus] = useState<(typeof SESSION_FOCUS)[number]["id"]>("beginner");
  const [when, setWhen] = useState("");
  const [goal, setGoal] = useState("");
  const [copied, setCopied] = useState(false);

  const focusLabel = useMemo(
    () => SESSION_FOCUS.find((f) => f.id === focus)?.title ?? "Beginner start",
    [focus]
  );

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hello ${FOUNDER.name}, I want a 20-minute RepForge founder session.`,
      ``,
      `Name: ${name.trim() || "—"}`,
      `WhatsApp/Phone: ${contact.trim() || "—"}`,
      `Focus: ${focusLabel}`,
      `Preferred time: ${when.trim() || "Flexible"}`,
      `What I need help with: ${goal.trim() || "—"}`,
      ``,
      `Session link: ${SESSION_URL}`,
    ];
    return `https://wa.me/${FOUNDER.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [name, contact, focusLabel, when, goal]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !contact.trim()) return;
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

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            Preferred day / time
          </span>
          <input
            className="input-field"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="e.g. Saturday 4pm WAT"
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
            placeholder="Tell the founder your goal, level, and where you train…"
            rows={4}
          />
        </label>

        <Button type="submit" className="w-full !min-h-[3.1rem] gap-2">
          <MessageCircle size={18} aria-hidden />
          Book 20-min session on WhatsApp
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
