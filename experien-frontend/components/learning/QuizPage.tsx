
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseModule } from "@/types/Course";
import type { Question } from "@/types/learning";
import { PASS_MARK, pad } from "@/lib/utils/learning";
import { useProgress } from "./ProgressProvider";
import LearnHeader from "./LearnHeader";

const LIME_DARK = "#B0C45A";

type Props = {
  mod: CourseModule;
  moduleIndex: number;
  questions: Question[];
  quizLessonId: string | null;
  slug: string;
};

export default function QuizPage({
  slug,
  mod,
  moduleIndex,
  questions,
  quizLessonId,
}: Props) {
  const router = useRouter();
  const { saveAttempt, markComplete } = useProgress();

  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null)
  );
  const [current, setCurrent] = useState(0);

  const answered = answers.filter((a) => a !== null).length;
  const q = questions[current];
  const last = current === questions.length - 1;
  const letters = ["A", "B", "C", "D", "E"];

  function pick(i: number) {
    setAnswers((prev) =>
      prev.map((a, idx) => (idx === current ? i : a))
    );
  }

  function submit() {
    if (questions.length === 0 || answered < questions.length) return;

    const correct = questions.filter(
      (x, i) => answers[i] === x.answer
    ).length;

    const pct = Math.round((correct / questions.length) * 100);

    saveAttempt(mod.id, answers as number[], pct);

    if (pct >= PASS_MARK && quizLessonId) {
      markComplete(quizLessonId);
    }

    router.push(`/learn/${slug}/${mod.id}/quiz/result`);
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-16">
        <p className="text-sm text-muted">
          No quiz questions are available for this module yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <LearnHeader
        eyebrow={`Module ${pad(moduleIndex + 1)} · Knowledge check`}
        title={`Module ${pad(moduleIndex + 1)} quiz`}
        subtitle={`Answer ${questions.length} single-choice questions. Review your answers before submitting the quiz.`}
      >
        <p className="mt-4 text-[11px]">
          Questions answered · {answered} of {questions.length}
        </p>

        <div className="mt-1.5 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-[#EAF1E8]">
          <div
            className="h-full rounded-full bg-lime"
            style={{
              width: `${(answered / questions.length) * 100}%`,
            }}
          />
        </div>
      </LearnHeader>

      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <div className="grid items-start gap-5 lg:grid-cols-[240px_1fr]">

            {/* Question navigation */}
            <aside className="rounded-2xl border border-line bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider">
                Questions
              </p>

              <ul className="mt-3 space-y-2">
                {questions.map((x, i) => {
                  const state =
                    i === current
                      ? "Current"
                      : answers[i] !== null
                        ? "Answered"
                        : "Unanswered";

                  return (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() => setCurrent(i)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs ${
                          i === current ? "bg-[#EAF1E8]" : ""
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                            state === "Unanswered"
                              ? "bg-[#EAF1E8]"
                              : "bg-lime"
                          }`}
                        >
                          {pad(i + 1)}
                        </span>

                        {state}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-[11px] text-muted">
                You can change an answer before submitting.
              </p>
            </aside>

            {/* Question and answer options */}
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider">
                Question {current + 1} of {questions.length} · Single choice
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-medium tracking-tight md:text-3xl">
                {q.text}
              </h2>

              <p className="mt-2 text-xs text-muted">
                Choose one answer.
              </p>

              <div role="radiogroup" className="mt-4 space-y-3">
                {q.options.map((opt, i) => {
                  const on = answers[current] === i;

                  return (
                    <button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => pick(i)}
                      className={`flex w-full items-center gap-3 rounded-xl border border-line px-4 py-3 text-left text-sm ${
                        on
                          ? "bg-[#EAF1E8]"
                          : "bg-white hover:bg-[#F6F8F3]"
                      }`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border ${
                          on
                            ? "border-ink bg-lime"
                            : "border-muted"
                        }`}
                      />

                      {letters[i]}. {opt}
                    </button>
                  );
                })}
              </div>

              {/* Navigation and submission buttons */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setCurrent(current - 1)}
                  disabled={current === 0}
                  className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium disabled:opacity-50"
                >
                  Previous question
                </button>

                <button
                  type="button"
                  onClick={() => setCurrent(current + 1)}
                  disabled={last}
                  className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9] disabled:opacity-50"
                >
                  Next question
                </button>

                <button
                  type="button"
                  onClick={submit}
                  disabled={answered < questions.length}
                  style={{ backgroundColor: LIME_DARK }}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-ink disabled:opacity-50"
                >
                  Submit quiz
                </button>
              </div>

              {answered < questions.length && (
                <p className="mt-2 text-[11px] text-muted">
                  Answer all questions to submit.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
