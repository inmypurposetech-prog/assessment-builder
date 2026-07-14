import { NextResponse } from "next/server";
import { SEED_QUESTION_BANK } from "@/lib/content/question-bank";
import {
  assembleAssessment,
  assertUnderMonthlyCap,
  fillGapsWithAi,
  getGenerationCostConfig,
  generateRequestSchema,
  recordGenerationUsage,
  shouldAttemptAiGapFill,
  type GenerationCostMeta,
} from "@/lib/generation";
import { createClient } from "@/lib/supabase/server";
import type { AssessmentWizardData } from "@/lib/types/assessment";
import { defaultWizardData } from "@/lib/types/assessment";

function mergeWizard(raw: unknown): AssessmentWizardData {
  if (!raw || typeof raw !== "object") return { ...defaultWizardData };
  return { ...defaultWizardData, ...(raw as AssessmentWizardData) };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { assessmentId, dryRun } = parsed.data;
  const costConfig = getGenerationCostConfig();

  let monthlyUsed = 0;
  try {
    const cap = await assertUnderMonthlyCap(supabase, user.id);
    monthlyUsed = cap.used;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation blocked.";
    const code = err instanceof Error ? (err as Error & { code?: string }).code : undefined;
    if (code === "MONTHLY_CAP") {
      return NextResponse.json(
        {
          error: message,
          code: "MONTHLY_CAP",
          monthlyCap: costConfig.monthlyCap,
        },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: assessment, error: loadError } = await supabase
    .from("assessments")
    .select("id, title, wizard_data, user_id")
    .eq("id", assessmentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  const wizard = mergeWizard(assessment.wizard_data);
  if (!wizard.subject || !wizard.grade || !wizard.examBody) {
    return NextResponse.json(
      {
        error:
          "Finish curriculum steps in the wizard (exam body, subject, grade) before generating.",
      },
      { status: 400 },
    );
  }

  // Preliminary assemble to measure shortfall for optional AI gap-fill
  const preliminaryCost: GenerationCostMeta = {
    model: costConfig.model,
    maxTokens: costConfig.maxTokens,
    tokensUsed: 0,
    source: "question_bank",
    monthlyUsed,
    monthlyCap: costConfig.monthlyCap,
    aiGapFillAttempted: false,
  };

  let generated = assembleAssessment({
    assessmentId: assessment.id,
    title: assessment.title,
    wizard,
    bank: SEED_QUESTION_BANK,
    cost: preliminaryCost,
  });

  const shortfall = Math.max(
    0,
    generated.paper.totalMarksTarget - generated.paper.totalMarksActual,
  );

  let tokensUsed = 0;
  let aiAttempted = false;
  let source: GenerationCostMeta["source"] = "question_bank";

  if (shouldAttemptAiGapFill(costConfig) && shortfall > 0) {
    const gaps = generated.warnings.filter((w) =>
      w.toLowerCase().includes("shortfall"),
    );
    const ai = await fillGapsWithAi({
      wizard,
      shortfallMarks: shortfall,
      gaps: gaps.length > 0 ? gaps : [`Need ${shortfall} more marks`],
      config: costConfig,
    });
    aiAttempted = ai.attempted;
    tokensUsed = ai.tokensUsed;
    if (ai.questions.length > 0) {
      source = "question_bank+ai_gaps";
      generated = assembleAssessment({
        assessmentId: assessment.id,
        title: assessment.title,
        wizard,
        bank: SEED_QUESTION_BANK,
        aiFilled: ai.questions,
        cost: {
          ...preliminaryCost,
          tokensUsed,
          source,
          aiGapFillAttempted: aiAttempted,
        },
      });
    } else if (aiAttempted) {
      generated.warnings.push(
        "AI gap-fill is configured but not yet returning items — paper uses bank only.",
      );
    }
  }

  generated = {
    ...generated,
    cost: {
      model: costConfig.model,
      maxTokens: costConfig.maxTokens,
      tokensUsed,
      source,
      monthlyUsed: dryRun ? monthlyUsed : monthlyUsed + 1,
      monthlyCap: costConfig.monthlyCap,
      aiGapFillAttempted: aiAttempted,
    },
  };

  if (!dryRun) {
    const { error: updateError } = await supabase
      .from("assessments")
      .update({
        status: "generated",
        generated_content: generated,
        generated_at: generated.generatedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        {
          error: `Could not save generated content: ${updateError.message}. Run migration 003 if columns are missing.`,
        },
        { status: 500 },
      );
    }

    try {
      await recordGenerationUsage(supabase, {
        userId: user.id,
        assessmentId,
        model: costConfig.model,
        tokensUsed,
        source,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Usage record failed.";
      return NextResponse.json(
        {
          error: `${message} Generation JSON was saved; fix generation_usage / migration 003.`,
          assessment: generated,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun: Boolean(dryRun),
    assessment: generated,
  });
}
