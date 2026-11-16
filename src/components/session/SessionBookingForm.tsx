"use client";

import { useMemo, useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FOUNDER, FOUNDER_SESSION, SESSION_FOCUS } from "@/lib/seo";

const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Ghana",
  "South Africa",
  "Kenya",
  "Ireland",
  "Germany",
  "France",
  "United Arab Emirates",
  "India",
  "Other",
] as const;

export function SessionBookingForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState<(typeof COUNTRIES)[number] | "">("");
  const [focus, setFocus] = useState<(typeof SESSION_FOCUS)[number]["id"]>("beginner");
  const [day, setDay] = useState<(typeof FOUNDER_SESSION.availableDays)[number]>("Monday");
  const [platform, setPlatform] =
    useState<(typeof FOUNDER_SESSION.meetingPlatforms)[number]>("Zoom");
  const [when, setWhen] = useState("");
  const [goal, setGoal] = useState("");
  const [agreed, setAgreed] = useState(false);

  const focusLabel = useMemo(
    () => SESSION_FOCUS.find((f) => f.id === focus)?.title ?? "Beginner start",
    [focus]
  );

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hello ${FOUNDER.name}, I want to book a Talk with Founder session.`,
      ``,
      `Session: ${FOUNDER_SESSION.durationMinutes} minutes · pay $${FOUNDER_SESSION.collectUsd} (normal value $${FOUNDER_SESSION.priceUsd})`,
      `Live call via: ${platform}`,
      `Name: ${name.trim() || "—"}`,
      `Phone / WhatsApp number: ${contact.trim() || "—"}`,
      `Country: ${country || "—"}`,
      `Focus: ${focusLabel}`,
      `Preferred day: ${day}`,
      `Preferred time: ${when.trim() || "Flexible"}`,
      `What I need help with: ${goal.trim() || "—"}`,
      ``,
      `I understand the normal session value is $${FOUNDER_SESSION.priceUsd}, and with your current founder favour I am ready to pay $${FOUNDER_SESSION.collectUsd} and confirm payment details with you.`,
    ];
    return `https://wa.me/${FOUNDER.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [name, contact, country, focusLabel, day, when, goal, platform]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !contact.trim() || !country || !agreed) return;
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
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

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            Phone / WhatsApp number
          </span>
          <input
            className="input-field"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Include country code if possible"
            inputMode="tel"
            autoComplete="tel"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
            Country
          </span>
          <select
            className="input-field"
            value={country}
            onChange={(e) => setCountry(e.target.value as (typeof COUNTRIES)[number] | "")}
            required
          >
            <option value="" disabled>
              Select your country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-xs text-[var(--text-dim)] -mt-2">
        Number + country help the founder know your timezone and how to attend the call.
      </p>

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

      <fieldset className="space-y-2">
        <legend className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">
          Live session via
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {FOUNDER_SESSION.meetingPlatforms.map((p) => (
            <label
              key={p}
              className={`rounded-xl border px-3 py-3 text-center cursor-pointer transition text-sm font-semibold ${
                platform === p
                  ? "border-[rgba(200,255,60,0.45)] bg-[var(--lime-dim)] text-[var(--lime)]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
              }`}
            >
              <input
                type="radio"
                name="platform"
                className="sr-only"
                checked={platform === p}
                onChange={() => setPlatform(p)}
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold">
          Preferred time
        </span>
        <input
          className="input-field"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          placeholder="e.g. 4:00pm your local time"
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

      <label className="flex items-start gap-3 rounded-xl border border-[rgba(200,255,60,0.28)] bg-[var(--lime-dim)] p-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          required
        />
        <span className="text-sm text-[var(--text-muted)] leading-relaxed">
          I understand the session is valued at{" "}
          <strong className="text-[var(--text)] line-through decoration-[var(--text-dim)]">
            ${FOUNDER_SESSION.priceUsd}
          </strong>{" "}
          and with the Founder &amp; CEO favour I pay only{" "}
          <strong className="text-[var(--lime)]">${FOUNDER_SESSION.collectUsd}</strong> for{" "}
          {FOUNDER_SESSION.durationMinutes} minutes live on Zoom or Google Meet.
        </span>
      </label>

      <Button
        type="submit"
        className="w-full !min-h-[3.1rem] gap-2"
        disabled={!agreed || !country}
      >
        <MessageCircle size={18} aria-hidden />
        Lock my ${FOUNDER_SESSION.collectUsd} founder slot on WhatsApp
      </Button>
      <p className="text-center text-xs text-[var(--text-dim)]">
        Limited favour · Mon · Tue · Fri · Zoom or Google Meet
      </p>
    </form>
  );
}
