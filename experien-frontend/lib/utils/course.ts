import type { CourseCard } from "@/types/Course";

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;


export function courseChips(c?: CourseCard): string[] {
  return c
    ? [`${c.durationWeeks} weeks`, c.format, `${c.moduleCount} modules`, formatNaira(c.price)]
    : ["6 weeks", "Self-paced online", "4 modules", "₦75,000"];
}