export default function Loading() {
  return (
    <div className="mx-auto max-w-[1500px] animate-pulse px-5 py-8 sm:px-8 lg:px-10">
      <div className="h-10 w-56 rounded-xl bg-slate-200" />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="mt-8 h-24 rounded-2xl bg-slate-200" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-48 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
