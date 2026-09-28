"use client";

import { useMemo, useState } from "react";
import {
  BOTTLENECKS,
  COMPANY_SIZE,
  DEPARTMENTS,
  INVENTORY_PROFILE,
  PROCUREMENT_COMPLEXITY,
  WORKFLOWS,
  type Department,
  type PlannerInput,
} from "@/src/lib/autoerp-data";
import { runEnterprisePlanner } from "@/src/lib/autoerp-engine";

const initial: PlannerInput = {
  companySize: "51-200",
  departments: ["Finance", "Procurement", "Inventory"],
  workflow: "Close & reporting",
  bottleneck: "Manual reconciliation",
  procurementComplexity: "Medium",
  inventoryProfile: "Balanced",
};

export function PlannerRun() {
  const [form, setForm] = useState<PlannerInput>(initial);
  const result = useMemo(() => runEnterprisePlanner(form), [form]);

  function toggleDepartment(department: Department) {
    setForm((current) => {
      const has = current.departments.includes(department);
      const departments = has
        ? current.departments.filter((item) => item !== department)
        : [...current.departments, department];
      return { ...current, departments: departments.length ? departments : current.departments };
    });
  }

  return (
    <section id="planner-run" className="mt-16">
      <h2 className="text-2xl font-semibold text-white">Run the six inputs</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        This uses the local operating-map model. Scores and dollar figures are sketches from that model, not audited finance results and not a live ERP.
      </p>
      <form className="mt-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Company size</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
            value={form.companySize}
            onChange={(event) => setForm((current) => ({ ...current, companySize: event.target.value as PlannerInput["companySize"] }))}
          >
            {COMPANY_SIZE.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Workflow</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
            value={form.workflow}
            onChange={(event) => setForm((current) => ({ ...current, workflow: event.target.value as PlannerInput["workflow"] }))}
          >
            {WORKFLOWS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Bottleneck</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
            value={form.bottleneck}
            onChange={(event) => setForm((current) => ({ ...current, bottleneck: event.target.value as PlannerInput["bottleneck"] }))}
          >
            {BOTTLENECKS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Procurement</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
            value={form.procurementComplexity}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                procurementComplexity: event.target.value as PlannerInput["procurementComplexity"],
              }))
            }
          >
            {PROCUREMENT_COMPLEXITY.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="text-slate-400">Inventory profile</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
            value={form.inventoryProfile}
            onChange={(event) =>
              setForm((current) => ({ ...current, inventoryProfile: event.target.value as PlannerInput["inventoryProfile"] }))
            }
          >
            {INVENTORY_PROFILE.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm text-slate-400">Departments</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEPARTMENTS.map((department) => {
              const on = form.departments.includes(department);
              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => toggleDepartment(department)}
                  className={`rounded-full px-3 py-1.5 text-sm ${on ? "bg-blue-400 text-slate-950" : "border border-slate-700 text-slate-200"}`}
                >
                  {department}
                </button>
              );
            })}
          </div>
        </fieldset>
      </form>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
        <div className="border-b border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-200/80">
          Sketch output · model {result.modelVersion}
        </div>
        <p className="px-4 py-3 text-sm leading-6 text-slate-300">{result.summary}</p>
        <ul className="divide-y divide-white/8">
          {result.departmentMap.map((node) => (
            <li key={node.department} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="font-medium text-white">{node.department}</span>
              <span className="text-slate-400">{node.status}</span>
              <span className="font-mono text-xs text-blue-300">risk {node.riskLevel}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
