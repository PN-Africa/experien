"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CourseModule } from "@/types/Course";
import type { Question } from "@/types/learning";
import { PASS_MARK, pad } from "@/lib/utils/learning";
import { useProgress } from "./ProgressProvider";

type Props = {
  slug: string;
  mod: CourseModule;
  moduleIndex: number;
  questions: Question[];
  reviews: { label: string; href: string }[];
  slugHrefs?: Record<string, string>; // backend lesson slug -> lesson link (real backend only)
};

export default function QuizResult({ slug, mod, moduleIndex, questions, reviews, slugHrefs }: Props) {
  const router = useRouter();
  const { attempts, quizReviews } = useProgress();
  const answers = attempts[mod.id];
  const review = quizReviews[mod.id]; // set when the backend graded the quiz
  const quizHref = `/learn/${slug}/${mod.id}/quiz`;

  // Answers live in memory, so a full refresh sends the learner back to the quiz.
  useEffect(() => {
    if (!answers) router.replace(quizHref);
  }, [answers, router, quizHref]);
  if (!answers) return null;

  const total = review ? review.totalCount : questions.length;
  const correct = review ? review.correctCount : questions.filter((q, i) => answers[i] === q.answer).length;
  const wrong = total - correct;
  const pct = review ? review.scorePercent : Math.round((correct / total) * 100);
  const passMark = review ? review.passMarkPercent : PASS_MARK;
  const passed = review ? review.passed : pct >= PASS_MARK;

  // One row per question: was it right, and which lesson to revisit if not
  const rows = questions.map((q, i) => {
    if (review) {
      const r = review.results.find((x) => x.questionId === q.id);
      const lesson = r?.reviewLesson;
      return {
        ok: r?.correct ?? false,
        link: lesson
          ? { label: `Review lesson ${lesson.label}`, href: slugHrefs?.[lesson.slug] ?? `/learn/${slug}/${mod.id}/materials` }
          : null,
      };
    }
    return { ok: answers[i] === q.answer, link: reviews[i] };
  });
  const mNum = pad(moduleIndex + 1);

  const stats = [
    ["Questions", String(total), `Module ${mNum} knowledge check`],
    ["Correct answers", String(correct), `${pct}% score`],
    ["Incorrect answers", String(wrong), "Review lesson materials"],
    ["Course progress", "Updated", "Quiz submitted"],
  ];

  return (
    <div>
      <section className="bg-ink text-[#F5F2E9]">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-lime">Module {mNum} · Quiz result</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">Quiz submitted</h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base">
            You answered {correct} of {total} questions correctly.{" "}
            {passed
              ? "Well done, you passed this quiz."
              : `Review the questions that need another look before continuing. You need ${passMark}% to pass.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-lime px-3 py-1 text-ink">{pct}% score</span>
            <span className="rounded-full bg-white px-3 py-1 text-ink">{correct} correct</span>
            <span className="rounded-full bg-white px-3 py-1 text-ink">{wrong} to review</span>
          </div>
        </div>
      </section>

      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([label, value, sub]) => (
              <div key={label} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider">{label}</p>
                <p className="mt-3 text-2xl font-medium">{value}</p>
                <p className="mt-2 text-[11px] text-muted">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider">Answer review</p>
            <h2 className="mt-2 text-xl font-medium md:text-2xl">See where to revisit the course material.</h2>
            <ul className="mt-4 space-y-1">
              {questions.map((q, i) => {
                const { ok, link } = rows[i];
                return (
                  <li key={q.id} className={`flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm ${ok ? "" : "bg-[#F5F2E9]"}`}>
                    <span className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF1E8] text-[10px]">{pad(i + 1)}</span>
                      {q.topic}
                    </span>
                    {ok ? (
                      <span className="text-xs text-muted">Correct</span>
                    ) : link ? (
                      <Link href={link.href} className="text-xs underline">{link.label}</Link>
                    ) : (
                      <span className="text-xs text-muted">Incorrect</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/learn/${slug}/${mod.id}/materials`} className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">
              Review Module {mNum}
            </Link>
            <Link href={`/learn/${slug}`} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">
              Return to course
            </Link>
            <Link href={quizHref} className="rounded-lg border border-line bg-white px-4 py-2 text-xs font-medium">
              Retake quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
