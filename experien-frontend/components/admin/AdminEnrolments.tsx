"use client";

import { useCallback, useState } from "react";
import type { EnrolmentFilters } from "@/types/admin";
import { getEnrolmentCourses, getEnrolments, getEnrolmentSummary } from "@/lib/api/admin";
import { useLoad } from "./useLoad";
import { AdminHeader, Pill, StatCard, naira } from "./AdminUi";

const EMPTY: EnrolmentFilters = { search: "", payment: "All", course: "All", access: "All" };
const field = "rounded-full bg-[#EAF1E8] px-3 py-1.5 text-xs";

const explain = {
  Confirmed: "Course access is active because payment is confirmed.",
  Pending: "Course access stays inactive until payment is confirmed.",
  Failed: "Course access is inactive because payment failed. The learner can retry.",
} as const;

const rules = [
  ["Confirmed", "Activate access", "Confirmed payments activate learner course access.", "Access active"],
  ["Pending", "Keep access inactive", "Pending payments should not expose purchased materials.", "Await confirmation"],
  ["Failed", "Retry available", "Failed payments can be retried without duplicate enrolment.", "Access inactive"],
];

export default function AdminEnrolments() {
  const [draft, setDraft] = useState<EnrolmentFilters>(EMPTY);
  const [applied, setApplied] = useState<EnrolmentFilters>(EMPTY);
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const loadList = useCallback(() => getEnrolments(applied), [applied]);
  const loadSummary = useCallback(() => getEnrolmentSummary(), []);
  const loadCourses = useCallback(() => getEnrolmentCourses(), []);
  const list = useLoad(loadList);
  const summary = useLoad(loadSummary);
  const courses = useLoad(loadCourses);

  const records = list.data ?? [];
  const selected = records.find((r) => r.id === picked) ?? records[0];
  const s = summary.data;

  return (
    <div className="space-y-5">
      <AdminHeader
        crumb="Admin / Enrolments"
        title="Enrolments and payments"
        subtitle="Review learner enrolment records, payment outcomes, transaction references and course-access status."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total enrolments" value={s ? String(s.total) : "…"} sub="All courses" />
        <StatCard label="Confirmed payments" value={s ? String(s.confirmed) : "…"} sub="Access active" />
        <StatCard label="Pending" value={s ? String(s.pending) : "…"} sub="Awaiting confirmation" />
        <StatCard label="Failed" value={s ? String(s.failed) : "…"} sub="Access inactive" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input aria-label="Search learner or course" placeholder="Search learner or course" value={draft.search} onChange={(e) => setDraft({ ...draft, search: e.target.value })} className={`${field} w-48 placeholder:text-muted`} />
        <select aria-label="Payment" value={draft.payment} onChange={(e) => setDraft({ ...draft, payment: e.target.value as EnrolmentFilters["payment"] })} className={field}>
          {["All", "Confirmed", "Pending", "Failed"].map((o) => <option key={o} value={o}>Payment · {o}</option>)}
        </select>
        <select aria-label="Course" value={draft.course} onChange={(e) => setDraft({ ...draft, course: e.target.value })} className={field}>
          <option value="All">Course · All</option>
          {(courses.data ?? []).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Access" value={draft.access} onChange={(e) => setDraft({ ...draft, access: e.target.value as EnrolmentFilters["access"] })} className={field}>
          {["All", "Active", "Not activated"].map((o) => <option key={o} value={o}>Access · {o}</option>)}
        </select>
        <button type="button" onClick={() => setApplied(draft)} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">Apply filters</button>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider">Enrolment records</p>
          {list.loading && <p className="mt-3 text-sm text-muted">Loading records…</p>}
          {list.error && <p role="alert" className="mt-3 text-sm text-red-700">{list.error}</p>}
          {!list.loading && !list.error && records.length === 0 && <p className="mt-3 text-sm text-muted">No records match these filters.</p>}
          <ul className="mt-3 space-y-3">
            {records.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => setPicked(r.id)} aria-pressed={r.id === selected?.id} className={`flex w-full items-start justify-between gap-3 rounded-xl border border-line p-4 text-left ${r.id === selected?.id ? "bg-[#EAF1E8]" : "bg-white hover:bg-[#F6F8F3]"}`}>
                  <span>
                    <span className="block text-sm font-medium">{r.learner}</span>
                    <span className="mt-1 block text-[11px] text-muted">{r.course} · Access · {r.accessActive ? "Active" : "Not activated"}</span>
                  </span>
                  <Pill tone={r.paymentStatus === "Confirmed" ? "green" : "cream"}>{r.paymentStatus}</Pill>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl bg-[#F5F2E9] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider">Selected record</p>
          {selected ? (
            <>
              <h2 className="mt-2 text-xl font-medium">{selected.learner}</h2>
              <p className="mt-1 text-sm text-muted">{selected.course}</p>
              <dl className="mt-4 space-y-3 text-xs">
                {[["Payment status", selected.paymentStatus], ["Payment reference", selected.transactionRef], ["Learner email", selected.learnerEmail ?? "—"], ["Course access", selected.accessActive ? "Active" : "Not activated"], ["Amount", naira(selected.amount)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11px] text-muted">{explain[selected.paymentStatus]}</p>
              <button type="button" onClick={() => setNote("The payment record is coming soon.")} className="mt-4 rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">View payment record</button>
              {note && <p role="status" className="mt-2 text-[11px] text-muted">{note}</p>}
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">Select a record to see its details.</p>
          )}
        </aside>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Payment outcome rules</p>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {rules.map(([tag, title, text, access]) => (
            <div key={tag} className="rounded-xl border border-line p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8FA33A]">{tag}</p>
              <p className="mt-1 text-lg font-medium">{title}</p>
              <p className="mt-1 text-xs text-muted">{text}</p>
              <p className="mt-2 text-[11px] text-muted">{access}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
