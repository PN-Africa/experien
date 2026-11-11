
import type { AdminCourse, EnrolmentFilters, EnrolmentRecord, EnrolmentSummary } from "@/types/admin";
import { mockCourses, mockEnrolments, mockSummary } from "@/lib/mock/admin";
import { apiFetch, isMockApi } from "./client";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAdminCourses(): Promise<AdminCourse[]> {
  // if (isMockApi) {
  //   await wait(300);
  //   return mockCourses;
  // }
  // //   the path and response shape to be confirmed with the backend 
  // return apiFetch<AdminCourse[]>("/admin/courses");

    await wait(300);
  return mockCourses;
}

export async function getEnrolmentSummary(): Promise<EnrolmentSummary> {
  // if (isMockApi) {
  //   await wait(300);
  //   return mockSummary;
  // }
  // // confirm with the backend team (counts may come from the list endpoint instead)
  // return apiFetch<EnrolmentSummary>("/admin/enrolments/summary");

    await wait(300);
  return mockSummary;
}

export async function getEnrolmentCourses(): Promise<string[]> {
  if (isMockApi) return Array.from(new Set(mockEnrolments.map((r) => r.course)));
  //  use the courses endpoint instead if the backend has no separate list
  const courses = await getAdminCourses();
  return courses.map((c) => c.title);
}

export async function getEnrolments(f: EnrolmentFilters): Promise<EnrolmentRecord[]> {
  if (isMockApi) {
    await wait(300);
    const q = f.search.trim().toLowerCase();
    return mockEnrolments.filter(
      (r) =>
        (!q || r.learner.toLowerCase().includes(q) || r.course.toLowerCase().includes(q)) &&
        (f.payment === "All" || r.paymentStatus === f.payment) &&
        (f.course === "All" || r.course === f.course) &&
        (f.access === "All" || (f.access === "Active") === r.accessActive)
    );
  }
  // confirm the query parameter names with the backend team.
  // Payment status must be confirmed by the backend (not the browser) before access is active.
  const p = new URLSearchParams();
  if (f.search.trim()) p.set("search", f.search.trim());
  if (f.payment !== "All") p.set("payment", f.payment.toLowerCase());
  if (f.course !== "All") p.set("course", f.course);
  if (f.access !== "All") p.set("access", f.access === "Active" ? "active" : "inactive");
  return apiFetch<EnrolmentRecord[]>(`/admin/enrolments?${p.toString()}`);
}
