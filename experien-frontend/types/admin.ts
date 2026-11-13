export type PublishStatus = "Published" | "Draft";
export type PaymentStatus = "Confirmed" | "Pending" | "Failed";

export type AdminModule = { id: string; title: string; lessonCount: number };

export type AdminCourse = {
  id: string;
  title: string;
  industry: string; // e.g. "Technology / IT"
  price: number | null; // naira, null = not set
  status: PublishStatus;
  draftChanges: number; // unpublished edits waiting for review
  duration: string;
  format: string;
  modules: AdminModule[];
};

export type EnrolmentRecord = {
  id: string;
  learner: string;
    learnerEmail?: string;
  course: string;
  paymentStatus: PaymentStatus;
  transactionRef: string;
  orderRef: string;
  accessActive: boolean;
  amount: number; // naira
};

export type EnrolmentSummary = { total: number; confirmed: number; pending: number; failed: number };

export type EnrolmentFilters = {
  search: string;
  payment: "All" | PaymentStatus;
  course: string; // "All" or a course name
  access: "All" | "Active" | "Not activated";
};


export type AdminOverview = {
  industries: number;
  publishedCourses: number;
  draftCourses: number;
  learners: number;
  activeEnrolments: number;
  payments: { successful: number; pending: number; failed: number };
};