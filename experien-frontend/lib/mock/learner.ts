// Temporary mock learner data. to be replaced the backend.
export const learner = { name: "Amaka Chukwu" };

export type LearnerEnrolment = {
  courseSlug: string;
  completedLessonIds: string[]; // lesson id = `${moduleId}-${lessonIndex}`, e.g. "m1-0"
  quizScores: Record<string, number>; // moduleId -> score in %
};

export const enrolments: LearnerEnrolment[] = [
  {
    courseSlug: "it-project-management",
    completedLessonIds: ["m1-0", "m1-1", "m1-2", "m1-3"],
    quizScores: { m1: 80 },
  },
];
