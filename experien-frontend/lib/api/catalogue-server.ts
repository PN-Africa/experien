
import { pathways, type Pathway } from "@/components/industries/pathways";
import { getCourseBySlug } from "@/lib/mock/Courses";
import type { Course } from "@/types/Course";
import {
  staticPathway,
  toCourse,
  toPathway,
  type ApiCourseDetail,
  type ApiIndustry,
  type ApiCourseCard,
} from "./catalogue";

const BACKEND = process.env.BACKEND_URL ?? "";
const live = () => BACKEND !== "" && !!process.env.NEXT_PUBLIC_API_BASE_URL;

type Result<T> = { state: "ok"; data: T } | { state: "notfound" } | { state: "error" };

async function get<T>(path: string): Promise<Result<T>> {
  try {
    const res = await fetch(BACKEND + path, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }, // cache for a minute so Render's cold starts rarely reach visitors
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return { state: "notfound" };
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.success) return { state: "error" };
    return { state: "ok", data: body.data as T };
  } catch {
    return { state: "error" };
  }
}

export async function getCourse(slug: string): Promise<Course | null> {
  if (!live()) return getCourseBySlug(slug) ?? null;
  const r = await get<ApiCourseDetail>(`/courses/${encodeURIComponent(slug)}`);
  if (r.state === "ok") return toCourse(r.data);
  if (r.state === "notfound") return null;
  return getCourseBySlug(slug) ?? null; // backend unreachable: fall back to the old mock data
}

export async function getPathway(slug: string): Promise<Pathway | null> {
  const fallback = () => {
    const p = pathways.find((x) => x.id === slug);
    return p ? staticPathway(p) : null;
  };
  if (!live()) return fallback();
  const r = await get<ApiIndustry & { courses: ApiCourseCard[] }>(`/industries/${encodeURIComponent(slug)}`);
  if (r.state === "ok") return toPathway(r.data, r.data.courses);
  if (r.state === "notfound") return null;
  return fallback();
}