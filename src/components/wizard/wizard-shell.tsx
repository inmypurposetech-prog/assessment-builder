"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { saveAssessmentWizard } from "@/lib/actions/assessments";
import {
  defaultWizardData,
  type AssessmentType,
  type AssessmentWizardData,
  type BloomFocus,
  type Difficulty,
  type ExamBody,
  type ScopeMode,
  type Subject,
} from "@/lib/types/assessment";
import { BLOOM_FOCUS_OPTIONS } from "@/lib/constants/bloom-levels";
import {
  DEFAULT_MATHS_COGNITIVE,
  MATHS_COGNITIVE_LABELS,
  MATHS_COGNITIVE_LEVEL_ORDER,
  isValidMathsCognitiveDistribution,
  mathsCognitiveTotal,
  usesBloomTaxonomy,
  usesMathsCognitiveLevels,
} from "@/lib/constants/cognitive-levels";
import {
  getGradesFor,
  getSubjectsForExamBody,
  gradeOptionLabel,
  isCurriculumSupported,
} from "@/lib/constants/curriculum-matrix";
import {
  EXAM_BODY_OPTIONS,
  SUBJECT_LABELS,
  TOPICS_BY_SUBJECT,
} from "@/lib/constants/subjects";
import { GenerateAssessmentButton } from "@/components/review/generate-assessment-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "assessmate-wizard-draft";

const STEPS = [
  { id: 1, title: "Assessment type", subtitle: "What are you creating?" },
  { id: 2, title: "Curriculum", subtitle: "CAPS or IEB, subject and grade" },
  { id: 3, title: "Scope", subtitle: "Which topics or term?" },
  { id: 4, title: "Settings", subtitle: "Marks, time and difficulty" },
  { id: 5, title: "Advanced", subtitle: "Optional extras" },
] as const;

const ASSESSMENT_TYPES: {
  value: AssessmentType;
  label: string;
  description: string;
}[] = [
  {
    value: "classroom_exercise",
    label: "Class exercise",
    description: "Short practice for one lesson",
  },
  {
    value: "cycle_test",
    label: "Cycle test",
    description: "Regular test during the term",
  },
  {
    value: "assignment",
    label: "Assignment",
    description: "Take-home or extended task",
  },
  {
    value: "practical",
    label: "Practical",
    description: "Hands-on or investigation task",
  },
  {
    value: "june_exam",
    label: "June exam",
    description: "Mid-year formal assessment",
  },
  {
    value: "trial_exam",
    label: "Trial exam",
    description: "Practice exam before finals",
  },
  {
    value: "final_exam",
    label: "Final exam",
    description: "End-of-year formal paper",
  },
];

const SCOPE_OPTIONS: { value: ScopeMode; label: string; description: string }[] =
  [
    {
      value: "topics",
      label: "Pick topics",
      description: "Choose specific CAPS topics",
    },
    {
      value: "term",
      label: "Whole term",
      description: "Cover work from one term",
    },
    {
      value: "previous_paper",
      label: "Like a previous paper",
      description: "Match style of an old paper",
    },
    {
      value: "custom_mix",
      label: "Custom mix",
      description: "Combine topics your way",
    },
  ];

function normalizeWizardData(
  partial?: Partial<AssessmentWizardData> | null,
): AssessmentWizardData {
  return {
    ...defaultWizardData,
    ...partial,
    selectedTopics: partial?.selectedTopics ?? defaultWizardData.selectedTopics,
    mathsCognitive: {
      ...DEFAULT_MATHS_COGNITIVE,
      ...(partial?.mathsCognitive ?? {}),
    },
  };
}

/** Cache snapshot so useSyncExternalStore getSnapshot is referentially stable. */
let draftRaw: string | null = null;
let draftSnapshot: AssessmentWizardData = defaultWizardData;

function getDraftSnapshot(): AssessmentWizardData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === draftRaw) return draftSnapshot;
  draftRaw = raw;
  if (!raw) {
    draftSnapshot = defaultWizardData;
    return draftSnapshot;
  }
  try {
    draftSnapshot = normalizeWizardData(
      JSON.parse(raw) as Partial<AssessmentWizardData>,
    );
  } catch {
    draftSnapshot = defaultWizardData;
  }
  return draftSnapshot;
}

function persistDraft(data: AssessmentWizardData) {
  const raw = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, raw);
  draftRaw = raw;
  draftSnapshot = data;
}

function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
  draftRaw = null;
  draftSnapshot = defaultWizardData;
}

/** No cross-tab sync; empty subscribe is fine with a stable getSnapshot. */
function subscribeDraft() {
  return () => {};
}

function RadioOption({
  name,
  checked,
  onChange,
  label,
  description,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <label
      className={`flex min-h-14 cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-colors ${
        checked
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 size-5 shrink-0 accent-[#0d7377]"
      />
      <span>
        <span className="block text-lg font-semibold text-foreground">{label}</span>
        {description ? (
          <span className="mt-1 block text-base text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

interface WizardShellProps {
  assessmentId?: string;
  initialData?: AssessmentWizardData;
}

export function WizardShell({ assessmentId, initialData }: WizardShellProps) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(1);
  const localDraft = useSyncExternalStore(
    subscribeDraft,
    getDraftSnapshot,
    () => defaultWizardData,
  );
  const [draftOverride, setDraftOverride] =
    useState<AssessmentWizardData | null>(initialData ?? null);
  const data = draftOverride ?? localDraft;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [cascadeNote, setCascadeNote] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentId) return;
    persistDraft(data);
  }, [data, assessmentId]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    headingRef.current?.focus();
  }, [step]);

  const update = useCallback(
    (patch: Partial<AssessmentWizardData>) => {
      setDraftOverride((prev) =>
        normalizeWizardData({ ...(prev ?? localDraft), ...patch }),
      );
    },
    [localDraft],
  );

  const availableSubjects = useMemo(
    () => getSubjectsForExamBody(data.examBody),
    [data.examBody],
  );

  const availableGrades = useMemo(
    () => getGradesFor(data.examBody, data.subject),
    [data.examBody, data.subject],
  );

  const selectExamBody = (examBody: ExamBody) => {
    const subjects = getSubjectsForExamBody(examBody);
    const subjectOk = data.subject !== null && subjects.includes(data.subject);
    const nextSubject = subjectOk ? data.subject : null;
    const grades = getGradesFor(examBody, nextSubject);
    const gradeOk = data.grade !== null && grades.includes(data.grade);
    const cleared: string[] = [];
    if (data.subject && !subjectOk) cleared.push("subject");
    if (data.grade && !gradeOk) cleared.push("grade");
    setCascadeNote(
      cleared.length > 0
        ? `We cleared your ${cleared.join(" and ")} because it is not available for that curriculum. Choose again below.`
        : null,
    );
    update({
      examBody,
      subject: nextSubject,
      grade: gradeOk ? data.grade : null,
      selectedTopics: subjectOk ? data.selectedTopics : [],
      mathsCognitive: { ...DEFAULT_MATHS_COGNITIVE },
    });
  };

  const selectSubject = (subject: Subject) => {
    const grades = getGradesFor(data.examBody, subject);
    const gradeOk = data.grade !== null && grades.includes(data.grade);
    setCascadeNote(
      data.grade && !gradeOk
        ? "We cleared your grade because it is not available for that subject. Choose a grade again."
        : null,
    );
    update({
      subject,
      grade: gradeOk ? data.grade : null,
      selectedTopics: [],
      mathsCognitive: { ...DEFAULT_MATHS_COGNITIVE },
    });
  };

  const topics = useMemo(() => {
    if (!data.subject) return [];
    return TOPICS_BY_SUBJECT[data.subject];
  }, [data.subject]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        return data.assessmentType !== null;
      case 2:
        return (
          data.examBody !== null &&
          data.subject !== null &&
          data.grade !== null &&
          data.term !== null &&
          isCurriculumSupported(data.examBody, data.subject, data.grade)
        );
      case 3:
        if (!data.scopeMode) return false;
        if (data.scopeMode === "topics" || data.scopeMode === "custom_mix") {
          return data.selectedTopics.length > 0;
        }
        if (data.scopeMode === "previous_paper") {
          return data.previousPaperRef.trim().length > 0;
        }
        return true;
      case 4:
        return data.totalMarks > 0 && data.durationMinutes > 0;
      default:
        return true;
    }
  }, [step, data]);

  const mathsTotalValid =
    !usesMathsCognitiveLevels(data.subject) ||
    isValidMathsCognitiveDistribution(data.mathsCognitive);

  const toggleTopic = (topic: string) => {
    update({
      selectedTopics: data.selectedTopics.includes(topic)
        ? data.selectedTopics.filter((t) => t !== topic)
        : [...data.selectedTopics, topic],
    });
  };

  const current = STEPS[step - 1];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex min-h-12 items-center text-lg font-semibold text-primary underline underline-offset-4"
        >
          Back to dashboard
        </Link>
        <p className="mt-4 text-base text-muted-foreground">
          Step {step} of {STEPS.length}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 text-3xl font-bold text-foreground outline-none"
        >
          {current.title}
        </h1>
        <p className="mt-2 text-xl text-muted-foreground">{current.subtitle}</p>
        <p className="mt-2 text-base text-muted-foreground">
          {assessmentId
            ? "Your changes save when you finish this wizard."
            : "Your answers save automatically on this device until you finish."}
        </p>
      </div>

      <Card>
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <CardTitle>Choose assessment type</CardTitle>
            <CardDescription>One choice per screen keeps things simple.</CardDescription>
            <div className="mt-4 flex flex-col gap-3" role="radiogroup" aria-label="Assessment type">
              {ASSESSMENT_TYPES.map((opt) => (
                <RadioOption
                  key={opt.value}
                  name="assessmentType"
                  checked={data.assessmentType === opt.value}
                  onChange={() => update({ assessmentType: opt.value })}
                  label={opt.label}
                  description={opt.description}
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            {cascadeNote ? (
              <p className="rounded-lg border border-border bg-muted px-4 py-3 text-base text-foreground" role="status">
                {cascadeNote}
              </p>
            ) : null}
            <div>
              <CardTitle>Exam body</CardTitle>
              <div className="mt-4 flex flex-col gap-3">
                {EXAM_BODY_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt.value}
                    name="examBody"
                    checked={data.examBody === opt.value}
                    onChange={() => selectExamBody(opt.value as ExamBody)}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>
            <div>
              <CardTitle>Subject</CardTitle>
              {!data.examBody ? (
                <p className="mt-4 text-base text-muted-foreground">
                  Choose an exam body first.
                </p>
              ) : availableSubjects.length === 0 ? (
                <p className="mt-4 text-base text-muted-foreground" role="status">
                  No subjects are available for this curriculum in AssessMate yet.
                  Choose a different exam body.
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {availableSubjects.map((subject) => (
                    <RadioOption
                      key={subject}
                      name="subject"
                      checked={data.subject === subject}
                      onChange={() => selectSubject(subject)}
                      label={SUBJECT_LABELS[subject]}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <CardTitle>Grade</CardTitle>
              {!data.subject ? (
                <p className="mt-4 text-base text-muted-foreground">
                  Choose a subject first.
                </p>
              ) : availableGrades.length === 0 ? (
                <p className="mt-4 text-base text-muted-foreground" role="status">
                  No grades are available for this subject and curriculum yet.
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {availableGrades.map((grade) => (
                    <RadioOption
                      key={grade}
                      name="grade"
                      checked={data.grade === grade}
                      onChange={() => {
                        setCascadeNote(null);
                        update({ grade });
                      }}
                      label={gradeOptionLabel(grade)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <CardTitle>Term</CardTitle>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(["1", "2", "3", "4"] as const).map((term) => (
                  <RadioOption
                    key={term}
                    name="term"
                    checked={data.term === term}
                    onChange={() => update({ term })}
                    label={`Term ${term}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <CardTitle>What should the paper cover?</CardTitle>
            <div className="flex flex-col gap-3">
              {SCOPE_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt.value}
                  name="scopeMode"
                  checked={data.scopeMode === opt.value}
                  onChange={() => update({ scopeMode: opt.value as ScopeMode })}
                  label={opt.label}
                  description={opt.description}
                />
              ))}
            </div>

            {(data.scopeMode === "topics" || data.scopeMode === "custom_mix") && (
              <div>
                <p className="text-lg font-medium">Select topics</p>
                {!data.subject ? (
                  <p className="mt-2 text-base text-muted-foreground">
                    Choose a subject in the previous step first.
                  </p>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    {topics.map((topic) => (
                      <label
                        key={topic}
                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border px-4"
                      >
                        <input
                          type="checkbox"
                          checked={data.selectedTopics.includes(topic)}
                          onChange={() => toggleTopic(topic)}
                          className="size-5 accent-[#0d7377]"
                        />
                        <span className="text-lg">{topic}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {data.scopeMode === "previous_paper" && (
              <Input
                label="Previous paper reference"
                hint="For example: 2023 Grade 11 June Paper 1"
                value={data.previousPaperRef}
                onChange={(e) => update({ previousPaperRef: e.target.value })}
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            <CardTitle>Paper settings</CardTitle>
            <Input
              label="Total marks"
              type="number"
              min={1}
              value={String(data.totalMarks)}
              onChange={(e) =>
                update({ totalMarks: Number(e.target.value) || 0 })
              }
            />
            <Input
              label="Duration (minutes)"
              type="number"
              min={1}
              value={String(data.durationMinutes)}
              onChange={(e) =>
                update({ durationMinutes: Number(e.target.value) || 0 })
              }
            />
            <div>
              <p className="text-lg font-medium">Difficulty</p>
              <div className="mt-3 flex flex-col gap-3">
                {(
                  [
                    { value: "easy", label: "Easier", description: "More accessible questions" },
                    { value: "balanced", label: "Balanced", description: "Mix of levels" },
                    { value: "challenging", label: "Challenging", description: "Stretch learners" },
                  ] as const
                ).map((opt) => (
                  <RadioOption
                    key={opt.value}
                    name="difficulty"
                    checked={data.difficulty === opt.value}
                    onChange={() => update({ difficulty: opt.value as Difficulty })}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-6">
            <CardTitle>Advanced options</CardTitle>
            <CardDescription>
              These are optional. Defaults match what your parents use in their departments.
            </CardDescription>

            {usesMathsCognitiveLevels(data.subject) && (
              <div>
                <p className="text-lg font-medium">Cognitive levels (Mathematics)</p>
                <p className="mt-1 text-base text-muted-foreground">
                  CAPS uses Knowledge, Routine procedure, Complex procedure and Problem
                  solving — not Bloom&apos;s taxonomy. Copy follows the department cognitive
                  guide. Percentages must add up to 100%.
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  {MATHS_COGNITIVE_LEVEL_ORDER.map((level) => (
                    <div
                      key={level}
                      className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
                    >
                      <div className="sm:w-64">
                        <span className="text-lg font-medium">
                          {MATHS_COGNITIVE_LABELS[level].label}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {MATHS_COGNITIVE_LABELS[level].description}
                        </span>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {MATHS_COGNITIVE_LABELS[level].guideBullets.slice(0, 2).map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.mathsCognitive[level]}
                          onChange={(e) =>
                            update({
                              mathsCognitive: {
                                ...data.mathsCognitive,
                                [level]: Number(e.target.value) || 0,
                              },
                            })
                          }
                          className="min-h-12 w-24 rounded-lg border-2 border-border px-3 text-lg"
                          aria-label={`${MATHS_COGNITIVE_LABELS[level].label} percentage`}
                        />
                        <span className="text-lg">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p
                  className={`mt-3 text-base ${
                    isValidMathsCognitiveDistribution(data.mathsCognitive)
                      ? "text-primary"
                      : "text-red-700"
                  }`}
                  role={
                    isValidMathsCognitiveDistribution(data.mathsCognitive) ? undefined : "alert"
                  }
                >
                  Total: {mathsCognitiveTotal(data.mathsCognitive)}%
                  {!isValidMathsCognitiveDistribution(data.mathsCognitive)
                    ? " — must equal 100% (whole numbers only)"
                    : ""}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3"
                  onClick={() =>
                    update({ mathsCognitive: { ...DEFAULT_MATHS_COGNITIVE } })
                  }
                >
                  Reset to department standard (20 / 35 / 30 / 15)
                </Button>
              </div>
            )}

            {usesBloomTaxonomy(data.subject) && (
              <div>
                <p className="text-lg font-medium">Bloom&apos;s taxonomy focus (Life Sciences)</p>
                <p className="mt-1 text-base text-muted-foreground">
                  Pattern matches IEB analysis grids (Knowledge through Evaluation, plus AIM
                  columns). Choose a focus for this paper; detailed Bloom reports come at export.
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {BLOOM_FOCUS_OPTIONS.map((opt) => (
                    <RadioOption
                      key={opt.value}
                      name="bloomFocus"
                      checked={data.bloomFocus === opt.value}
                      onChange={() => update({ bloomFocus: opt.value as BloomFocus })}
                      label={opt.label}
                      description={opt.description}
                    />
                  ))}
                </div>
              </div>
            )}

            {!data.subject && (
              <p className="text-base text-muted-foreground">
                Choose a subject in step 2 to see cognitive level options.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {(
                [
                  { key: "includeMcq" as const, label: "Include multiple choice questions" },
                  { key: "includeCalculator" as const, label: "Allow calculator where appropriate" },
                  {
                    key: "includeDiagrams" as const,
                    label: usesBloomTaxonomy(data.subject)
                      ? "Include diagrams (Life Sciences — high priority)"
                      : "Include diagrams where helpful",
                  },
                  { key: "avoidRepeatedQuestions" as const, label: "Avoid repeating recent questions" },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border px-4"
                >
                  <input
                    type="checkbox"
                    checked={data[item.key]}
                    onChange={(e) => update({ [item.key]: e.target.checked })}
                    className="size-5 accent-[#0d7377]"
                  />
                  <span className="text-lg">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="wizard-notes" className="text-lg font-medium">
                Notes for the generator (optional)
              </label>
              <textarea
                id="wizard-notes"
                rows={4}
                value={data.notes}
                onChange={(e) => update({ notes: e.target.value })}
                className="min-h-[6rem] w-full rounded-lg border-2 border-border px-4 py-3 text-lg focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                placeholder="For example: include a marking memo section"
              />
            </div>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="secondary"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          Previous
        </Button>
        {step < STEPS.length ? (
          <Button disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <div className="flex w-full flex-col gap-3 sm:items-end">
            <GenerateAssessmentButton
              assessmentId={assessmentId}
              wizardData={data}
              className="w-full sm:w-auto"
              disabled={!canContinue || !mathsTotalValid}
              label="Build my paper"
              busyLabel="Building your paper…"
              onBeforeNavigate={() => {
                if (!assessmentId) clearDraft();
              }}
            />
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={
                !canContinue || saving || (step === STEPS.length && !mathsTotalValid)
              }
              onClick={async () => {
                setSaveError(null);
                setSaving(true);
                try {
                  await saveAssessmentWizard(data, assessmentId);
                  if (!assessmentId) {
                    clearDraft();
                  }
                  router.push("/dashboard");
                  router.refresh();
                  // Keep saving=true until navigation completes
                } catch {
                  setSaveError(
                    "We could not save your assessment. Check your connection and try again.",
                  );
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving…" : "Save and finish for now"}
            </Button>
          </div>
        )}
      </div>
      {saveError ? (
        <p className="text-base text-red-700" role="alert">
          {saveError}
        </p>
      ) : null}
    </div>
  );
}
