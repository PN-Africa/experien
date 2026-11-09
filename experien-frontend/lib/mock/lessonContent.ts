import type { Course } from "@/types/Course";
import type { LessonContent, Question, Resource } from "@/types/learning";
import { lessonDetail, lessonId, lessonType, pad } from "@/lib/utils/learning";

// MOCK content for the lesson, materials and quiz pages. Replace with backend data later.

const takeaways: Record<string, string> = {
  "it-project-management:m3-1": "Translate scope into milestones, dependencies and delivery dates.",
};

const isResource = (meta: string) => ["Reading", "Template"].includes(lessonType(meta));


const MOCK_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const MOCK_PDF = "/mock/sample.pdf";
export function getLessonContent(course: Course, mi: number, li: number): LessonContent {
  const mod = course.modules[mi];
  const lesson = mod.contents[li];
  return {
    duration: lessonDetail(lesson.meta),
    step: `Step ${pad(li + 1)}`,
    videoUrl: MOCK_VIDEO,
    takeaway:
      takeaways[`${course.slug}:${lessonId(mod.id, li)}`] ??
      `Apply the ideas from "${lesson.title}" to a real project in your industry.`,
    detail:
      "Use the lesson as a shared planning tool and update it as risks, dependencies or delivery assumptions change.",
    attachments: mod.contents.filter((c) => isResource(c.meta)).slice(0, 2).map((c) => {
      const template = lessonType(c.meta) === "Template";
      return {
        kind: template ? "Template" : "PDF",
        title: c.title,
        description: template ? "Practical template for this module." : "Lesson notes and examples.",
      };
    }),
  };
}

const points = [
  "Define the work and major milestones.",
  "Sequence dependencies and identify constraints.",
  "Review schedule risks and update assumptions.",
];

export function getResources(course: Course, mi: number): Resource[] {
  const mod = course.modules[mi];
  const real = mod.contents
    .filter((c) => isResource(c.meta))
    .map((c) => ({ kind: (lessonType(c.meta) === "Template" ? "Template" : "PDF") as Resource["kind"], title: c.title }));
  const extra: { kind: Resource["kind"]; title: string }[] = [
    { kind: "Image", title: `${mod.shortTitle} overview` },
    { kind: "Notes", title: `${mod.shortTitle} notes` },
  ];
  const ext = { PDF: "pdf", Template: "pdf", Image: "png", Notes: "txt" };
  return [...real, ...extra].slice(0, 4).map((r, i) => ({
    id: `r${i}`,
    kind: r.kind,
    title: r.title,
    file: `${r.title}.${ext[r.kind]}`,
    heading: r.title,
    intro: mod.summary,
    fileUrl: r.kind === "PDF" || r.kind === "Template" ? MOCK_PDF : undefined,
    points,
  }));
}

// Same 5 mock questions for every module until the backend supplies real ones.
const bank: Omit<Question, "id">[] = [
  { topic: "Scope definition", text: "Which document defines what a project must deliver?", options: ["Project scope statement", "Meeting agenda", "Invoice", "Holiday calendar"], answer: 0 },
  { topic: "Risk register", text: "Which document is used to record identified project risks?", options: ["Stakeholder map", "Risk register", "Meeting agenda", "Product roadmap"], answer: 1 },
  { topic: "Project schedule", text: "What does a milestone mark in a project schedule?", options: ["A team member's day off", "The cost of one task", "A significant point of progress", "A change of supplier"], answer: 2 },
  { topic: "Task dependencies", text: "What is a task dependency?", options: ["A task that can never start", "A task that relies on another task starting or finishing first", "A task owned by two people", "A task with no deadline"], answer: 1 },
  { topic: "Delivery monitoring", text: "Who should receive regular project status reports?", options: ["Only the project manager", "Nobody until closeout", "Competitors", "Project stakeholders"], answer: 3 },
];

export const getQuiz = (moduleId: string): Question[] =>
  bank.map((q, i) => ({ ...q, id: `${moduleId}-q${i + 1}` }));


