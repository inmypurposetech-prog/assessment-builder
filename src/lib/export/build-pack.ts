import JSZip from "jszip";
import type { GeneratedAssessment } from "@/lib/generation/types";
import { slugifyFilename } from "./filenames";
import { buildLifeSciencesPdf } from "./life-sciences-pdf";
import {
  buildMathsAnswerBookDocx,
  buildMathsCognitiveSummaryDocx,
  buildMathsMemoDocx,
  buildMathsQuestionPaperDocx,
} from "./maths-docx";

export type ExportPack = {
  filename: string;
  mimeType: string;
  body: Buffer;
  kind: "maths_zip" | "life_sciences_pdf";
};

/** Build subject-aware downloadable pack from locked GeneratedAssessment JSON. */
export async function buildExportPack(
  assessment: GeneratedAssessment,
): Promise<ExportPack> {
  const base = slugifyFilename(assessment.title);

  if (assessment.subject === "Mathematics") {
    const zip = new JSZip();
    const [paper, memo, answerBook, cognitive] = await Promise.all([
      buildMathsQuestionPaperDocx(assessment),
      buildMathsMemoDocx(assessment),
      buildMathsAnswerBookDocx(assessment),
      buildMathsCognitiveSummaryDocx(assessment),
    ]);

    zip.file("01-question-paper.docx", paper);
    zip.file("02-memorandum.docx", memo);
    zip.file("03-answer-book.docx", answerBook);
    zip.file("04-cognitive-summary.docx", cognitive);

    const body = Buffer.from(
      await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" }),
    );

    return {
      filename: `${base}-maths-export.zip`,
      mimeType: "application/zip",
      body,
      kind: "maths_zip",
    };
  }

  if (assessment.subject === "Life Sciences") {
    const body = await buildLifeSciencesPdf(assessment);
    return {
      filename: `${base}-life-sciences.pdf`,
      mimeType: "application/pdf",
      body,
      kind: "life_sciences_pdf",
    };
  }

  throw new Error(`Unsupported subject for export: ${assessment.subject}`);
}
