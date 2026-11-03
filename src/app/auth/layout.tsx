export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,rgba(200,255,60,0.08),transparent_55%),#070708]">
      {children}
    </div>
  );
}
