import type { AssessmentWizardData } from "@/lib/types/assessment";

const TYPE_LABELS: Record<string, string> = {
  classroom_exercise: "Class exercise",
  cycle_test: "Cycle test",
  assignment: "Assignment",
  practical: "Practical",
  june_exam: "June exam",
  trial_exam: "Trial exam",
  final_exam: "Final exam",
};

export function buildAssessmentTitle(data: AssessmentWizardData): string {
  const parts: string[] = [];

  if (data.subject) parts.push(data.subject);
  if (data.grade) parts.push(`Grade ${data.grade}`);
  if (data.assessmentType) {
    parts.push(TYPE_LABELS[data.assessmentType] ?? data.assessmentType);
  }

  if (parts.length === 0) return "Untitled assessment";
  return parts.join(" · ");
}
