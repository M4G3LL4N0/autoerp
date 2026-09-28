export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-400/20 bg-[#070d18]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <a href="#planner-run" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 text-sm font-bold text-slate-950">AE</span>
          <span className="whitespace-nowrap text-sm font-semibold text-white">AutoERP</span>
        </a>
        <nav className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-slate-300 sm:gap-2">
          <a href="#planner-run" className="rounded-full px-2.5 py-1.5 hover:bg-white/5 sm:px-3">Planner</a>
        </nav>
      </div>
    </header>
  );
}
