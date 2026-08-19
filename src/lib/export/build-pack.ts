import JSZip from "jszip";
import type { GeneratedAssessment } from "@/lib/generation/types";
import { slugifyFilename } from "./filenames";
import {
  buildLifeSciencesBloomPdf,
  buildLifeSciencesMemoPdf,
  buildLifeSciencesQuestionPaperPdf,
} from "./life-sciences-pdf";
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
  kind: "maths_zip" | "life_sciences_zip";
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
    const zip = new JSZip();
    const [paper, memo, bloom] = await Promise.all([
      buildLifeSciencesQuestionPaperPdf(assessment),
      buildLifeSciencesMemoPdf(assessment),
      buildLifeSciencesBloomPdf(assessment),
    ]);

    zip.file("01-question-paper.pdf", paper);
    zip.file("02-marking-guideline.pdf", memo);
    zip.file("03-bloom-summary.pdf", bloom);

    const body = Buffer.from(
      await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" }),
    );

    return {
      filename: `${base}-life-sciences-export.zip`,
      mimeType: "application/zip",
      body,
      kind: "life_sciences_zip",
    };
  }

  throw new Error(`Unsupported subject for export: ${assessment.subject}`);
}
