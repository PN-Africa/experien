import type { CourseCard } from "@/types/Course";

export type Pathway = {
  id: string;
  name: string;
  blurb: string;
  cardPath: string;
  pathway: string;
  courseTitle: string;
  courseSummary: string;
  slug: string;
  whyIntro: string;
  why: string[];
  situations: string;
    courses?: CourseCard[]; 
};

export const pathways: Pathway[] = [
  {
    id: "technology",
    name: "Technology",
    blurb: "Project management for software, digital-product and IT delivery teams.",
    cardPath: "IT Project Management",
    pathway: "IT Project Management",
    courseTitle: "IT Project Management",
    courseSummary:
      "Build practical skills to scope, plan, coordinate and close technology projects—from project setup and stakeholder alignment to schedules, risk and closeout.",
    slug: "it-project-management",
    whyIntro: "The examples and templates in this pathway are framed around technology project delivery.",
    why: [
      "Software and digital-product project scenarios",
      "Stakeholder, scope and schedule planning",
      "Risk registers and practical templates",
      "Module quizzes and progress tracking",
    ],
    situations: "technology-project",
  },
  {
    id: "construction",
    name: "Construction",
    blurb: "Project management for construction teams, site delivery and project coordination.",
    cardPath: "Construction pathway",
    pathway: "Construction Project Management",
    courseTitle: "Construction Project Management",
    courseSummary:
      "Build practical skills to plan, coordinate and deliver construction projects—from site setup and contractor coordination to schedules, cost and handover.",
    slug: "construction-project-management",
    whyIntro: "The examples and templates in this pathway are framed around construction project delivery.",
    why: [
      "Site and contractor coordination scenarios",
      "Cost, scope and schedule planning",
      "Risk registers and practical templates",
      "Module quizzes and progress tracking",
    ],
    situations: "construction-project",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    blurb: "Project management for production environments and operational delivery.",
    cardPath: "Manufacturing pathway",
    pathway: "Manufacturing Project Management",
    courseTitle: "Manufacturing Project Management",
    courseSummary:
      "Build practical skills to plan and deliver manufacturing projects—from production setup and supplier coordination to quality, cost and operational handover.",
    slug: "manufacturing-project-management",
    whyIntro: "The examples and templates in this pathway are framed around manufacturing project delivery.",
    why: [
      "Production and supplier coordination scenarios",
      "Quality, cost and schedule planning",
      "Risk registers and practical templates",
      "Module quizzes and progress tracking",
    ],
    situations: "manufacturing-project",
  },
];