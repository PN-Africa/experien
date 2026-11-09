import type { AdminCourse, EnrolmentRecord, EnrolmentSummary } from "@/types/admin";

// MOCK admin data. shapes in types/admin.ts; the backend should return the same fields.

const mods = (titles: string[], counts: number[]) =>
  titles.map((title, i) => ({ id: `m${i + 1}`, title, lessonCount: counts[i] }));

export const mockCourses: AdminCourse[] = [
  {
    id: "it-project-management",
    title: "IT Project Management",
    industry: "Technology / IT",
    price: 75000,
    status: "Published",
    draftChanges: 1,
    duration: "6 weeks",
    format: "Self-paced",
    modules: mods(["Foundations", "Project setup", "Planning & risk", "Delivery & closeout"], [4, 5, 5, 4]),
  },
  {
    id: "construction-project-management",
    title: "Construction Project Management",
    industry: "Construction",
    price: null,
    status: "Published",
    draftChanges: 0,
    duration: "6 weeks",
    format: "Self-paced",
    modules: mods(["Foundations", "Site setup", "Planning & cost", "Delivery & closeout"], [4, 4, 4, 4]), // placeholder
  },
  {
    id: "manufacturing-project-management",
    title: "Manufacturing Project Management",
    industry: "Manufacturing",
    price: null,
    status: "Published",
    draftChanges: 0,
    duration: "6 weeks",
    format: "Self-paced",
    modules: mods(["Foundations", "Plant setup", "Planning & quality", "Delivery & closeout"], [4, 4, 4, 4]), // placeholder
  },
];

export const mockEnrolments: EnrolmentRecord[] = [
  { id: "e1", learner: "Amaka Chukwu", course: "IT Project Management", paymentStatus: "Confirmed", transactionRef: "PAY-240927-8KAM", orderRef: "EXP-ORD-240927-184", accessActive: true, amount: 75000 },
  { id: "e2", learner: "Daniel Okoro", course: "Construction PM", paymentStatus: "Pending", transactionRef: "PAY-240928-3QDL", orderRef: "EXP-ORD-240928-191", accessActive: false, amount: 75000 },
  { id: "e3", learner: "Zainab Bello", course: "Manufacturing PM", paymentStatus: "Failed", transactionRef: "PAY-240928-7ZXP", orderRef: "EXP-ORD-240928-197", accessActive: false, amount: 75000 },
  { id: "e4", learner: "Tunde Adebayo", course: "IT Project Management", paymentStatus: "Confirmed", transactionRef: "PAY-240929-2TNB", orderRef: "EXP-ORD-240929-203", accessActive: true, amount: 75000 },
];

// The backend sends totals separately because the record list may be paged.
export const mockSummary: EnrolmentSummary = { total: 248, confirmed: 231, pending: 11, failed: 6 };
