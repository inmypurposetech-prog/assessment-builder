import { SEED_LIFE_SCIENCES_QUESTIONS } from "./seed-life-sciences";
import { SEED_MATHS_QUESTIONS } from "./seed-maths";
import { filterSeedQuestions, type SeedQuestion } from "./types";

export type { SeedQuestion } from "./types";
export { filterSeedQuestions } from "./types";
export { SEED_MATHS_QUESTIONS } from "./seed-maths";
export { SEED_LIFE_SCIENCES_QUESTIONS } from "./seed-life-sciences";

/** Combined Phase 1A seed bank (original items; not past-paper text). */
export const SEED_QUESTION_BANK: SeedQuestion[] = [
  ...SEED_MATHS_QUESTIONS,
  ...SEED_LIFE_SCIENCES_QUESTIONS,
];

export function getSeedQuestionBankStats() {
  const maths = SEED_MATHS_QUESTIONS.length;
  const lifeSciences = SEED_LIFE_SCIENCES_QUESTIONS.length;
  return {
    total: maths + lifeSciences,
    maths,
    lifeSciences,
    bySubject: {
      Mathematics: maths,
      "Life Sciences": lifeSciences,
    },
  };
}

export function querySeedQuestionBank(
  filters: Parameters<typeof filterSeedQuestions>[1],
): SeedQuestion[] {
  return filterSeedQuestions(SEED_QUESTION_BANK, filters);
}
