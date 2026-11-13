import type {
  AdminCourse,
  AdminOverview,
  EnrolmentFilters,
  EnrolmentRecord,
  EnrolmentSummary,
  PaymentStatus,
} from "@/types/admin";
import { mockCourses, mockEnrolments, mockSummary } from "@/lib/mock/admin";
import { apiFetch, isMockApi } from "./client";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---- Shapes confirmed from real API responses ----
type Money = { amountKobo: number; amount: number; currency: string };

type ApiAdminCourse = {
  id: string;
  slug: string;
  title: string;
  status: string; // "published" seen so far
  durationWeeks: number;
  price: Money;
  industry: { slug: string; name: string };
  subIndustry: { name: string } | null;
  moduleCount: number;
  lessonCount: number;
  enrolmentCount: number;
};

// From the public GET /courses/:slug (gives the format and the module list)
type ApiCourseDetail = {
  format: string;
  modules: { slug: string; title: string; position: number; lessonCount: number }[];
};

type ApiAdminEnrolment = {
  id: string;
  status: string; // "active" seen so far
  enrolledAt: string;
  learner: { id: string; name: string; email: string };
  course: { slug: string; title: string };
  payment: { reference: string; status: string; price: Money };
};

type ApiEnrolmentPage = { total: number; limit: number; offset: number; items: ApiAdminEnrolment[] };

// ---- Overview ----
const mockOverview: AdminOverview = {
  industries: 3,
  publishedCourses: 3,
  draftCourses: 0,
  learners: 9,
  activeEnrolments: 4,
  payments: { successful: 4, pending: 5, failed: 0 },
};

export async function getAdminOverview(): Promise<AdminOverview> {
  if (isMockApi) {
    await wait(300);
    return mockOverview;
  }
  return apiFetch<AdminOverview>("/admin/overview");
}

// ---- Courses ----
const fetchAdminCourseList = () => apiFetch<ApiAdminCourse[]>("/admin/courses");

export async function getAdminCourses(): Promise<AdminCourse[]> {
  if (isMockApi) {
    await wait(300);
    return mockCourses;
  }
  const list = await fetchAdminCourseList();

  // The admin list has no module titles, so read them from the public course endpoint.
  const details = await Promise.allSettled(
    list.map((c) => apiFetch<ApiCourseDetail>(`/courses/${encodeURIComponent(c.slug)}`))
  );

  return list.map((c, i) => {
    const r = details[i];
    const d = r.status === "fulfilled" ? r.value : null;
    return {
      id: c.id,
      title: c.title,
      industry: c.subIndustry ? `${c.industry.name} / ${c.subIndustry.name}` : c.industry.name,
      price: c.price.amount,
      status: c.status === "published" ? "Published" : "Draft",
      draftChanges: 0, // the backend has no draft-changes count yet
      duration: `${c.durationWeeks} weeks`,
      format: d?.format ?? "Self-paced online",
      modules: [...(d?.modules ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((m) => ({ id: m.slug, title: m.title, lessonCount: m.lessonCount })),
    };
  });
}

// ---- Enrolments ----
export async function getEnrolmentSummary(): Promise<EnrolmentSummary> {
  if (isMockApi) {
    await wait(300);
    return mockSummary;
  }
  const { activeEnrolments, payments } = await getAdminOverview();
  return {
    total: activeEnrolments,
    confirmed: payments.successful,
    pending: payments.pending,
    failed: payments.failed,
  };
}

export async function getEnrolmentCourses(): Promise<string[]> {
  if (isMockApi) return Array.from(new Set(mockEnrolments.map((r) => r.course)));
  return (await fetchAdminCourseList()).map((c) => c.title);
}

const PAYMENT: Record<string, PaymentStatus> = {
  successful: "Confirmed",
  pending: "Pending",
  failed: "Failed",
};

const toRecord = (e: ApiAdminEnrolment): EnrolmentRecord => ({
  id: e.id,
  learner: e.learner.name,
  learnerEmail: e.learner.email,
  course: e.course.title,
  paymentStatus: PAYMENT[e.payment.status] ?? "Pending",
  transactionRef: e.payment.reference,
  orderRef: e.id,
  accessActive: e.status === "active",
  amount: e.payment.price.amount,
});

// The list is paged (25 at a time), so read every page.
async function fetchAllEnrolments(): Promise<ApiAdminEnrolment[]> {
  const all: ApiAdminEnrolment[] = [];
  const seen = new Set<string>();
  let offset = 0;
  for (let page = 0; page < 40; page++) {
    const res = await apiFetch<ApiEnrolmentPage>(`/admin/enrolments?offset=${offset}`);
    const before = seen.size;
    for (const item of res.items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        all.push(item);
      }
    }
    offset += res.items.length;
    if (res.items.length === 0 || seen.size === before || all.length >= res.total) break;
  }
  return all;
}

export async function getEnrolments(f: EnrolmentFilters): Promise<EnrolmentRecord[]> {
  let records: EnrolmentRecord[];
  if (isMockApi) {
    await wait(300);
    records = mockEnrolments;
  } else {
    records = (await fetchAllEnrolments()).map(toRecord);
  }

  // Filters run in the browser for now (the backend's filter parameters aren't confirmed).
  const q = f.search.trim().toLowerCase();
  return records.filter(
    (r) =>
      (!q ||
        r.learner.toLowerCase().includes(q) ||
        (r.learnerEmail ?? "").toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q)) &&
      (f.payment === "All" || r.paymentStatus === f.payment) &&
      (f.course === "All" || r.course === f.course) &&
      (f.access === "All" || (f.access === "Active") === r.accessActive)
  );
}