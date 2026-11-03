import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger:
    "inline-flex items-center justify-center gap-2 min-h-[2.85rem] px-5 rounded-full font-semibold bg-[rgba(255,92,92,0.12)] text-[var(--danger)] border border-[rgba(255,92,92,0.35)] hover:bg-[rgba(255,92,92,0.2)] transition",
};

export function Button({
  variant = "primary",
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(variantClass[variant], className)} {...props}>
      {children}
    </button>
  );
}
