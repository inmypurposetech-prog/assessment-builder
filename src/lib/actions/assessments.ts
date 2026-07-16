"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildAssessmentTitle } from "@/lib/assessments/title";
import type { GeneratedAssessment } from "@/lib/generation/types";
import { createClient } from "@/lib/supabase/server";
import type { AssessmentWizardData } from "@/lib/types/assessment";

export async function saveAssessmentWizard(
  wizardData: AssessmentWizardData,
  assessmentId?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/assessments/new/wizard");
  }

  const title = buildAssessmentTitle(wizardData);
  let templateId = wizardData.templateId?.trim() || null;

  if (templateId) {
    const { data: ownedTemplate, error: templateError } = await supabase
      .from("templates")
      .select("id")
      .eq("id", templateId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (templateError) throw new Error(templateError.message);
    if (!ownedTemplate) {
      templateId = null;
    }
  }

  const payload = {
    title,
    status: "draft" as const,
    wizard_data: { ...wizardData, templateId },
    template_id: templateId,
    updated_at: new Date().toISOString(),
  };

  if (assessmentId) {
    const { error } = await supabase
      .from("assessments")
      .update(payload)
      .eq("id", assessmentId)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
    revalidatePath(`/assessments/${assessmentId}/wizard`);
    return { id: assessmentId };
  }

  const { data, error } = await supabase
    .from("assessments")
    .insert({ ...payload, user_id: user.id })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  return { id: data.id as string };
}

/** Persist teacher edits on a generated paper (Phase 1C review). */
export async function saveGeneratedAssessment(
  assessmentId: string,
  generated: GeneratedAssessment,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/assessments/${assessmentId}/review`);
  }

  const { error } = await supabase
    .from("assessments")
    .update({
      generated_content: generated,
      status: "generated",
      updated_at: new Date().toISOString(),
    })
    .eq("id", assessmentId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath(`/assessments/${assessmentId}/review`);
  return { id: assessmentId };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
