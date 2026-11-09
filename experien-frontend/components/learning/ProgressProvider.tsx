"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Ctx = {
  completed: Set<string>;
  scores: Record<string, number>; // moduleId -> latest score in %
  attempts: Record<string, number[]>; // moduleId -> chosen option per question (latest attempt)
  lastScore: number | null;
  markComplete: (lessonId: string) => void;
  saveAttempt: (moduleId: string, answers: number[], pct: number) => void;
};

const ProgressContext = createContext<Ctx | null>(null);

// MOCK progress, kept in memory (resets on full page refresh).
// TODO: save through the backend (lib/api) instead.
export default function ProgressProvider({
  initialCompleted,
  initialScores,
  children,
}: {
  initialCompleted: string[];
  initialScores: Record<string, number>;
  children: React.ReactNode;
}) {
  const [completed, setCompleted] = useState(() => new Set(initialCompleted));
  const [scores, setScores] = useState(initialScores);
  const [attempts, setAttempts] = useState<Record<string, number[]>>({});
  const [lastScore, setLastScore] = useState<number | null>(() => {
    const v = Object.values(initialScores);
    return v.length ? v[v.length - 1] : null;
  });

  const markComplete = useCallback((id: string) => setCompleted((p) => new Set(p).add(id)), []);
  const saveAttempt = useCallback((m: string, answers: number[], pct: number) => {
    setAttempts((p) => ({ ...p, [m]: answers }));
    setScores((p) => ({ ...p, [m]: pct }));
    setLastScore(pct);
  }, []);

  const value = useMemo(
    () => ({ completed, scores, attempts, lastScore, markComplete, saveAttempt }),
    [completed, scores, attempts, lastScore, markComplete, saveAttempt]
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
