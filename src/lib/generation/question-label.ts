/** Printed question number (IEB 1.1 / 1.2, or sequential 1, 2, 3). */
export function questionLabel(q: {
  displayNumber?: string;
  number: number;
}): string {
  return q.displayNumber?.trim() || String(q.number);
}

/**
 * Format a marking guideline line with a tick and optional mark award.
 * Seeds may already include "✓" and "(1)"; otherwise we prefix a tick.
 */
export function formatMarkingGuidelineLine(
  point: string,
  options?: { bloomOrCognitiveCode?: string },
): string {
  const trimmed = point.trim();
  const withTick = trimmed.startsWith("✓") ? trimmed : `✓ ${trimmed}`;
  if (!options?.bloomOrCognitiveCode) return withTick;
  if (withTick.includes(`[${options.bloomOrCognitiveCode}]`)) return withTick;
  return `${withTick}  [${options.bloomOrCognitiveCode}]`;
}

const GEOMETRY_TOPIC = /geometry/i;

export function paperHasGeometry(
  questions: { topic: string }[],
): boolean {
  return questions.some((q) => GEOMETRY_TOPIC.test(q.topic));
}
