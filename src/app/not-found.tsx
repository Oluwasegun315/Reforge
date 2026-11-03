import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="section-eyebrow mb-3 justify-center">404</p>
      <h1 className="display-title text-5xl mb-4">Page not found</h1>
      <p className="text-[var(--text-muted)] mb-8">
        That route does not exist. Head back to training.
      </p>
      <Link href="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
}
