import { PlannerRun } from "@/components/PlannerRun";

const departments = [
  ["Finance", "Close, reconciliation, approval queues"],
  ["HR", "Headcount changes and policy gates"],
  ["Procurement", "Vendor pipeline and spend holds"],
  ["Inventory", "Exposure, reorder, warehouse handoff"],
  ["Operations", "Workflow automation score"],
];

const plannerInputs = [
  "Company size",
  "Departments in scope",
  "Workflow under pressure",
  "Named bottleneck",
  "Procurement complexity",
  "Inventory profile",
];

const sampleOutput = [
  { module: "Finance", stall: "Manual reconciliation", sequence: "01 · close queue first" },
  { module: "Procurement", stall: "Vendor pipeline hold", sequence: "02 · approval fabric" },
  { module: "Inventory", stall: "Reorder handoff", sequence: "03 · warehouse after buy" },
  { module: "HR", stall: "Policy gate on headcount", sequence: "04 · after finance close" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs text-blue-200">
            Prototype · AI ERP planner
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Map where finance, HR, procurement, and inventory stall — before ERP sprawl multiplies it.
          </h1>
          <p className="mt-4 max-w-xl text-slate-400">
            AutoERP is a command-center planner for enterprise operations. You
            describe the company shape; it produces an operating map, bottleneck
            radar, and a sequenced deployment sketch. This is a working prototype
            in the browser, not a live ERP replacement and not a claim of
            production customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#planner-run"
              className="inline-flex min-h-11 items-center rounded-full bg-blue-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              Run the planner
            </a>
          </div>
          <p className="mt-3 max-w-xl text-xs text-slate-500">
            The six inputs below run the operating-map model in the browser. Prisma persistence and the separate dashboard stay out of this branch.
          </p>
        </div>

        <aside
          className="overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-950/70"
          aria-label="Department operating map"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-200/80">
            <span>operating map</span>
            <span>planner inputs</span>
          </div>
          <ul className="divide-y divide-white/8">
            {departments.map(([name, note]) => (
              <li key={name} className="flex items-start justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="mt-1 text-xs text-slate-400">{note}</p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-blue-300">module</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section id="planner-inputs" className="mt-16">
        <h2 className="text-2xl font-semibold text-white">What the planner actually asks</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          The command center form is the product: six constraints in, an operating
          map and automation queue out. Savings figures on generated reports are
          estimates from that sketch, not audited finance results.
        </p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plannerInputs.map((item, i) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-200"
            >
              <span className="font-mono text-xs text-blue-300">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-medium">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="planner-result" className="mt-16">
        <h2 className="text-2xl font-semibold text-white">What a planner run returns</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          A sample output for a 51–200 person company with close pressure: bottleneck
          radar plus a module sequence. Savings figures on generated reports are
          estimates from that sketch. This page does not run a second planner.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-200/80">
            <span>bottleneck radar</span>
            <span>demo sketch</span>
          </div>
          <ul className="divide-y divide-white/8">
            {sampleOutput.map((row) => (
              <li key={row.module} className="grid gap-2 px-4 py-3 sm:grid-cols-[140px_1fr_auto] sm:items-center">
                <p className="text-sm font-semibold text-white">{row.module}</p>
                <p className="text-sm text-slate-400">{row.stall}</p>
                <p className="font-mono text-[11px] text-blue-300">{row.sequence}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          ["Operating map", "Finance, HR, procurement, inventory, and operations on one handoff board — before a second ERP module lands."],
          ["Approval fabric", "Name the queue slowing close, hire, buy, or ship. The planner asks for the bottleneck by name."],
          ["Deployment sketch", "Sequence modules from the six inputs, then verify against your own books. Not a live ERP cutover."],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{copy}</p>
          </article>
        ))}
      </section>

      <PlannerRun />
      <p className="mt-12 text-center text-sm text-slate-500">
        Pricing is not published on this page. The sample map above is not a quote.
      </p>
    </main>
  );
}
