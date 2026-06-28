import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/actions/assessments";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Educator";

  const { data: assessments } = await supabase
    .from("assessments")
    .select("id, title, status, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

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
        <section>
          <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Create a new assessment or continue where you left off.
          </p>
          <div className="mt-8">
            <Link href="/assessments/new/wizard">
              <Button className="w-full sm:w-auto">+ Create assessment</Button>
            </Link>
          </div>
        </section>

        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-2xl font-semibold">
            Recent assessments
          </h2>
          {!assessments?.length ? (
            <Card className="mt-6">
              <CardTitle>No assessments yet</CardTitle>
              <CardDescription>
                Start with a cycle test for Mathematics or Life Sciences. Your
                work saves as you go through the wizard.
              </CardDescription>
            </Card>
          ) : (
            <ul className="mt-6 flex flex-col gap-4">
              {assessments.map((item) => (
                <li key={item.id}>
                  <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription>
                        {item.status === "draft" ? "Draft" : item.status} · Last
                        edited {formatDate(item.updated_at)}
                      </CardDescription>
                    </div>
                    <Link href={`/assessments/${item.id}/wizard`}>
                      <Button variant="secondary">Open</Button>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
