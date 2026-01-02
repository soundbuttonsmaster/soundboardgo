export default function DottedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Dotted pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      {/* Colorful floating circles for kids */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-pink-400/10 blur-3xl" />
      <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="absolute bottom-40 right-1/4 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
    </div>
  )
}
