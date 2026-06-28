import { notFound, redirect } from "next/navigation";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { createClient } from "@/lib/supabase/server";
import type { AssessmentWizardData } from "@/lib/types/assessment";
import { defaultWizardData } from "@/lib/types/assessment";

export default async function EditAssessmentWizardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/assessments/${id}/wizard`);
  }

  const { data: assessment, error } = await supabase
    .from("assessments")
    .select("id, wizard_data")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !assessment) {
    notFound();
  }

  const initialData = {
    ...defaultWizardData,
    ...(assessment.wizard_data as Partial<AssessmentWizardData>),
  };

  return <WizardShell assessmentId={id} initialData={initialData} />;
}
