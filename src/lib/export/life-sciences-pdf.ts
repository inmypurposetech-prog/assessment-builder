import PDFDocument from "pdfkit";
import { LIFE_SCIENCES_EXPORT_DEFAULTS } from "@/lib/constants/export-formats";
import {
  BLOOM_LEVEL_LABELS,
  BLOOM_LEVEL_ORDER,
} from "@/lib/constants/bloom-levels";
import type { GeneratedAssessment } from "@/lib/generation/types";

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

/**
 * Life Sciences PDF — Arial-compatible 12pt, 1.5 spacing, lined blanks,
 * paper + memo + Bloom summary in one file (Mom moderator rules).
 */
export async function buildLifeSciencesPdf(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
      Title: assessment.title,
      Author: "AssessMate",
      Subject: "Life Sciences assessment export",
    },
  });

  const done = collectBuffer(doc);

  writeHeading(doc, assessment.title, 18);
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

  writeHeading(doc, "Question paper", 14);
  for (const q of assessment.paper.questions) {
    writeBody(
      doc,
      `QUESTION ${q.number}  [${q.marks} marks]${
        q.bloomLevel ? `  (${BLOOM_LEVEL_LABELS[q.bloomLevel].label})` : ""
      }`,
      { bold: true },
    );
    writeBody(doc, `Topic: ${q.topic}`);
    writeBody(doc, q.questionText);
    if (LIFE_SCIENCES_EXPORT_DEFAULTS.extraLinesForHandwriting) {
      writeLinedSpace(doc, Math.min(6, Math.max(2, Math.ceil(q.marks / 2))));
    }
  }

  doc.addPage();
  writeHeading(doc, "Memorandum", 16);
  writeBody(
    doc,
    "Mark according to the points below. Bloom short codes appear where available.",
  );
  for (const item of assessment.memo.items) {
    writeBody(
      doc,
      `QUESTION ${item.number}  [${item.marks}]${
        item.bloomShortCode ? `  (${item.bloomShortCode})` : ""
      }`,
      { bold: true },
    );
    writeBody(doc, item.memoAnswer || "(No memo answer yet)");
    item.markingPoints.forEach((point, i) => {
      writeBody(doc, `  ${i + 1}. ${point}`);
    });
    doc.moveDown(0.3);
  }
  writeBody(doc, `TOTAL: ${assessment.memo.totalMarks}`, { bold: true });

  doc.addPage();
  writeHeading(doc, "Bloom taxonomy summary", 16);
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
      writeBody(
        doc,
        `Q${row.number}: ${BLOOM_LEVEL_LABELS[row.bloomLevel].label}${
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

  doc.end();
  return done;
}
