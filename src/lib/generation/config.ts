/**
 * Generation cost / model controls (Phase 1B).
 * Bank-first assembly is free; AI gap-fill only runs when a key is present.
 */

export type GenerationModelId =
  | "bank-only"
  | "gpt-4o-mini"
  | "gemini-2.0-flash";

export interface GenerationCostConfig {
  /** Selected model id (env GENERATION_MODEL). */
  model: GenerationModelId;
  /** Cap for future AI completions (env GENERATION_MAX_TOKENS). */
  maxTokens: number;
  /** Soft monthly generation count per user (env GENERATION_MONTHLY_CAP). */
  monthlyCap: number;
  /** True when OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is set. */
  aiConfigured: boolean;
}

const ALLOWED_MODELS: GenerationModelId[] = [
  "bank-only",
  "gpt-4o-mini",
  "gemini-2.0-flash",
];

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return fallback;
  return n;
}

export function getGenerationCostConfig(): GenerationCostConfig {
  const rawModel = (process.env.GENERATION_MODEL ?? "bank-only").trim();
  const model = (ALLOWED_MODELS.includes(rawModel as GenerationModelId)
    ? rawModel
    : "bank-only") as GenerationModelId;

  const openai = Boolean(process.env.OPENAI_API_KEY?.trim());
  const google = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim());

  return {
    model,
    maxTokens: parsePositiveInt(process.env.GENERATION_MAX_TOKENS, 2048),
    monthlyCap: parsePositiveInt(process.env.GENERATION_MONTHLY_CAP, 30),
    aiConfigured: openai || google,
  };
}

/** Whether this request may attempt light AI gap-fill. */
export function shouldAttemptAiGapFill(config: GenerationCostConfig): boolean {
  return config.model !== "bank-only" && config.aiConfigured;
}
