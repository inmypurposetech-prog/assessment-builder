"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveGeneratedAssessment } from "@/lib/actions/assessments";
import {
  BLOOM_LEVEL_LABELS,
  BLOOM_LEVEL_ORDER,
  type BloomLevel,
} from "@/lib/constants/bloom-levels";
import {
  MATHS_COGNITIVE_LABELS,
  MATHS_COGNITIVE_LEVEL_ORDER,
  type MathsCognitiveLevel,
} from "@/lib/constants/cognitive-levels";
import {
  SEED_QUESTION_BANK,
  type SeedQuestion,
} from "@/lib/content/question-bank";
import {
  evaluateProudToPresent,
  recomputeGeneratedAssessment,
} from "@/lib/generation";
import type {
  AssembledMemoItem,
  AssembledQuestion,
  GeneratedAssessment,
} from "@/lib/generation/types";
import type { AssessmentWizardData } from "@/lib/types/assessment";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GenerateAssessmentButton } from "@/components/review/generate-assessment-button";

interface ReviewShellProps {
  assessmentId: string;
  title: string;
  initialGenerated: GeneratedAssessment;
  wizardData: AssessmentWizardData;
}

type EditDraft = {
  questionText: string;
  marks: number;
  cognitiveLevel?: MathsCognitiveLevel;
  bloomLevel?: BloomLevel;
  memoAnswer: string;
  markingPointsText: string;
};

function seedToAssembled(seed: SeedQuestion, number: number): AssembledQuestion {
  return {
    number,
    bankId: seed.id,
    topic: seed.topic,
    marks: seed.marks,
    difficulty: seed.difficulty,
    questionText: seed.questionText,
    cognitiveLevel: seed.cognitiveLevel,
    bloomLevel: seed.bloomLevel,
    aim: seed.aim,
    source: seed.source,
  };
}

function levelLabelForQuestion(q: AssembledQuestion): string {
  if (q.cognitiveLevel) {
    return MATHS_COGNITIVE_LABELS[q.cognitiveLevel].label;
  }
  if (q.bloomLevel) {
    return BLOOM_LEVEL_LABELS[q.bloomLevel].label;
  }
  return "Not set";
}

export function ReviewShell({
  assessmentId,
  title,
  initialGenerated,
  wizardData,
}: ReviewShellProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [draft, setDraft] = useState(initialGenerated);
  const [editingNumber, setEditingNumber] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditDraft | null>(null);
  const [replacingNumber, setReplacingNumber] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, []);

  const proud = useMemo(() => evaluateProudToPresent(draft), [draft]);

  const usedBankIds = useMemo(
    () => new Set(draft.paper.questions.map((q) => q.bankId)),
    [draft.paper.questions],
  );

  const replaceCandidates = useMemo(() => {
    return SEED_QUESTION_BANK.filter(
      (q) =>
        q.subject === draft.subject &&
        q.grade === draft.grade &&
        q.examBody === draft.examBody &&
        !usedBankIds.has(q.id),
    );
  }, [draft.subject, draft.grade, draft.examBody, usedBankIds]);

  function applyQuestions(
    questions: AssembledQuestion[],
    options?: { rederiveMemoFromBank?: boolean; memoOverrides?: AssembledMemoItem[] },
  ) {
    setDraft((prev) =>
      recomputeGeneratedAssessment(
        { ...prev, paper: { ...prev.paper, questions } },
        wizardData,
        options,
      ),
    );
    setSaveOk(false);
  }

  function startEdit(q: AssembledQuestion, memo: AssembledMemoItem | undefined) {
    setReplacingNumber(null);
    setEditingNumber(q.number);
    setEditForm({
      questionText: q.questionText,
      marks: q.marks,
      cognitiveLevel: q.cognitiveLevel,
      bloomLevel: q.bloomLevel,
      memoAnswer: memo?.memoAnswer ?? "",
      markingPointsText: (memo?.markingPoints ?? []).join("\n"),
    });
  }

  function saveEdit() {
    if (editingNumber == null || !editForm) return;
    const questions = draft.paper.questions.map((q) => {
      if (q.number !== editingNumber) return q;
      return {
        ...q,
        questionText: editForm.questionText.trim(),
        marks: Math.max(1, Math.round(Number(editForm.marks) || 1)),
        cognitiveLevel:
          draft.subject === "Mathematics" ? editForm.cognitiveLevel : undefined,
        bloomLevel:
          draft.subject === "Life Sciences" ? editForm.bloomLevel : undefined,
      };
    });

    const memoOverrides = draft.memo.items.map((item) => {
      if (item.number !== editingNumber) return item;
      return {
        ...item,
        memoAnswer: editForm.memoAnswer.trim(),
        markingPoints: editForm.markingPointsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        marks: Math.max(1, Math.round(Number(editForm.marks) || 1)),
      };
    });

    applyQuestions(questions, { memoOverrides });
    setEditingNumber(null);
    setEditForm(null);
  }

  function deleteQuestion(number: number) {
    if (
      !window.confirm(
        `Remove question ${number} from this paper? You can replace it later from the bank.`,
      )
    ) {
      return;
    }
    const questions = draft.paper.questions.filter((q) => q.number !== number);
    applyQuestions(questions, {
      memoOverrides: draft.memo.items.filter((m) => m.number !== number),
    });
    setEditingNumber(null);
    setReplacingNumber(null);
  }

  function replaceWithSeed(number: number, seed: SeedQuestion) {
    const questions = draft.paper.questions.map((q) =>
      q.number === number ? seedToAssembled(seed, number) : q,
    );
    applyQuestions(questions, { rederiveMemoFromBank: true });
    setReplacingNumber(null);
  }

  async function handleSave() {
    setSaveError(null);
    setSaveOk(false);
    setSaving(true);
    try {
      await saveGeneratedAssessment(assessmentId, draft);
      setSaveOk(true);
      setSaving(false);
    } catch {
      setSaveError(
        "We could not save your changes. Check your connection and try again.",
      );
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex min-h-12 items-center text-lg font-semibold text-primary underline"
        >
          Back to dashboard
        </Link>
      </div>

      <header>
        <p className="text-base text-muted-foreground">Review your paper</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 text-3xl font-bold outline-none"
        >
          {title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Edit, replace, or remove questions. Marks and cognitive levels update
          as you go. Export comes next.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/assessments/${assessmentId}/wizard`}>
            <Button variant="secondary">Edit wizard settings</Button>
          </Link>
          <GenerateAssessmentButton
            assessmentId={assessmentId}
            confirmOverwrite
            variant="ghost"
            label="Rebuild from bank"
            busyLabel="Rebuilding…"
          />
        </div>
      </header>

      <ProudToPresentBar ready={proud.ready} flags={proud.flags} />

      <TaxonomyTotalsPanel assessment={draft} />

      <section aria-labelledby="questions-heading" className="flex flex-col gap-4">
        <h2 id="questions-heading" className="text-2xl font-semibold">
          Questions ({draft.paper.questions.length})
        </h2>

        {draft.paper.questions.length === 0 ? (
          <Card>
            <CardTitle>No questions yet</CardTitle>
            <CardDescription>
              Rebuild from the question bank, or go back to the wizard and check
              your subject, grade, and marks.
            </CardDescription>
          </Card>
        ) : (
          draft.paper.questions.map((q) => {
            const memo = draft.memo.items.find((m) => m.number === q.number);
            const isEditing = editingNumber === q.number;
            const isReplacing = replacingNumber === q.number;

            return (
              <Card key={`${q.bankId}-${q.number}`} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">
                      Question {q.number}{" "}
                      <span className="font-normal text-muted-foreground">
                        ({q.marks} marks)
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {q.topic} · {levelLabelForQuestion(q)}
                      {memo?.cognitiveMemoCode
                        ? ` · Memo ${memo.cognitiveMemoCode}`
                        : ""}
                      {memo?.bloomShortCode
                        ? ` · Memo ${memo.bloomShortCode}`
                        : ""}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => startEdit(q, memo)}
                      disabled={isEditing}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingNumber(null);
                        setEditForm(null);
                        setReplacingNumber(isReplacing ? null : q.number);
                      }}
                    >
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => deleteQuestion(q.number)}
                      className="text-red-800"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {!isEditing ? (
                  <>
                    <p className="whitespace-pre-wrap text-lg leading-relaxed">
                      {q.questionText}
                    </p>
                    {memo ? (
                      <div className="rounded-lg border border-border bg-white/60 p-4">
                        <p className="text-base font-semibold">Marking memo</p>
                        <p className="mt-2 whitespace-pre-wrap text-base">
                          {memo.memoAnswer || (
                            <span className="text-red-700">Missing answer</span>
                          )}
                        </p>
                        {memo.markingPoints.length > 0 ? (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-base">
                            {memo.markingPoints.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-base text-red-700">
                            No marking points
                          </p>
                        )}
                      </div>
                    ) : null}
                  </>
                ) : editForm ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`q-text-${q.number}`}
                        className="text-lg font-medium"
                      >
                        Question text
                      </label>
                      <textarea
                        id={`q-text-${q.number}`}
                        rows={5}
                        value={editForm.questionText}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            questionText: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-2 border-border px-4 py-3 text-lg focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                    <Input
                      id={`q-marks-${q.number}`}
                      label="Marks"
                      type="number"
                      min={1}
                      value={editForm.marks}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          marks: Number(e.target.value),
                        })
                      }
                    />
                    {draft.subject === "Mathematics" ? (
                      <fieldset className="flex flex-col gap-2">
                        <legend className="text-lg font-medium">
                          CAPS cognitive level
                        </legend>
                        {MATHS_COGNITIVE_LEVEL_ORDER.map((level) => (
                          <label
                            key={level}
                            className="flex min-h-12 items-center gap-3 text-lg"
                          >
                            <input
                              type="radio"
                              name={`cognitive-${q.number}`}
                              checked={editForm.cognitiveLevel === level}
                              onChange={() =>
                                setEditForm({
                                  ...editForm,
                                  cognitiveLevel: level,
                                })
                              }
                              className="size-5"
                            />
                            {MATHS_COGNITIVE_LABELS[level].label}
                          </label>
                        ))}
                      </fieldset>
                    ) : (
                      <fieldset className="flex flex-col gap-2">
                        <legend className="text-lg font-medium">
                          Bloom level
                        </legend>
                        {BLOOM_LEVEL_ORDER.map((level) => (
                          <label
                            key={level}
                            className="flex min-h-12 items-center gap-3 text-lg"
                          >
                            <input
                              type="radio"
                              name={`bloom-${q.number}`}
                              checked={editForm.bloomLevel === level}
                              onChange={() =>
                                setEditForm({
                                  ...editForm,
                                  bloomLevel: level,
                                })
                              }
                              className="size-5"
                            />
                            {BLOOM_LEVEL_LABELS[level].label}
                          </label>
                        ))}
                      </fieldset>
                    )}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`memo-${q.number}`}
                        className="text-lg font-medium"
                      >
                        Memo answer
                      </label>
                      <textarea
                        id={`memo-${q.number}`}
                        rows={3}
                        value={editForm.memoAnswer}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            memoAnswer: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-2 border-border px-4 py-3 text-lg focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`points-${q.number}`}
                        className="text-lg font-medium"
                      >
                        Marking points (one per line)
                      </label>
                      <textarea
                        id={`points-${q.number}`}
                        rows={4}
                        value={editForm.markingPointsText}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            markingPointsText: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-2 border-border px-4 py-3 text-lg focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={saveEdit}>Apply changes</Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingNumber(null);
                          setEditForm(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {isReplacing ? (
                  <div className="flex flex-col gap-3 border-t border-border pt-4">
                    <p className="text-lg font-medium">
                      Choose a replacement from the bank
                    </p>
                    {replaceCandidates.length === 0 ? (
                      <p className="text-base text-muted-foreground" role="status">
                        No unused bank items match this subject, grade, and exam
                        body. Delete a question first, or rebuild the paper.
                      </p>
                    ) : (
                      <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto">
                        {replaceCandidates.map((seed) => (
                          <li key={seed.id}>
                            <button
                              type="button"
                              onClick={() => replaceWithSeed(q.number, seed)}
                              className="w-full rounded-lg border-2 border-border p-4 text-left hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <p className="text-base font-semibold">
                                {seed.topic} · {seed.marks} marks ·{" "}
                                {seed.cognitiveLevel
                                  ? MATHS_COGNITIVE_LABELS[seed.cognitiveLevel]
                                      .label
                                  : seed.bloomLevel
                                    ? BLOOM_LEVEL_LABELS[seed.bloomLevel].label
                                    : "Level?"}
                              </p>
                              <p className="mt-2 line-clamp-3 text-base text-muted-foreground">
                                {seed.questionText}
                              </p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => setReplacingNumber(null)}
                    >
                      Cancel replace
                    </Button>
                  </div>
                ) : null}
              </Card>
            );
          })
        )}
      </section>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-[var(--background)] px-4 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-muted-foreground" role="status" aria-live="polite">
            {saving
              ? "Saving…"
              : saveOk
                ? "Saved. Export will use this version."
                : "Remember to save after you edit."}
          </p>
          <Button
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
            className="w-full sm:w-auto"
          >
            {saving ? "Saving…" : "Save review"}
          </Button>
        </div>
        {saveError ? (
          <p className="mx-auto mt-2 max-w-3xl text-base text-red-700" role="alert">
            {saveError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ProudToPresentBar({
  ready,
  flags,
}: {
  ready: boolean;
  flags: ReturnType<typeof evaluateProudToPresent>["flags"];
}) {
  const blockers = flags.filter((f) => f.severity === "blocker");
  const cautions = flags.filter((f) => f.severity === "caution");

  return (
    <section
      aria-labelledby="proud-heading"
      className={`rounded-xl border-2 p-5 ${
        ready && cautions.length === 0
          ? "border-primary bg-primary/5"
          : blockers.length > 0
            ? "border-red-700 bg-red-50"
            : "border-amber-700 bg-amber-50"
      }`}
    >
      <h2 id="proud-heading" className="text-2xl font-semibold">
        {ready && cautions.length === 0
          ? "Ready to present"
          : ready
            ? "Almost ready — check cautions"
            : "Not ready to present yet"}
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Dad&apos;s bar: would you put this in front of a moderator today?
      </p>
      {flags.length === 0 ? (
        <p className="mt-3 text-lg" role="status">
          Paper marks match the memo, and nothing important is missing.
        </p>
      ) : (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg" role="list">
          {flags.map((flag) => (
            <li
              key={flag.id}
              className={
                flag.severity === "blocker" ? "text-red-900" : "text-amber-950"
              }
            >
              <span className="font-medium">
                {flag.severity === "blocker" ? "Fix: " : "Note: "}
              </span>
              {flag.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TaxonomyTotalsPanel({
  assessment,
}: {
  assessment: GeneratedAssessment;
}) {
  const { paper, memo, taxonomy } = assessment;

  return (
    <Card aria-labelledby="totals-heading">
      <CardTitle id="totals-heading">Live totals</CardTitle>
      <CardDescription>
        Marks and taxonomy update when you edit, replace, or delete.
      </CardDescription>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-base text-muted-foreground">Paper marks</dt>
          <dd className="text-2xl font-semibold">{paper.totalMarksActual}</dd>
        </div>
        <div>
          <dt className="text-base text-muted-foreground">Memo marks</dt>
          <dd className="text-2xl font-semibold">{memo.totalMarks}</dd>
        </div>
        <div>
          <dt className="text-base text-muted-foreground">Target</dt>
          <dd className="text-2xl font-semibold">{paper.totalMarksTarget}</dd>
        </div>
      </dl>

      {taxonomy.model === "caps_cognitive" ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">CAPS cognitive distribution</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {MATHS_COGNITIVE_LEVEL_ORDER.map((level) => (
              <li
                key={level}
                className="flex flex-wrap items-baseline justify-between gap-2 text-lg"
              >
                <span>{MATHS_COGNITIVE_LABELS[level].label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {taxonomy.actualMarks[level]} marks ·{" "}
                  {taxonomy.actualPercent[level]}% (target{" "}
                  {taxonomy.targetPercent[level]}%)
                </span>
              </li>
            ))}
          </ul>
          {!taxonomy.withinTolerance ? (
            <p className="mt-3 text-base text-amber-950" role="alert">
              Outside the ±5 percentage-point band — adjust questions before you
              export.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Bloom distribution</h3>
          <p className="mt-1 text-base text-muted-foreground">
            Focus: {taxonomy.focus.replaceAll("_", " ")}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {BLOOM_LEVEL_ORDER.filter(
              (level) => (taxonomy.actualMarks[level] ?? 0) > 0,
            ).map((level) => (
              <li
                key={level}
                className="flex flex-wrap items-baseline justify-between gap-2 text-lg"
              >
                <span>{BLOOM_LEVEL_LABELS[level].label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {taxonomy.actualMarks[level] ?? 0} marks
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
