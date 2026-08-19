import { describe, expect, it } from "vitest";
import { defaultWizardData } from "@/lib/types/assessment";
import { buildDraftGapQuestions } from "./draft-gaps";
import { assembleAssessment } from "./assemble";
import { applyPaperNumbering } from "./paper-numbering";
import { getSeedQuestionBankStats } from "@/lib/content/question-bank";

describe("seed bank stats", () => {
  it("keeps a usable Maths and Life Sciences pool", () => {
    const stats = getSeedQuestionBankStats();
    expect(stats.maths).toBeGreaterThanOrEqual(25);
    expect(stats.lifeSciences).toBeGreaterThanOrEqual(24);
  });
});

describe("draft gap fill", () => {
  it("covers a 50-mark Maths shortfall", () => {
    const questions = buildDraftGapQuestions({
      wizard: {
        ...defaultWizardData,
        subject: "Mathematics",
        grade: "12",
        examBody: "DBE",
        assessmentType: "cycle_test",
        selectedTopics: ["Algebra and equations"],
      },
      shortfallMarks: 50,
      includeMcq: false,
    });
    const marks = questions.reduce((sum, q) => sum + q.marks, 0);
    expect(marks).toBe(50);
    expect(questions.every((q) => q.source.startsWith("Draft gap-fill"))).toBe(true);
  });
});

describe("IEB numbering", () => {
  it("puts objective items under 1.1 then longer questions as 2+", () => {
    const numbered = applyPaperNumbering(
      [
        {
          number: 1,
          bankId: "a",
          topic: "Evolution",
          marks: 1,
          difficulty: "easy",
          questionText: "MCQ",
          source: "test",
          itemType: "mcq",
          bloomLevel: "knowledge",
        },
        {
          number: 2,
          bankId: "b",
          topic: "Evolution",
          marks: 6,
          difficulty: "hard",
          questionText: "Essay",
          source: "test",
          itemType: "extended",
          bloomLevel: "analysis",
        },
      ],
      "Life Sciences",
    );
    expect(numbered[0].displayNumber).toBe("1.1");
    expect(numbered[1].displayNumber).toBe("2");
  });
});

describe("assembleAssessment gap merge", () => {
  it("reaches the mark target when drafts are supplied", () => {
    const wizard = {
      ...defaultWizardData,
      subject: "Mathematics" as const,
      grade: "12" as const,
      examBody: "DBE" as const,
      assessmentType: "cycle_test" as const,
      totalMarks: 50,
      durationMinutes: 60,
      selectedTopics: ["Algebra and equations"],
    };
    const drafts = buildDraftGapQuestions({
      wizard,
      shortfallMarks: 50,
      includeMcq: false,
    });
    const generated = assembleAssessment({
      assessmentId: "00000000-0000-4000-8000-000000000001",
      title: "Test",
      wizard,
      bank: [],
      aiFilled: drafts,
      cost: {
        model: "bank-only",
        maxTokens: 0,
        tokensUsed: 0,
        source: "question_bank+draft_gaps",
        monthlyUsed: 0,
        monthlyCap: 30,
        aiGapFillAttempted: true,
      },
    });
    expect(generated.paper.totalMarksActual).toBeGreaterThanOrEqual(50);
    expect(generated.warnings.some((w) => w.includes("Draft questions"))).toBe(true);
  });
});
