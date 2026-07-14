import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { MATHS_GDE_JUNE_P2_TEMPLATE_PACK } from "@/lib/content/template-packs/maths-gde-june-p2";
import {
  MATHS_COGNITIVE_LABELS,
  MATHS_COGNITIVE_LEVEL_ORDER,
} from "@/lib/constants/cognitive-levels";
import type { GeneratedAssessment, MathsTaxonomyReport } from "@/lib/generation/types";

const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: "000000",
};

const cellBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
};

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { after: 200 },
  });
}

function body(text: string, options?: { bold?: boolean; after?: number }) {
  return new Paragraph({
    spacing: { after: options?.after ?? 120 },
    children: [
      new TextRun({
        text,
        bold: options?.bold,
        size: 24, // 12pt
        font: "Times New Roman",
      }),
    ],
  });
}

function blankLine() {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: "_______________________________________________",
        size: 22,
        font: "Times New Roman",
        color: "666666",
      }),
    ],
  });
}

function coverMeta(assessment: GeneratedAssessment): Paragraph[] {
  return [
    heading(assessment.title),
    body(`Subject: ${assessment.subject}`, { bold: true }),
    body(`Grade: ${assessment.grade} · Exam body: ${assessment.examBody}`),
    body(
      `Marks: ${assessment.paper.totalMarksActual} · Duration: ${assessment.paper.durationMinutes} minutes`,
    ),
    body(`Generated: ${new Date(assessment.generatedAt).toLocaleDateString("en-ZA")}`),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
  ];
}

/** Question paper DOCX — Dad GDE-style structure (iterate toward fidelity). */
export async function buildMathsQuestionPaperDocx(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const pack = MATHS_GDE_JUNE_P2_TEMPLATE_PACK;
  const markRows = assessment.paper.questions.map(
    (q) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 4500, type: WidthType.DXA },
            children: [body(`Question ${q.number}`)],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 2000, type: WidthType.DXA },
            children: [body(`${q.marks}`, { bold: true })],
          }),
        ],
      }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...coverMeta(assessment),
          heading("Instructions", HeadingLevel.HEADING_2),
          ...pack.paperDefaults.instructions.map((line, index) =>
            body(`${index + 1}. ${line}`),
          ),
          new Paragraph({ spacing: { after: 200 }, children: [] }),
          heading("Mark allocation", HeadingLevel.HEADING_2),
          new Table({
            width: { size: 6500, type: WidthType.DXA },
            columnWidths: [4500, 2000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorders,
                    width: { size: 4500, type: WidthType.DXA },
                    children: [body("Question", { bold: true })],
                  }),
                  new TableCell({
                    borders: cellBorders,
                    width: { size: 2000, type: WidthType.DXA },
                    children: [body("Marks", { bold: true })],
                  }),
                ],
              }),
              ...markRows,
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorders,
                    width: { size: 4500, type: WidthType.DXA },
                    children: [body("TOTAL", { bold: true })],
                  }),
                  new TableCell({
                    borders: cellBorders,
                    width: { size: 2000, type: WidthType.DXA },
                    children: [
                      body(`${assessment.paper.totalMarksActual}`, { bold: true }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 300 }, children: [] }),
          heading("Questions", HeadingLevel.HEADING_2),
          ...assessment.paper.questions.flatMap((q) => [
            body(`QUESTION ${q.number}  [${q.marks} marks]`, { bold: true, after: 80 }),
            body(`Topic: ${q.topic}`, { after: 80 }),
            body(q.questionText, { after: 200 }),
          ]),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

/** Memorandum DOCX with K/R/C/P codes per Dad's conventions. */
export async function buildMathsMemoDocx(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const pack = MATHS_GDE_JUNE_P2_TEMPLATE_PACK;
  const doc = new Document({
    sections: [
      {
        children: [
          ...coverMeta(assessment),
          heading("Memorandum"),
          body("Cognitive codes: K = Knowledge, R = Routine, C = Complex, P = Problem solving", {
            after: 80,
          }),
          ...pack.memoConventions.notes.map((n) => body(`• ${n}`)),
          new Paragraph({ spacing: { after: 200 }, children: [] }),
          ...assessment.memo.items.flatMap((item) => {
            const q = assessment.paper.questions.find((x) => x.number === item.number);
            return [
              body(
                `QUESTION ${item.number}  [${item.marks}]  ${item.cognitiveMemoCode ? `(${item.cognitiveMemoCode})` : ""}`,
                { bold: true, after: 80 },
              ),
              body(item.memoAnswer || "(No memo answer yet)", { after: 80 }),
              ...item.markingPoints.map((p, i) =>
                body(`  ${i + 1}. ${p}${item.cognitiveMemoCode ? `  [${item.cognitiveMemoCode}]` : ""}`),
              ),
              ...(q?.cognitiveLevel
                ? [
                    body(
                      `Level: ${MATHS_COGNITIVE_LABELS[q.cognitiveLevel].label}`,
                      { after: 200 },
                    ),
                  ]
                : [new Paragraph({ spacing: { after: 200 }, children: [] })]),
            ];
          }),
          body(`TOTAL: ${assessment.memo.totalMarks}`, { bold: true }),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

/** Lined answer book DOCX. */
export async function buildMathsAnswerBookDocx(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const pack = MATHS_GDE_JUNE_P2_TEMPLATE_PACK;
  const doc = new Document({
    sections: [
      {
        children: [
          heading("Answer book"),
          body(assessment.title, { bold: true }),
          body("School: _______________________________"),
          body("Learner name: _________________________  Class: ________"),
          body("Teacher: ______________________________  Date: ________"),
          new Paragraph({ spacing: { after: 160 }, children: [] }),
          heading("Rules", HeadingLevel.HEADING_2),
          ...pack.answerBookConventions.notes.map((n) => body(`• ${n}`)),
          body("Write in blue ink. No correction fluid. Cross out rough work neatly."),
          new Paragraph({ spacing: { after: 200 }, children: [] }),
          heading("Honour pledge", HeadingLevel.HEADING_2),
          body(
            "I solemnly declare that I have answered this paper without help from anyone else.",
          ),
          body("Signature: _______________________  Date: ________"),
          new Paragraph({ spacing: { after: 300 }, children: [] }),
          ...assessment.paper.questions.flatMap((q) => [
            body(`QUESTION ${q.number}  [${q.marks} marks]`, { bold: true, after: 100 }),
            ...Array.from({ length: Math.min(8, Math.max(3, q.marks)) }, () =>
              blankLine(),
            ),
            body("Marks: ______ / " + q.marks, { after: 240 }),
          ]),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

/** CAPS cognitive summary sheet (not Bloom’s). */
export async function buildMathsCognitiveSummaryDocx(
  assessment: GeneratedAssessment,
): Promise<Buffer> {
  const taxonomy = assessment.taxonomy;
  if (taxonomy.model !== "caps_cognitive") {
    throw new Error("Maths cognitive summary requires CAPS taxonomy report.");
  }
  const report = taxonomy as MathsTaxonomyReport;

  const rows = MATHS_COGNITIVE_LEVEL_ORDER.map(
    (level) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 3200, type: WidthType.DXA },
            children: [body(MATHS_COGNITIVE_LABELS[level].label)],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 1400, type: WidthType.DXA },
            children: [body(`${report.targetPercent[level]}%`)],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 1400, type: WidthType.DXA },
            children: [body(`${report.actualMarks[level]}`)],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 1400, type: WidthType.DXA },
            children: [body(`${report.actualPercent[level]}%`)],
          }),
        ],
      }),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          ...coverMeta(assessment),
          heading("CAPS cognitive summary"),
          body(
            "Mathematics uses CAPS cognitive levels (Knowledge / Routine / Complex / Problem solving) — not Bloom’s taxonomy.",
            { after: 160 },
          ),
          body(
            report.withinTolerance
              ? "Distribution is within the ±5 percentage-point tolerance band."
              : "Distribution is outside the ±5 percentage-point tolerance band — review before moderation.",
            { bold: true, after: 200 },
          ),
          new Table({
            width: { size: 7400, type: WidthType.DXA },
            columnWidths: [3200, 1400, 1400, 1400],
            rows: [
              new TableRow({
                children: ["Level", "Target %", "Marks", "Actual %"].map(
                  (label) =>
                    new TableCell({
                      borders: cellBorders,
                      width: {
                        size: label === "Level" ? 3200 : 1400,
                        type: WidthType.DXA,
                      },
                      children: [body(label, { bold: true })],
                    }),
                ),
              }),
              ...rows,
            ],
          }),
          new Paragraph({ spacing: { after: 240 }, children: [] }),
          heading("Per question", HeadingLevel.HEADING_2),
          ...assessment.paper.questions.map((q) =>
            body(
              `Q${q.number}: ${q.marks} marks · ${
                q.cognitiveLevel
                  ? MATHS_COGNITIVE_LABELS[q.cognitiveLevel].label
                  : "Not set"
              } · ${q.topic}`,
            ),
          ),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 300 },
            children: [
              new TextRun({
                text: `Template pack: ${MATHS_GDE_JUNE_P2_TEMPLATE_PACK.id}`,
                size: 18,
                italics: true,
                color: "666666",
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
