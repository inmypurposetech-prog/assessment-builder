import { notFound, redirect } from "next/navigation";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { listTemplates } from "@/lib/actions/templates";
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
    .select("id, wizard_data, template_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !assessment) {
    notFound();
  }

  let templates: Awaited<ReturnType<typeof listTemplates>> = [];
  try {
    templates = await listTemplates();
  } catch {
    templates = [];
  }

  const fromWizard = assessment.wizard_data as Partial<AssessmentWizardData>;
  const templateId =
    (typeof assessment.template_id === "string"
      ? assessment.template_id
      : null) ??
    fromWizard.templateId ??
    null;

  const initialData = {
    ...defaultWizardData,
    ...fromWizard,
    templateId,
  };

  return (
    <WizardShell
      assessmentId={id}
      initialData={initialData}
      templates={templates}
    />
  );
}
