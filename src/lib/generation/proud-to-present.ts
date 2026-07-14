import type { GeneratedAssessment } from "@/lib/generation/types";

export type ProudFlagSeverity = "blocker" | "caution";

export interface ProudToPresentFlag {
  id: string;
  severity: ProudFlagSeverity;
  message: string;
}

export interface ProudToPresentResult {
  ready: boolean;
  flags: ProudToPresentFlag[];
}

/**
 * Dad's "proud to present" test — plain-language blockers before export.
 * Green only when nothing material is wrong (paper ↔ memo ↔ taxonomy).
 */
export function evaluateProudToPresent(
  assessment: GeneratedAssessment,
): ProudToPresentResult {
  const flags: ProudToPresentFlag[] = [];
  const { paper, memo, taxonomy } = assessment;

  if (paper.questions.length === 0) {
    flags.push({
      id: "empty-paper",
      severity: "blocker",
      message: "There are no questions on this paper yet.",
    });
  }

  if (paper.totalMarksActual !== memo.totalMarks) {
    flags.push({
      id: "paper-memo-marks",
      severity: "blocker",
      message: `Paper marks (${paper.totalMarksActual}) do not match memo marks (${memo.totalMarks}).`,
    });
  }

  if (
    paper.totalMarksTarget > 0 &&
    paper.totalMarksActual !== paper.totalMarksTarget
  ) {
    flags.push({
      id: "marks-vs-target",
      severity: "caution",
      message: `Assembled ${paper.totalMarksActual} marks; you asked for ${paper.totalMarksTarget}.`,
    });
  }

  for (const item of memo.items) {
    if (!item.memoAnswer.trim()) {
      flags.push({
        id: `memo-empty-${item.number}`,
        severity: "blocker",
        message: `Question ${item.number}: marking memo answer is empty.`,
      });
    }
    if (!item.markingPoints.length) {
      flags.push({
        id: `points-empty-${item.number}`,
        severity: "blocker",
        message: `Question ${item.number}: no marking points listed.`,
      });
    }
  }

  if (taxonomy.model === "caps_cognitive") {
    if (!taxonomy.withinTolerance && paper.questions.length > 0) {
      const detail = taxonomy.drifts
        .map(
          (d) =>
            `${d.level.replaceAll("_", " ")} ${d.actualPct}% (target ${d.targetPct}%)`,
        )
        .join("; ");
      flags.push({
        id: "caps-drift",
        severity: "caution",
        message: `CAPS cognitive levels need a closer look: ${detail || "outside ±5 percentage points"}.`,
      });
    }
  } else {
    for (const q of paper.questions) {
      if (!q.bloomLevel) {
        flags.push({
          id: `bloom-missing-${q.number}`,
          severity: "blocker",
          message: `Question ${q.number}: Bloom level is missing.`,
        });
      }
    }
  }

  for (const warning of assessment.warnings) {
    if (
      warning.includes("Bank shortfall") ||
      warning.includes("No seed questions") ||
      warning.includes("Could not select")
    ) {
      flags.push({
        id: `warn-${warning.slice(0, 40)}`,
        severity: "caution",
        message: warning,
      });
    }
  }

  const ready =
    flags.filter((f) => f.severity === "blocker").length === 0 &&
    paper.questions.length > 0;

  return { ready, flags };
}
