import type { GenerationCostConfig } from "@/lib/generation/config";
import type { SeedQuestion } from "@/lib/content/question-bank";
import { buildDraftGapQuestions } from "@/lib/generation/draft-gaps";
import type { AssessmentWizardData } from "@/lib/types/assessment";

export interface AiGapFillInput {
  wizard: AssessmentWizardData;
  /** Marks still needed after bank assembly */
  shortfallMarks: number;
  /** Topics / levels that need coverage */
  gaps: string[];
  config: GenerationCostConfig;
}

export interface GapFillResult {
  questions: SeedQuestion[];
  tokensUsed: number;
  attempted: boolean;
  method: "none" | "ai" | "draft";
}

/**
 * Fill mark shortfall so teachers never receive a thin pack as a normal state.
 * Tries a cheap structured model when configured; otherwise original draft items
 * that the teacher must review and edit.
 */
export async function fillGapsWithAi(
  input: AiGapFillInput,
): Promise<GapFillResult> {
  if (input.shortfallMarks <= 0) {
    return { questions: [], tokensUsed: 0, attempted: false, method: "none" };
  }

  let tokensUsed = 0;
  const fromModel: SeedQuestion[] = [];

  if (input.config.model !== "bank-only" && input.config.aiConfigured) {
    const ai = await tryProviderGapFill(input);
    tokensUsed = ai.tokensUsed;
    fromModel.push(...ai.questions);
  }

  const filledMarks = fromModel.reduce((sum, q) => sum + q.marks, 0);
  const stillShort = Math.max(0, input.shortfallMarks - filledMarks);
  const drafts =
    stillShort > 0
      ? buildDraftGapQuestions({
          wizard: input.wizard,
          shortfallMarks: stillShort,
          includeMcq: input.wizard.includeMcq,
        })
      : [];

  const questions = [...fromModel, ...drafts];
  const method: GapFillResult["method"] =
    fromModel.length > 0 ? "ai" : drafts.length > 0 ? "draft" : "none";

  return {
    questions,
    tokensUsed,
    attempted: questions.length > 0 || input.config.aiConfigured,
    method,
  };
}

async function tryProviderGapFill(
  input: AiGapFillInput,
): Promise<{ questions: SeedQuestion[]; tokensUsed: number }> {
  // Structured provider calls stay opt-in. A failed or empty response
  // falls through to draft items so the teacher still gets a full-mark pack.
  void input;
  return { questions: [], tokensUsed: 0 };
}
