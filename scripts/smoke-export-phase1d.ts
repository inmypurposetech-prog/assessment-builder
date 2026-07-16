/**
 * Offline smoke: assemble bank paper → DOCX ZIP / PDF.
 * Run: npx tsx --tsconfig tsconfig.json scripts/smoke-export-phase1d.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SEED_QUESTION_BANK } from "../src/lib/content/question-bank";
import { assembleAssessment } from "../src/lib/generation/assemble";
import { buildExportPack } from "../src/lib/export/build-pack";
import {
  defaultWizardData,
  type AssessmentWizardData,
} from "../src/lib/types/assessment";

const outDir = join(process.cwd(), ".tmp/smoke-export");
mkdirSync(outDir, { recursive: true });

const costBase = {
  model: "bank-only",
  maxTokens: 0,
  tokensUsed: 0,
  source: "question_bank" as const,
  monthlyUsed: 1,
  monthlyCap: 50,
  aiGapFillAttempted: false,
};

function mathsWizard(): AssessmentWizardData {
  return {
    ...defaultWizardData,
    assessmentType: "cycle_test",
    examBody: "DBE",
    subject: "Mathematics",
    grade: "12",
    term: "2",
    scopeMode: "topics",
    totalMarks: 50,
    durationMinutes: 60,
  };
}

function lsWizard(): AssessmentWizardData {
  return {
    ...defaultWizardData,
    assessmentType: "cycle_test",
    examBody: "IEB",
    subject: "Life Sciences",
    grade: "12",
    term: "2",
    scopeMode: "topics",
    totalMarks: 50,
    durationMinutes: 60,
    bloomFocus: "balanced",
  };
}

async function runSubject(label: string, wizard: AssessmentWizardData) {
  const assembled = assembleAssessment({
    assessmentId: "00000000-0000-4000-8000-000000000001",
    title: `Smoke ${label}`,
    wizard,
    bank: SEED_QUESTION_BANK,
    cost: costBase,
  });

  const pack = await buildExportPack(assembled);
  const path = join(outDir, pack.filename);
  writeFileSync(path, pack.body);

  const magic = pack.body.subarray(0, 4);
  const isZip = magic[0] === 0x50 && magic[1] === 0x4b;
  const isPdf =
    magic[0] === 0x25 &&
    magic[1] === 0x50 &&
    magic[2] === 0x44 &&
    magic[3] === 0x46;

  const okKind =
    (pack.kind === "maths_zip" && isZip) ||
    (pack.kind === "life_sciences_pdf" && isPdf);

  console.log(
    JSON.stringify(
      {
        label,
        subject: assembled.subject,
        questions: assembled.paper.questions.length,
        paperMarks: assembled.paper.totalMarksActual,
        memoMarks: assembled.memo.totalMarks,
        kind: pack.kind,
        filename: pack.filename,
        bytes: pack.body.length,
        magicOk: okKind,
        path,
      },
      null,
      2,
    ),
  );

  if (!okKind) {
    throw new Error(`${label}: bad file magic for ${pack.kind}`);
  }
  if (assembled.paper.questions.length === 0) {
    throw new Error(`${label}: assembled zero questions`);
  }
  if (pack.body.length < 500) {
    throw new Error(`${label}: file suspiciously small (${pack.body.length} bytes)`);
  }
}

async function main() {
  await runSubject("Mathematics", mathsWizard());
  await runSubject("Life Sciences", lsWizard());
  console.log("SMOKE_OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
