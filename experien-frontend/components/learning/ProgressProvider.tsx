"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { apiFetch, isMockApi } from "@/lib/api/client";
import type { QuizReview } from "@/types/learning";

type Ctx = {
  completed: Set<string>;
  scores: Record<string, number>; // moduleId -> latest score in %
  attempts: Record<string, number[]>; // moduleId -> chosen option per question (latest attempt)
  quizReviews: Record<string, QuizReview>; // moduleId -> graded result from the backend
  lastScore: number | null;
  markComplete: (lessonId: string) => void;
  saveAttempt: (moduleId: string, answers: number[], pct: number, review?: QuizReview) => void;
};

const ProgressContext = createContext<Ctx | null>(null);

export default function ProgressProvider({
  initialCompleted,
  initialScores,
  courseSlug,
  lessonSlugs,
  children,
}: {
  initialCompleted: string[];
  initialScores: Record<string, number>;
  courseSlug?: string; // set when talking to the real backend
  lessonSlugs?: Record<string, string>; // lesson id -> backend lesson slug
  children: React.ReactNode;
}) {
  const [completed, setCompleted] = useState(() => new Set(initialCompleted));
  const [scores, setScores] = useState(initialScores);
  const [attempts, setAttempts] = useState<Record<string, number[]>>({});
  const [quizReviews, setQuizReviews] = useState<Record<string, QuizReview>>({});
  const [lastScore, setLastScore] = useState<number | null>(() => {
    const v = Object.values(initialScores);
    return v.length ? v[v.length - 1] : null;
  });

  const markComplete = useCallback(
    (id: string) => {
      if (completed.has(id)) return; // already done, nothing to save
      setCompleted((p) => new Set(p).add(id));

      const lesson = lessonSlugs?.[id];
      if (isMockApi || !courseSlug || !lesson) return; // mock mode, or a quiz item
      apiFetch(
        `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lesson)}/complete`,
        { method: "POST" }
      ).catch(() => {
        // Saving failed: undo the tick so the screen matches the backend.
        setCompleted((p) => {
          const n = new Set(p);
          n.delete(id);
          return n;
        });
      });
    },
    [completed, courseSlug, lessonSlugs]
  );

  const saveAttempt = useCallback((m: string, answers: number[], pct: number, review?: QuizReview) => {
    setAttempts((p) => ({ ...p, [m]: answers }));
    setScores((p) => ({ ...p, [m]: pct }));
    setLastScore(pct);
    if (review) setQuizReviews((p) => ({ ...p, [m]: review }));
  }, []);

  const value = useMemo(
    () => ({ completed, scores, attempts, quizReviews, lastScore, markComplete, saveAttempt }),
    [completed, scores, attempts, quizReviews, lastScore, markComplete, saveAttempt]
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
