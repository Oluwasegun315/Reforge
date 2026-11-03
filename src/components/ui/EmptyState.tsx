import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="text-center py-12">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6">{description}</p>
      {action}
    </Card>
  );
}
