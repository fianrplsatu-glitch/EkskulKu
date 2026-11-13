export default function LoadingEkskul() {
  return (
    <main
      aria-busy="true"
      aria-label="Memuat daftar ekskul"
      className="mx-auto max-w-5xl space-y-6 p-6"
    >
      <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-16 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
      <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
