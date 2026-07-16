import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/actions/assessments";
import { listTemplates } from "@/lib/actions/templates";
import { TemplateList } from "@/components/templates/template-list";
import { TemplateUploadForm } from "@/components/templates/template-upload-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { MAX_PRIVATE_TEMPLATES } from "@/lib/types/template";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/templates");
  }

  let templates: Awaited<ReturnType<typeof listTemplates>> = [];
  let loadError: string | null = null;
  try {
    templates = await listTemplates();
  } catch (err) {
    loadError =
      err instanceof Error
        ? err.message
        : "We could not load templates. Apply migration 004 in Supabase if you have not yet.";
  }

  const atLimit = templates.length >= MAX_PRIVATE_TEMPLATES;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            AssessMate
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost">
              Log out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10">
        <div>
          <Link
            href="/dashboard"
            className="text-lg font-medium text-primary underline"
          >
            Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold">My templates</h1>
          <p className="mt-3 max-w-3xl text-xl text-muted-foreground">
            Upload a school cover or department template pack. Files stay{" "}
            <strong className="font-semibold text-foreground">private</strong>{" "}
            to you. Select one when you create an assessment. Do not upload
            learner names, marks, or scripts — only educator-owned materials.
          </p>
        </div>

        {loadError ? (
          <p className="text-base text-red-700" role="alert">
            {loadError}
          </p>
        ) : null}

        <Card>
          <CardTitle>Upload a private template</CardTitle>
          <CardDescription className="mt-2">
            Free accounts: {MAX_PRIVATE_TEMPLATES} private pack. Export still
            uses AssessMate layout builders for now; your upload is stored and
            linked so we can match your format next.
          </CardDescription>
          <div className="mt-6">
            <TemplateUploadForm atLimit={atLimit} />
          </div>
        </Card>

        <section aria-labelledby="library-heading">
          <h2 id="library-heading" className="text-2xl font-semibold">
            Your private library
          </h2>
          <div className="mt-6">
            <TemplateList templates={templates} />
          </div>
        </section>
      </main>
    </div>
  );
}
