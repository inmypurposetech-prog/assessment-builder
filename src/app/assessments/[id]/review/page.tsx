import { notFound, redirect } from "next/navigation";
import { ReviewShell } from "@/components/review/review-shell";
import { GenerateAssessmentButton } from "@/components/review/generate-assessment-button";
import type { GeneratedAssessment } from "@/lib/generation/types";
import { createClient } from "@/lib/supabase/server";
import type { AssessmentWizardData } from "@/lib/types/assessment";
import { defaultWizardData } from "@/lib/types/assessment";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function isGeneratedAssessment(value: unknown): value is GeneratedAssessment {
  if (!value || typeof value !== "object") return false;
  const v = value as GeneratedAssessment;
  return (
    v.schemaVersion === 1 &&
    Array.isArray(v.paper?.questions) &&
    Array.isArray(v.memo?.items)
  );
}

export default async function AssessmentReviewPage({
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
    redirect(`/auth/login?next=/assessments/${id}/review`);
  }

  const { data: assessment, error } = await supabase
    .from("assessments")
    .select("id, title, status, wizard_data, generated_content")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !assessment) {
    notFound();
  }

  const wizardData = {
    ...defaultWizardData,
    ...(assessment.wizard_data as Partial<AssessmentWizardData>),
  };

  if (!isGeneratedAssessment(assessment.generated_content)) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex min-h-12 items-center text-lg font-semibold text-primary underline"
        >
          Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold">{assessment.title}</h1>
        <Card>
          <CardTitle>No paper yet</CardTitle>
          <CardDescription>
            Save your wizard settings, then build a draft paper from the question
            bank. You will land here to edit questions before export.
          </CardDescription>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <GenerateAssessmentButton assessmentId={id} />
            <Link href={`/assessments/${id}/wizard`}>
              <Button variant="secondary" className="w-full sm:w-auto">
                Open wizard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ReviewShell
      assessmentId={id}
      title={assessment.title}
      initialGenerated={assessment.generated_content}
      wizardData={wizardData}
    />
  );
}
