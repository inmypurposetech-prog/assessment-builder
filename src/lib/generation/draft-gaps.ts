import type { SeedQuestion } from "@/lib/content/question-bank";
import type { MathsCognitiveLevel } from "@/lib/constants/cognitive-levels";
import type { BloomLevel } from "@/lib/constants/bloom-levels";
import type { AssessmentWizardData } from "@/lib/types/assessment";

const DRAFT_SOURCE = "Draft gap-fill — please review and edit before moderation";

const MATHS_LEVELS: MathsCognitiveLevel[] = [
  "knowledge",
  "routine_procedure",
  "complex_procedure",
  "problem_solving",
];

const BLOOM_CYCLE: BloomLevel[] = [
  "knowledge",
  "comprehension",
  "application",
  "analysis",
];

function topicsFor(wizard: AssessmentWizardData): string[] {
  if (wizard.selectedTopics.length > 0) return wizard.selectedTopics;
  if (wizard.subject === "Mathematics") {
    return ["Algebra and equations", "Functions and graphs", "Trigonometry"];
  }
  return ["DNA and genetics", "Evolution", "Human reproduction"];
}

function mathsDraft(input: {
  index: number;
  marks: number;
  topic: string;
  wizard: AssessmentWizardData;
  level: MathsCognitiveLevel;
}): SeedQuestion {
  const { index, marks, topic, wizard, level } = input;
  const n = index + 3;
  const verb =
    level === "knowledge"
      ? "Write down"
      : level === "routine_procedure"
        ? "Calculate"
        : level === "complex_procedure"
          ? "Determine"
          : "Show how you would approach";

  return {
    id: `draft-maths-${wizard.grade}-${index + 1}`,
    subject: "Mathematics",
    grade: wizard.grade!,
    examBody: wizard.examBody!,
    topic,
    difficulty: level === "problem_solving" || level === "complex_procedure" ? "hard" : "medium",
    marks,
    cognitiveLevel: level,
    questionText: `${verb} a Grade ${wizard.grade} ${topic.toLowerCase()} item worth ${marks} marks. Use values based on ${n} where a number is needed. (Draft — replace with your own wording if needed.)`,
    memoAnswer: `Final answer depends on the drafted stem — award method marks even if the last line is incomplete.`,
    markingPoints: [
      `✓ Identify the correct method or formula (1)`,
      `✓ Substitute / carry out the procedure (1)`,
      marks >= 3 ? `✓ Reach a consistent final answer (${marks - 2})` : `✓ Consistent accuracy (CA) on the last line`,
    ],
    source: DRAFT_SOURCE,
    assessmentType: wizard.assessmentType ?? "cycle_test",
    language: "en",
  };
}

function lsObjectiveDraft(input: {
  index: number;
  topic: string;
  wizard: AssessmentWizardData;
  kind: "mcq" | "terminology";
}): SeedQuestion {
  const { index, topic, wizard, kind } = input;
  if (kind === "mcq") {
    return {
      id: `draft-ls-obj-${index + 1}`,
      subject: "Life Sciences",
      grade: wizard.grade!,
      examBody: wizard.examBody!,
      topic,
      difficulty: "easy",
      marks: 1,
      bloomLevel: "knowledge",
      aim: "aim_1",
      itemType: "mcq",
      options: ["A  Option A", "B  Option B", "C  Option C", "D  Option D"],
      questionText: `1-mark multiple choice on ${topic} (draft). Choose the most correct statement.`,
      memoAnswer: "A",
      markingPoints: ["✓ Correct option A (1)"],
      source: DRAFT_SOURCE,
      assessmentType: wizard.assessmentType ?? "cycle_test",
      language: "en",
    };
  }
  return {
    id: `draft-ls-term-${index + 1}`,
    subject: "Life Sciences",
    grade: wizard.grade!,
    examBody: wizard.examBody!,
    topic,
    difficulty: "easy",
    marks: 1,
    bloomLevel: "knowledge",
    aim: "aim_1",
    itemType: "terminology",
    questionText: `Give the correct biological term for a core idea in ${topic} (draft).`,
    memoAnswer: `Accepted term for the ${topic} concept in the stem.`,
    markingPoints: ["✓ Correct term (1)"],
    source: DRAFT_SOURCE,
    assessmentType: wizard.assessmentType ?? "cycle_test",
    language: "en",
  };
}

function lsExtendedDraft(input: {
  index: number;
  marks: number;
  topic: string;
  wizard: AssessmentWizardData;
  bloom: BloomLevel;
}): SeedQuestion {
  const { index, marks, topic, wizard, bloom } = input;
  const verb =
    bloom === "knowledge"
      ? "Name and define"
      : bloom === "comprehension"
        ? "Explain"
        : bloom === "application"
          ? "Apply"
          : "Compare and distinguish";

  return {
    id: `draft-ls-ext-${index + 1}`,
    subject: "Life Sciences",
    grade: wizard.grade!,
    examBody: wizard.examBody!,
    topic,
    difficulty: bloom === "analysis" ? "hard" : "medium",
    marks,
    bloomLevel: bloom,
    aim: bloom === "knowledge" ? "aim_1" : "aim_3",
    itemType: "extended",
    questionText: `${verb} a ${marks}-mark ${topic} item for Grade ${wizard.grade}. Shape the memo to the command verb (similarities vs differences where you compare). (Draft — replace with your own wording if needed.)`,
    memoAnswer: `Marking guideline follows the command verb for ${topic}. Award each distinct point beside the tick.`,
    markingPoints: Array.from({ length: Math.min(marks, 4) }, (_, i) => {
      const leftover = i === Math.min(marks, 4) - 1 ? marks - i : 1;
      return `✓ Valid ${verb.toLowerCase()} point ${i + 1} (${leftover})`;
    }),
    source: DRAFT_SOURCE,
    assessmentType: wizard.assessmentType ?? "cycle_test",
    language: "en",
  };
}

/**
 * Original pedagogical drafts so the paper meets the requested mark total
 * when the seed bank is thin. Teachers must review — never treat as final.
 */
export function buildDraftGapQuestions(input: {
  wizard: AssessmentWizardData;
  shortfallMarks: number;
  includeMcq: boolean;
}): SeedQuestion[] {
  const { wizard, includeMcq } = input;
  let remaining = input.shortfallMarks;
  if (remaining <= 0 || !wizard.subject || !wizard.grade || !wizard.examBody) {
    return [];
  }

  const topics = topicsFor(wizard);
  const out: SeedQuestion[] = [];
  let i = 0;

  if (wizard.subject === "Life Sciences" && includeMcq) {
    const objectiveBudget = Math.min(8, remaining);
    let objMarks = 0;
    while (objMarks < objectiveBudget && remaining > 0) {
      const topic = topics[i % topics.length];
      const kind = objMarks % 2 === 0 ? "mcq" : "terminology";
      out.push(lsObjectiveDraft({ index: i, topic, wizard, kind }));
      remaining -= 1;
      objMarks += 1;
      i += 1;
    }
  }

  while (remaining > 0) {
    const topic = topics[i % topics.length];
    const chunk = Math.min(remaining, remaining > 6 ? 4 : remaining);
    if (wizard.subject === "Mathematics") {
      const level = MATHS_LEVELS[i % MATHS_LEVELS.length];
      out.push(
        mathsDraft({
          index: i,
          marks: chunk,
          topic,
          wizard,
          level,
        }),
      );
    } else {
      const bloom = BLOOM_CYCLE[i % BLOOM_CYCLE.length];
      out.push(
        lsExtendedDraft({
          index: i,
          marks: chunk,
          topic,
          wizard,
          bloom,
        }),
      );
    }
    remaining -= chunk;
    i += 1;
  }

  return out;
}
