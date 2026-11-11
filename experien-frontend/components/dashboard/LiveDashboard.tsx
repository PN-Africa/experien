"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DashboardHero, { type Stat } from "./DashboardHero";
import DashboardLinks from "./DashboardLinks";
import FirstName from "@/components/auth/FirstName";
import { ApiError } from "@/lib/api/client";
import { getMyEnrolments, type Enrolment } from "@/lib/api/enrolments";
import { useSlowHint } from "@/hooks/useSlowHint";

function CourseCard({ e }: { e: Enrolment }) {
  const { course, progress, next } = e;
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[11px] font-semibold uppercase tracking-wider">{course.industry.name}</p>
      <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{course.title}</h2>
      <p className="mt-1 text-xs text-muted">
        {course.moduleCount} modules · {course.durationWeeks} weeks · {course.format}
      </p>

      <p className="mt-4 text-[11px] text-muted">Course progress · {progress.percent}%</p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E4E9E2]">
        <div className="h-full rounded-full bg-lime" style={{ width: `${progress.percent}%` }} />
      </div>

      {next ? (
        <div className="mt-5 rounded-lg bg-[#F5F2E9] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            {next.kind === "quiz" ? "Next quiz" : "Next lesson"}
          </p>
          <p className="mt-2 text-sm font-medium">
            {[next.label, next.title].filter(Boolean).join(" · ")}
          </p>
          {next.lessonType && (
            <p className="mt-1 text-[11px] capitalize text-muted">{next.lessonType}</p>
          )}
        </div>
      ) : (
        <p className="mt-5 rounded-lg bg-[#F5F2E9] p-4 text-sm">
          You have completed every lesson in this course.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/learn/${course.slug}`}
          className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9] hover:bg-ink/90"
        >
          {progress.percent === 0 ? "Start learning" : "Continue learning"}
        </Link>
        <Link
          href="#progress-overview"
          className="rounded-lg border border-ink px-4 py-2 text-xs font-medium hover:bg-[#F6F8F3]"
        >
          View progress
        </Link>
      </div>
    </div>
  );
}

export default function LiveDashboard() {
  const [enrolments, setEnrolments] = useState<Enrolment[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const slow = useSlowHint(loading);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEnrolments(await getMyEnrolments());
    } catch (err) {
      // A 401 is handled by AuthProvider (it sends the learner to /login).
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-16">
          <p className="text-sm text-muted">Loading your courses...</p>
          {slow && (
            <p className="mt-2 text-xs text-muted">Waking up the server, this can take a moment...</p>
          )}
        </div>
      </section>
    );
  }

  if (error || !enrolments) {
    return (
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-16">
          <p role="alert" className="text-sm text-red-600">{error || "Could not load your courses."}</p>
          <button
            type="button"
            onClick={load}
            className="mt-4 rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (enrolments.length === 0) {
    return (
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-16">
          <h1 className="text-3xl font-medium tracking-tight">
            Welcome, <FirstName fallback="" />.
          </h1>
          <p className="mt-3 text-sm text-muted">You haven&apos;t enrolled in a course yet.</p>
          <Link
            href="/industries"
            className="mt-5 inline-block rounded-lg bg-lime px-5 py-2.5 text-sm font-medium text-ink"
          >
            Explore industries
          </Link>
        </div>
      </section>
    );
  }

  // Stats use the first enrolment, like the mock version did.
  const first = enrolments[0];
  const p = first.progress;
  const score =
    first.latestQuiz && typeof first.latestQuiz.score === "number" ? first.latestQuiz.score : null;

  const stats: Stat[] = [
    { label: "Active courses", value: String(enrolments.length), sub: first.course.title },
    { label: "Overall progress", value: `${p.percent}%`, sub: `${p.lessonsCompleted} of ${p.lessonsTotal} lessons` },
    { label: "Completed modules", value: String(p.modulesCompleted), sub: `${p.modulesTotal - p.modulesCompleted} modules remaining` },
    {
      label: "Latest quiz",
      value: score !== null ? `${score}%` : "—",
      sub: score !== null ? `${p.quizzesSubmitted} of ${p.quizzesTotal} submitted` : "No quiz taken yet",
    },
  ];

  return (
    <div>
      <DashboardHero firstName="" stats={stats} />
      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] space-y-6 px-6 py-10 md:px-16 md:py-12">
          {enrolments.map((e) => (
            <CourseCard key={e.enrolmentId} e={e} />
          ))}
          <DashboardLinks slug={first.course.slug} moduleCount={first.course.moduleCount} pct={p.percent} />
        </div>
      </section>
    </div>
  );
}