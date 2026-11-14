import { apiFetch, isMockApi } from "./client";

// Shape confirmed from a real GET /api/enrolments/me response.
export type Enrolment = {
  enrolmentId: string;
  enrolledAt: string;
  course: {
    slug: string;
    title: string;
    overview: string;
    durationWeeks: number;
    format: string;
    industry: { slug: string; name: string };
    moduleCount: number;
  };
  progress: {
    percent: number;
    modulesCompleted: number;
    modulesTotal: number;
    lessonsCompleted: number;
    lessonsTotal: number;
    quizzesSubmitted: number;
    quizzesTotal: number;
  };
  next: {
    kind: string;
    moduleSlug?: string;
    lessonSlug?: string;
    label?: string;
    title?: string;
    lessonType?: string;
  } | null;
  latestQuiz: {
    moduleSlug: string;
    moduleTitle: string;
    scorePercent: number;
    passed: boolean;
    submittedAt: string;
  } | null;
};

export async function getMyEnrolments(): Promise<Enrolment[]> {
  if (isMockApi) return [];
  return apiFetch<Enrolment[]>("/enrolments/me");
}