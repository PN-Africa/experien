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

export type Question = { id: string; topic: string; text: string; options: string[]; answer: number };
