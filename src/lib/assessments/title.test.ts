import { describe, expect, it } from "vitest";
import { buildAssessmentTitle } from "./title";
import { defaultWizardData } from "@/lib/types/assessment";

describe("buildAssessmentTitle", () => {
  it("returns Untitled when nothing is chosen", () => {
    expect(buildAssessmentTitle(defaultWizardData)).toBe("Untitled assessment");
  });

  it("joins subject, grade and type", () => {
    expect(
      buildAssessmentTitle({
        ...defaultWizardData,
        subject: "Mathematics",
        grade: "12",
        assessmentType: "cycle_test",
      }),
    ).toBe("Mathematics · Grade 12 · Cycle test");
  });
});
