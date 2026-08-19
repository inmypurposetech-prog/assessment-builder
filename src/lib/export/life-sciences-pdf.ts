import PDFDocument from "pdfkit";
import { LIFE_SCIENCES_EXPORT_DEFAULTS } from "@/lib/constants/export-formats";
import {
  BLOOM_LEVEL_LABELS,
  BLOOM_LEVEL_ORDER,
} from "@/lib/constants/bloom-levels";
import type { GeneratedAssessment } from "@/lib/generation/types";
import {
  formatMarkingGuidelineLine,
  questionLabel,
} from "@/lib/generation/question-label";

const MARGIN = 56;
const FONT_SIZE = LIFE_SCIENCES_EXPORT_DEFAULTS.fontSizePt;
/** PDF core fonts do not include Arial; Helvetica is the standard substitute for MVP. */
const FONT = "Helvetica";
const FONT_BOLD = "Helvetica-Bold";
const LINE_HEIGHT = FONT_SIZE * LIFE_SCIENCES_EXPORT_DEFAULTS.lineSpacing;

function collectBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

function createDoc(title: string, subjectLine: string): PDFKit.PDFDocument {
  return new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
      Title: title,
      Author: "AssessMate",
      Subject: subjectLine,
    },
  });
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > doc.page.height - MARGIN) {
    doc.addPage();
  }
}

function writeHeading(doc: PDFKit.PDFDocument, text: string, size = 16) {
  ensureSpace(doc, size * 2);
  doc.font(FONT_BOLD).fontSize(size).fillColor("#111111").text(text, {
    lineGap: 4,
  });
  doc.moveDown(0.4);
}

function writeBody(doc: PDFKit.PDFDocument, text: string, options?: { bold?: boolean }) {
  ensureSpace(doc, LINE_HEIGHT * 2);
  doc
    .font(options?.bold ? FONT_BOLD : FONT)
    .fontSize(FONT_SIZE)
    .fillColor("#111111")
    .text(text, {
      lineGap: LINE_HEIGHT - FONT_SIZE,
      align: "left",
    });
  doc.moveDown(0.25);
}

function writeCover(doc: PDFKit.PDFDocument, assessment: GeneratedAssessment, kind: string) {
  writeHeading(doc, assessment.title, 18);
  writeBody(doc, kind, { bold: true });
  writeBody(doc, `Subject: ${assessment.subject}`, { bold: true });
  writeBody(
    doc,
    `Grade ${assessment.grade} · ${assessment.examBody} · ${assessment.paper.totalMarksActual} marks · ${assessment.paper.durationMinutes} minutes`,
  );
  writeBody(
    doc,
    `Format: PDF · ${LIFE_SCIENCES_EXPORT_DEFAULTS.fontFamily}-compatible ${FONT_SIZE}pt · ${LIFE_SCIENCES_EXPORT_DEFAULTS.lineSpacing} line spacing`,
  );
  writeBody(
    doc,
    `Generated: ${new Date(assessment.generatedAt).toLocaleDateString("en-ZA")}`,
  );
  doc.moveDown(0.5);
}

/** Draw horizontal lines for handwriting (Mom lined-paper rule). */
function writeLinedSpace(doc: PDFKit.PDFDocument, lines: number) {
  const gap = FONT_SIZE * LIFE_SCIENCES_EXPORT_DEFAULTS.lineGap;
  for (let i = 0; i < lines; i += 1) {
    ensureSpace(doc, gap + 4);
    const y = doc.y + gap * 0.7;
    doc
      .strokeColor("#99a3ad")
      .lineWidth(0.5)
      .moveTo(MARGIN, y)
      .lineTo(doc.page.width - MARGIN, y)
      .stroke();
    doc.y = y + 2;
  }
  doc.moveDown(0.6);
}

function writeQuestionPaperBody(doc: PDFKit.PDFDocument, assessment: GeneratedAssessment) {
  let wroteSectionA = false;
  let wroteSectionB = false;

  for (const q of assessment.paper.questions) {
    const section = q.paperSection ?? (q.displayNumber?.startsWith("1.") ? "A" : "B");
    if (section === "A" && !wroteSectionA) {
      writeHeading(doc, "Section A — Question 1", 14);
      writeBody(
        doc,
        "Shorter objective items (multiple choice, terminology, matching). Number answers 1.1, 1.2, …",
      );
      wroteSectionA = true;
    }
    if (section === "B" && !wroteSectionB) {
      writeHeading(doc, "Section B — Longer questions", 14);
      wroteSectionB = true;
    }

    writeBody(
      doc,
      `${q.displayNumber?.startsWith("1.") ? "" : "QUESTION "}${questionLabel(q)}  [${q.marks} marks]${
        q.bloomLevel ? `  (${BLOOM_LEVEL_LABELS[q.bloomLevel].label})` : ""
      }`,
      { bold: true },
    );
    writeBody(doc, `Topic: ${q.topic}`);
    writeBody(doc, q.questionText);
    if (q.options && q.options.length > 0) {
      for (const option of q.options) {
        writeBody(doc, option);
      }
    }
    if (LIFE_SCIENCES_EXPORT_DEFAULTS.extraLinesForHandwriting) {
      writeLinedSpace(doc, Math.min(8, Math.max(2, Math.ceil(q.marks / 2))));
    }
  }
}

function writeMemoBody(doc: PDFKit.PDFDocument, assessment: GeneratedAssessment) {
  writeBody(
    doc,
    "Marking guideline: question then answer. Award marks beside each tick, not only at the end of the line.",
  );
  for (const item of assessment.memo.items) {
    const q = assessment.paper.questions.find((x) => x.number === item.number);
    writeBody(
      doc,
      `QUESTION ${questionLabel(item)}  [${item.marks}]${
        item.bloomShortCode ? `  (${item.bloomShortCode})` : ""
      }`,
      { bold: true },
    );
    if (q?.questionText) {
      writeBody(doc, q.questionText);
    }
    writeBody(doc, item.memoAnswer || "(No memo answer yet)", { bold: true });
    item.markingPoints.forEach((point) => {
      writeBody(
        doc,
        formatMarkingGuidelineLine(point, { bloomOrCognitiveCode: item.bloomShortCode }),
      );
    });
    doc.moveDown(0.3);
  }
  writeBody(doc, `TOTAL: ${assessment.memo.totalMarks}`, { bold: true });
}

function writeBloomBody(doc: PDFKit.PDFDocument, assessment: GeneratedAssessment) {
  writeBody(doc, assessment.title, { bold: true });
  const taxonomy = assessment.taxonomy;
  if (taxonomy.model === "bloom") {
    writeBody(doc, `Focus: ${taxonomy.focus.replaceAll("_", " ")}`);
    writeBody(
      doc,
      `Preferred levels: ${taxonomy.preferredLevels
        .map((l) => BLOOM_LEVEL_LABELS[l].label)
        .join(", ")}`,
    );
    doc.moveDown(0.3);
    writeBody(doc, "Distribution by marks:", { bold: true });
    for (const level of BLOOM_LEVEL_ORDER) {
      const marks = taxonomy.actualMarks[level] ?? 0;
      if (marks <= 0) continue;
      writeBody(doc, `${BLOOM_LEVEL_LABELS[level].label}: ${marks} marks`);
    }
    doc.moveDown(0.4);
    writeBody(doc, "Per question:", { bold: true });
    for (const row of taxonomy.perQuestion) {
      const q = assessment.paper.questions.find((item) => item.number === row.number);
      writeBody(
        doc,
        `Q${q ? questionLabel(q) : row.number}: ${BLOOM_LEVEL_LABELS[row.bloomLevel].label}${
          row.aim ? ` · AIM ${row.aim}` : ""
        }`,
      );
    }
  } else {
    writeBody(doc, "No Bloom report on this assessment.");
  }

  writeBody(
    doc,
    `Taxonomy pattern: ${LIFE_SCIENCES_EXPORT_DEFAULTS.taxonomyPatternId}`,
  );
}

export async function buildLifeSciencesQuestionPaperPdf(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const doc = createDoc(assessment.title, "Life Sciences question paper");
  const done = collectBuffer(doc);
  writeCover(doc, assessment, "Question paper");
  writeQuestionPaperBody(doc, assessment);
  doc.end();
  return done;
}

export async function buildLifeSciencesMemoPdf(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const doc = createDoc(`${assessment.title} — marking guideline`, "Life Sciences marking guideline");
  const done = collectBuffer(doc);
  writeCover(doc, assessment, "Marking guideline");
  writeMemoBody(doc, assessment);
  doc.end();
  return done;
}

export async function buildLifeSciencesBloomPdf(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const doc = createDoc(`${assessment.title} — Bloom analysis`, "Life Sciences Bloom summary");
  const done = collectBuffer(doc);
  writeCover(doc, assessment, "Bloom taxonomy analysis");
  writeBloomBody(doc, assessment);
  doc.end();
  return done;
}

/**
 * Combined PDF kept for smoke/debug. Production export uses the ZIP of three files.
 */
export async function buildLifeSciencesPdf(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const doc = createDoc(assessment.title, "Life Sciences assessment export");
  const done = collectBuffer(doc);
  writeCover(doc, assessment, "Question paper");
  writeQuestionPaperBody(doc, assessment);
  doc.addPage();
  writeHeading(doc, "Marking guideline", 16);
  writeMemoBody(doc, assessment);
  doc.addPage();
  writeHeading(doc, "Bloom taxonomy summary", 16);
  writeBloomBody(doc, assessment);
  doc.end();
  return done;
}
