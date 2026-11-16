import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("card-surface p-5 md:p-6", className)}>
      {children}
    </Tag>
  );
}
