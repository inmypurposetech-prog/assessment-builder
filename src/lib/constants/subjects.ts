import type { Subject } from "@/lib/types/assessment";

export const SUBJECT_LABELS: Record<Subject, string> = {
  Mathematics: "Mathematics",
  "Life Sciences": "Life Sciences",
};

export const TOPICS_BY_SUBJECT: Record<Subject, string[]> = {
  Mathematics: [
    "Algebra and equations",
    "Functions and graphs",
    "Finance and growth",
    "Probability",
    "Statistics",
    "Analytical geometry",
    "Trigonometry",
    "Euclidean geometry",
    "Measurement",
    "Patterns and sequences",
  ],
  "Life Sciences": [
    "Cells as basic units of life",
    "Tissues, organs and systems",
    "Biodiversity and classification",
    "Support and transport in plants",
    "Support and transport in animals",
    "Photosynthesis and respiration",
    "DNA and genetics",
    "Evolution",
    "Human impact on the environment",
    "Endocrine and nervous systems",
  ],
};

export const GRADE_OPTIONS = [
  { value: "10" as const, label: "Grade 10" },
  { value: "11" as const, label: "Grade 11" },
  { value: "12" as const, label: "Grade 12" },
];

export const EXAM_BODY_OPTIONS = [
  { value: "DBE" as const, label: "CAPS (DBE)", description: "National Curriculum and Assessment Policy Statement" },
  { value: "IEB" as const, label: "IEB", description: "Independent Examinations Board" },
];
