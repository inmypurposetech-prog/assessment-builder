import type { GeneratedAssessment } from "@/lib/generation/types";

export function isGeneratedAssessment(value: unknown): value is GeneratedAssessment {
  if (!value || typeof value !== "object") return false;
  const v = value as GeneratedAssessment;
  return (
    v.schemaVersion === 1 &&
    Array.isArray(v.paper?.questions) &&
    Array.isArray(v.memo?.items) &&
    typeof v.subject === "string" &&
    typeof v.title === "string"
  );
}
