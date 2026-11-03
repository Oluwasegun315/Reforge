import Image from "next/image";
import Link from "next/link";

/**
 * Free Pexels photo — muscular male athlete / bodybuilder physique.
 * Source documented in public/images/ATTRIBUTION.md
 */
export function BodybuilderShowcase() {
  return (
    <section
      className="relative overflow-hidden border-y border-[var(--border)]"
      aria-labelledby="athlete-heading"
    >
      <div className="grid lg:grid-cols-2 min-h-[520px]">
        <div className="relative min-h-[360px] lg:min-h-full order-1 lg:order-2">
          <Image
            src="/images/bodybuilder-power.jpg"
            alt="Muscular male bodybuilder training with powerful defined physique"
            fill
            className="object-cover object-[center_20%]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#070708] lg:via-transparent lg:to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex items-center order-2 lg:order-1">
          <div className="container-page py-12 lg:py-16 lg:pr-10 w-full">
            <p className="section-eyebrow mb-3">Strength in focus</p>
            <h2
              id="athlete-heading"
              className="display-title text-4xl md:text-5xl mb-4 max-w-md"
            >
              Built for serious muscle.
            </h2>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md mb-8">
              From first-time lifters to advanced athletes chasing denser muscle and stronger
              sessions — RepForge helps you train with clear exercises, smart plans, and a timer
              that keeps you accountable.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/exercises" className="btn-primary">
                Browse exercises
              </Link>
              <Link href="/workouts" className="btn-secondary">
                Build a muscle plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
