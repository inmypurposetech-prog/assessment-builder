import type { Subject } from "@/lib/types/assessment";
import type { AssembledQuestion } from "@/lib/generation/types";

const OBJECTIVE_TYPES = new Set(["mcq", "terminology", "matching"]);

export function isObjectiveItem(q: {
  itemType?: AssembledQuestion["itemType"];
}): boolean {
  return Boolean(q.itemType && OBJECTIVE_TYPES.has(q.itemType));
}

/**
 * Life Sciences / IEB: Question 1 is easier objective items (1.1, 1.2…),
 * then longer questions as Question 2+.
 * Mathematics stays sequential (1, 2, 3…).
 */
export function applyPaperNumbering(
  questions: AssembledQuestion[],
  subject: Subject,
): AssembledQuestion[] {
  if (subject !== "Life Sciences") {
    return questions.map((q, index) => ({
      ...q,
      number: index + 1,
      displayNumber: String(index + 1),
    }));
  }

  const objective = questions.filter(isObjectiveItem);
  const extended = questions.filter((q) => !isObjectiveItem(q));

  if (objective.length === 0) {
    return questions.map((q, index) => ({
      ...q,
      number: index + 1,
      displayNumber: String(index + 1),
      paperSection: q.paperSection ?? "B",
    }));
  }

  const numbered: AssembledQuestion[] = [];
  let sequential = 1;

  objective.forEach((q, i) => {
    numbered.push({
      ...q,
      number: sequential,
      displayNumber: `1.${i + 1}`,
      paperSection: "A",
    });
    sequential += 1;
  });

  extended.forEach((q, i) => {
    numbered.push({
      ...q,
      number: sequential,
      displayNumber: String(i + 2),
      paperSection: q.paperSection ?? "B",
    });
    sequential += 1;
  });

  return numbered;
}
