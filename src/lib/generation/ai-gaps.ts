import type { GenerationCostConfig } from "@/lib/generation/config";
import type { SeedQuestion } from "@/lib/content/question-bank";
import type { AssessmentWizardData } from "@/lib/types/assessment";

export interface AiGapFillInput {
  wizard: AssessmentWizardData;
  /** Marks still needed after bank assembly */
  shortfallMarks: number;
  /** Topics / levels that need coverage */
  gaps: string[];
  config: GenerationCostConfig;
}

/**
 * Light AI gap-fill hook (Phase 1B).
 * Returns [] when model is bank-only, no API key, or shortfall is zero.
 * Real provider calls land when ADR-012 cost keys are configured — keep structured.
 */
export async function fillGapsWithAi(
  input: AiGapFillInput,
): Promise<{ questions: SeedQuestion[]; tokensUsed: number; attempted: boolean }> {
  if (input.shortfallMarks <= 0 || input.gaps.length === 0) {
    return { questions: [], tokensUsed: 0, attempted: false };
  }

  if (input.config.model === "bank-only" || !input.config.aiConfigured) {
    return { questions: [], tokensUsed: 0, attempted: false };
  }

  // Provider wiring deferred: structured JSON schema must match SeedQuestion.
  // Cap tokens via input.config.maxTokens when implementing.
  return {
    questions: [],
    tokensUsed: 0,
    attempted: true,
  };
}
