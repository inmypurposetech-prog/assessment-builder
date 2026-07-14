import { MATHS_GDE_JUNE_P2_TEMPLATE_PACK } from "@/lib/content/template-packs/maths-gde-june-p2";
import { IEB_LS_ANALYSIS_GRID_PATTERN } from "@/lib/content/taxonomy/ieb-ls-analysis-grid";

/** Life Sciences / moderator export defaults (from parent interview). */
export const LIFE_SCIENCES_EXPORT_DEFAULTS = {
  fontFamily: "Arial",
  fontSizePt: 12,
  lineSpacing: 1.5,
  linedPaper: true,
  extraLinesForHandwriting: true,
  lineGap: 2,
  format: "pdf" as const,
  /** Bloom / AIM report pattern from Mom's IEB analysis grids. */
  taxonomyPatternId: IEB_LS_ANALYSIS_GRID_PATTERN.id,
};

/** Mathematics — GDE department template pack v1 (Dad June 2026 P2). */
export const MATHS_EXPORT_NOTES = {
  templateSource: "GDE-style memo + paper + answer book (department standard)",
  templatePackId: MATHS_GDE_JUNE_P2_TEMPLATE_PACK.id,
  requiresCognitiveReport: true,
  cognitiveCodes: MATHS_GDE_JUNE_P2_TEMPLATE_PACK.memoConventions.cognitiveCodes,
};
