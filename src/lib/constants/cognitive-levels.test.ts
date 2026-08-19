import { describe, expect, it } from "vitest";
import {
  DEFAULT_MATHS_COGNITIVE,
  isValidMathsCognitiveDistribution,
  mathsCognitiveDrift,
  mathsCognitiveTotal,
} from "./cognitive-levels";

describe("mathsCognitiveTotal", () => {
  it("sums the CAPS default to 100", () => {
    expect(mathsCognitiveTotal(DEFAULT_MATHS_COGNITIVE)).toBe(100);
  });
});

describe("isValidMathsCognitiveDistribution", () => {
  it("accepts the department 20/35/30/15 split", () => {
    expect(isValidMathsCognitiveDistribution(DEFAULT_MATHS_COGNITIVE)).toBe(true);
  });

  it("rejects a split that does not sum to 100", () => {
    expect(
      isValidMathsCognitiveDistribution({
        ...DEFAULT_MATHS_COGNITIVE,
        knowledge: 25,
      }),
    ).toBe(false);
  });
});

describe("mathsCognitiveDrift", () => {
  it("flags levels more than 5pp from target", () => {
    const drifts = mathsCognitiveDrift(
      { knowledge: 40, routine_procedure: 10, complex_procedure: 30, problem_solving: 20 },
      DEFAULT_MATHS_COGNITIVE,
      5,
    );
    expect(drifts.some((d) => d.level === "knowledge")).toBe(true);
  });
});
