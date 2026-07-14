import {
  IEB_LS_AIM_LABELS,
  IEB_LS_PAPER2_TARGET_PERCENT,
  type BloomDifficulty,
  type BloomLevel,
  type IebLifeSciencesAim,
} from "@/lib/constants/bloom-levels";

/**
 * Life Sciences Bloom / AIM pattern ingested from Mom's IEB 2023 analysis grids.
 * Does not copy question text — only column structure and target percentages.
 *
 * Sources (local/gitignored binaries):
 * - `…/final-exam/2023/paper-1/2023-paper-1-analysis-grid.pdf`
 * - `…/final-exam/2023/paper-2/2023-paper-2-analysis-grid.pdf`
 */

export type IebLsStrand =
  | "population_ecology"
  | "tissues_cells_molecular"
  | "structure_and_control"
  | "evolution_and_diversity"
  | "other";

export const IEB_LS_STRAND_LABELS: Record<IebLsStrand, string> = {
  population_ecology: "Population Ecology",
  tissues_cells_molecular: "Tissues, Cells and Molecular Studies",
  structure_and_control: "Structure and Control Processes",
  evolution_and_diversity: "Evolution / diversity (Paper II themes)",
  other: "Other / cross-strand",
};

export interface IebLsAnalysisGridPattern {
  id: "ieb-ls-analysis-grid-v1";
  version: 1;
  examBody: "IEB";
  subject: "Life Sciences";
  grade: "12";
  sourceYear: 2023;
  columns: {
    strands: IebLsStrand[];
    aims: IebLifeSciencesAim[];
    bloomLevels: BloomLevel[];
    difficultyLevels: BloomDifficulty[];
  };
  /** Default report targets (from Paper II “Targeted percentages”). */
  targetPercent: typeof IEB_LS_PAPER2_TARGET_PERCENT;
  aimLabels: typeof IEB_LS_AIM_LABELS;
  notes: string[];
}

export const IEB_LS_ANALYSIS_GRID_PATTERN: IebLsAnalysisGridPattern = {
  id: "ieb-ls-analysis-grid-v1",
  version: 1,
  examBody: "IEB",
  subject: "Life Sciences",
  grade: "12",
  sourceYear: 2023,
  columns: {
    strands: [
      "population_ecology",
      "tissues_cells_molecular",
      "structure_and_control",
      "evolution_and_diversity",
    ],
    aims: ["aim_1", "aim_2", "aim_3"],
    bloomLevels: [
      "knowledge",
      "comprehension",
      "application",
      "analysis",
      "synthesis",
      "evaluation",
    ],
    difficultyLevels: ["easy", "moderate", "difficult", "very_difficult"],
  },
  targetPercent: IEB_LS_PAPER2_TARGET_PERCENT,
  aimLabels: IEB_LS_AIM_LABELS,
  notes: [
    "Paper I grids allocate marks across three syllabus strands plus AIM, Bloom, and difficulty columns.",
    "Paper II grid uses AIM 1–3, Bloom (K/C/Ap/An/S/E), and difficulty (E/M/D/VD) with explicit target %.",
    "AssessMate Bloom reports for IEB Life Sciences should follow this column model — not CAPS Maths cognitive levels.",
    "Question bank items may store bloom_level, optional aim, and strand metadata for filtering and reports.",
  ],
};
