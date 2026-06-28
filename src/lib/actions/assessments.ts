"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildAssessmentTitle } from "@/lib/assessments/title";
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
  const payload = {
    title,
    status: "draft" as const,
    wizard_data: wizardData,
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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
