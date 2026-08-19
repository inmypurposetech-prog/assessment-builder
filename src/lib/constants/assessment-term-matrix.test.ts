import { describe, expect, it } from "vitest";
import {
  isAssessmentTypeAllowedForTerm,
  assessmentTypeTermReason,
} from "./assessment-term-matrix";

describe("term ↔ assessment type", () => {
  it("blocks June exams in term 1", () => {
    expect(isAssessmentTypeAllowedForTerm("june_exam", "1")).toBe(false);
    expect(assessmentTypeTermReason("june_exam")).toMatch(/term 2/i);
  });

  it("allows trial exams in term 3", () => {
    expect(isAssessmentTypeAllowedForTerm("trial_exam", "3")).toBe(true);
  });

  it("restricts finals to term 4", () => {
    expect(isAssessmentTypeAllowedForTerm("final_exam", "3")).toBe(false);
    expect(isAssessmentTypeAllowedForTerm("final_exam", "4")).toBe(true);
  });
});
