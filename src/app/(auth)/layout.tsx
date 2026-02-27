export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/30 to-primary/10 p-4">
      {/* Floating decorative circles */}
      <div className="animate-float pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div
        className="animate-float pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-accent/20 blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="animate-float pointer-events-none absolute top-1/4 right-1/4 size-48 rounded-full bg-persona-poet-bg/40 blur-3xl"
        style={{ animationDelay: "4s" }}
      />

      {/* Scattered persona emojis at low opacity */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]">
        <span className="animate-float absolute top-[15%] left-[10%] text-4xl" style={{ animationDelay: "0s" }}>🧒</span>
        <span className="animate-float absolute top-[70%] left-[20%] text-3xl" style={{ animationDelay: "1s" }}>🎓</span>
        <span className="animate-float absolute top-[20%] right-[15%] text-4xl" style={{ animationDelay: "2s" }}>🏴‍☠️</span>
        <span className="animate-float absolute bottom-[25%] right-[10%] text-3xl" style={{ animationDelay: "3s" }}>😂</span>
        <span className="animate-float absolute top-[50%] left-[5%] text-3xl" style={{ animationDelay: "4s" }}>✨</span>
        <span className="animate-float absolute bottom-[15%] right-[30%] text-4xl" style={{ animationDelay: "5s" }}>👽</span>
      </div>

      {/* Glassmorphic card wrapper */}
      <div className="animate-fade-in-up relative z-10 w-full max-w-md rounded-2xl border border-border/40 bg-card/80 p-8 shadow-xl backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
