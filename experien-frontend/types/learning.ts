export type Attachment = { kind: string; title: string; description: string };

export type LessonContent = {
  duration: string;
  step: string;
  takeaway: string;
  detail: string;
  attachments: Attachment[];
  videoUrl?: string;
};

export type Resource = {
  id: string;
  kind: "PDF" | "Template" | "Image" | "Notes";
  title: string;
  file: string;
  heading: string;
  intro: string;
  points: string[];
  fileUrl?: string;
};

// `answer` is the index of the correct option. Questions from the backend have no answer
// (the backend never sends it), so they use -1 and carry `optionIds` instead.
export type Question = {
  id: string;
  topic: string;
  text: string;
  options: string[];
  answer: number;
  optionIds?: string[];
};

// The graded result the backend returns after a quiz is submitted.
export type QuizReview = {
  correctCount: number;
  incorrectCount: number;
  totalCount: number;
  scorePercent: number;
  passMarkPercent: number;
  passed: boolean;
  results: {
    questionId: string;
    correct: boolean;
    reviewLesson: { slug: string; label: string; title: string } | null;
  }[];
};
