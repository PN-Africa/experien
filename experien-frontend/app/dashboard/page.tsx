import Link from "next/link";
import type { Metadata } from "next";
import { getCourseBySlug } from "@/lib/mock/Courses";
import type { CourseModule } from "@/types/Course";
import { enrolments, learner } from "@/lib/mock/learner";
import {
  completedModuleCount,
  nextLesson,
  pad,
  pickQuiz,
  pickResource,
  progressPercent,
} from "@/lib/utils/learning";
import DashboardHero, { type Stat } from "@/components/dashboard/DashboardHero";
import ActiveCourse from "@/components/dashboard/ActiveCourse";
import DashboardLinks from "@/components/dashboard/DashboardLinks";

export const metadata: Metadata = { title: "My learning | Experien" };

export default function DashboardPage() {
  //  require login, then load the learner and their enrolments from the backend.
  const firstName = learner.name.split(" ")[0];
  const enrolment = enrolments[0];
  const course = enrolment && getCourseBySlug(enrolment.courseSlug);

  if (!enrolment || !course) {
    return (
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-16">
          <h1 className="text-3xl font-medium tracking-tight">Welcome, {firstName}.</h1>
          <p className="mt-3 text-sm text-muted">You haven&apos;t enrolled in a course yet.</p>
          <Link
            href="/industries"
            className="mt-5 inline-block rounded-lg bg-lime px-5 py-2.5 text-sm font-medium text-ink"
          >
            Explore industries
          </Link>
        </div>
      </section>
    );
  }

  const completed = new Set(enrolment.completedLessonIds);
  const pct = progressPercent(course, completed);
  const next = nextLesson(course, completed);
  const moduleIndex = next?.moduleIndex ?? course.modules.length - 1;
  const doneModules = completedModuleCount(course, completed);

  const scores = Object.entries(enrolment.quizScores);
  const latest = scores[scores.length - 1];
  const latestModule = latest
  ? course.modules.findIndex((m: CourseModule) => m.id === latest[0])
  : -1;

  const stats: Stat[] = [
    { label: "Active courses", value: String(enrolments.length), sub: course.title },
    { label: "Overall progress", value: `${pct}%`, sub: `Module ${moduleIndex + 1} of ${course.modules.length}` },
    {
      label: "Completed modules",
      value: String(doneModules),
      sub: `${course.modules.length - doneModules} modules remaining`,
    },
    {
      label: "Latest quiz",
      value: latest ? `${latest[1]}%` : "—",
      sub: latest && latestModule >= 0 ? `Module ${pad(latestModule + 1)}` : "No quiz taken yet",
    },
  ];

  return (
    <div>
      <DashboardHero firstName={firstName} stats={stats} />
      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] space-y-6 px-6 py-10 md:px-16 md:py-12">
          <ActiveCourse
            course={course}
            pct={pct}
            moduleIndex={moduleIndex}
            next={next}
            resource={pickResource(course, moduleIndex, completed)}
            quiz={pickQuiz(course, moduleIndex)}
          />
          <DashboardLinks slug={course.slug} moduleCount={course.modules.length} pct={pct} />
        </div>
      </section>
    </div>
  );
}
