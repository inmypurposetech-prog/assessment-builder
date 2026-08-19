import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <p>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center text-lg font-semibold text-primary underline underline-offset-4"
        >
          Back to home
        </Link>
      </p>
      <h1 className="text-4xl font-bold">Privacy (draft)</h1>
      <p className="text-lg text-muted-foreground">
        This is a parent-pilot draft, not legal advice. We will publish a full
        policy before public launch.
      </p>
      <section className="flex flex-col gap-3 text-lg leading-relaxed">
        <h2 className="text-2xl font-semibold">What we store</h2>
        <p>
          Educator account details (email, optional name and school) and the
          assessments, templates, and generated papers you create. We do{" "}
          <strong>not</strong> want learner names, marks, or other learner
          personal information in AssessMate during this pilot.
        </p>
        <h2 className="text-2xl font-semibold">Where it is hosted</h2>
        <p>
          The app is hosted on Vercel. The database and file storage use
          Supabase (Postgres in a European region). Generation usage is logged
          so we can cap monthly AI cost.
        </p>
        <h2 className="text-2xl font-semibold">Your control</h2>
        <p>
          You stay in control of generated text — always editable. Private
          templates stay visible only to you. Do not upload past papers for
          republication, and do not paste learner-identifying scripts into notes.
        </p>
        <h2 className="text-2xl font-semibold">Questions</h2>
        <p>
          Ask Tanielle if you want an account removed during the parent pilot.
          A self-serve delete path ships before we invite other educators.
        </p>
      </section>
    </div>
  );
}
