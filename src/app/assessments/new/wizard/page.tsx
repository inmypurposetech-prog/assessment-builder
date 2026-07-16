import { WizardShell } from "@/components/wizard/wizard-shell";
import { listTemplates } from "@/lib/actions/templates";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewAssessmentWizardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/assessments/new/wizard");
  }

  let templates: Awaited<ReturnType<typeof listTemplates>> = [];
  try {
    templates = await listTemplates();
  } catch {
    // Migration 004 may not be applied yet — wizard still works with defaults.
    templates = [];
  }

  return <WizardShell templates={templates} />;
}
