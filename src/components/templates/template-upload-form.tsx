"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { uploadTemplate } from "@/lib/actions/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_PRIVATE_TEMPLATES } from "@/lib/types/template";

interface TemplateUploadFormProps {
  /** When true, show a clear “slot full” message instead of the file picker. */
  atLimit: boolean;
}

export function TemplateUploadForm({ atLimit }: TemplateUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (atLimit) {
    return (
      <p className="text-lg text-muted-foreground" role="status">
        You already have your free private template slot filled (
        {MAX_PRIVATE_TEMPLATES}). Delete it below if you want to upload a
        different pack. School sharing comes later.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-6"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setStatus(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
          setStatus("Uploading your template…");
          const result = await uploadTemplate(formData);
          if (!result.ok) {
            setError(result.error);
            setStatus(null);
            return;
          }
          formRef.current?.reset();
          setStatus("Template saved. It is private to your account.");
          router.refresh();
        });
      }}
    >
      <Input
        name="title"
        label="Template name"
        hint="For example: GDE June cover or IEB Life Sciences letterhead"
        required
        disabled={pending}
        autoComplete="off"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="template-subject" className="text-lg font-medium">
            Subject (optional)
          </label>
          <select
            id="template-subject"
            name="subject"
            disabled={pending}
            className="min-h-12 w-full rounded-lg border-2 border-border bg-white px-4 text-lg focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            defaultValue=""
          >
            <option value="">Any subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Life Sciences">Life Sciences</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="template-exam-body" className="text-lg font-medium">
            Curriculum (optional)
          </label>
          <select
            id="template-exam-body"
            name="examBody"
            disabled={pending}
            className="min-h-12 w-full rounded-lg border-2 border-border bg-white px-4 text-lg focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            defaultValue=""
          >
            <option value="">Any curriculum</option>
            <option value="DBE">DBE / CAPS</option>
            <option value="IEB">IEB</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="template-file" className="text-lg font-medium">
          Template file
        </label>
        <input
          id="template-file"
          name="file"
          type="file"
          required
          disabled={pending}
          accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
          className="min-h-12 w-full rounded-lg border-2 border-border bg-white px-4 py-3 text-lg file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-lg file:font-semibold file:text-primary"
        />
        <p id="template-file-hint" className="text-base text-muted-foreground">
          PDF, Word, or ZIP up to 10 MB. Upload your school cover or department
          pack — materials you own or are allowed to use. Do not upload learner
          names, marks, or scripts.
        </p>
      </div>

      <p className="rounded-lg border-2 border-border bg-muted/40 px-4 py-3 text-base text-muted-foreground">
        Visibility is <strong className="font-semibold text-foreground">Private</strong>{" "}
        only in this release. You keep the rights to your files; AssessMate stores
        them so you can select them when creating an assessment.
      </p>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Uploading…" : "Upload template"}
      </Button>

      {status ? (
        <p className="text-base text-primary" role="status">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="text-base text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
