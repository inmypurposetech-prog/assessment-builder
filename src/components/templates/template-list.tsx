"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTemplate } from "@/lib/actions/templates";
import { Button } from "@/components/ui/button";
import type { TemplateRecord } from "@/lib/types/template";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function TemplateList({ templates }: { templates: TemplateRecord[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (templates.length === 0) {
    return (
      <p className="text-lg text-muted-foreground">
        No private templates yet. Upload one above, or keep using AssessMate
        defaults when you create an assessment.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {templates.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-4 rounded-lg border-2 border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xl font-semibold">{item.title}</p>
            <p className="mt-1 text-base text-muted-foreground">
              Private
              {item.subject ? ` · ${item.subject}` : ""}
              {item.examBody ? ` · ${item.examBody}` : ""}
              {item.originalFilename ? ` · ${item.originalFilename}` : ""}
              {" · "}
              Uploaded {formatDate(item.createdAt)}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={pending && pendingId === item.id}
            onClick={() => {
              const confirmed = window.confirm(
                `Delete “${item.title}”? This removes the file from your private library. Assessments that used it will fall back to AssessMate defaults.`,
              );
              if (!confirmed) return;
              setError(null);
              setPendingId(item.id);
              startTransition(async () => {
                const result = await deleteTemplate(item.id);
                setPendingId(null);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              });
            }}
          >
            {pending && pendingId === item.id ? "Deleting…" : "Delete"}
          </Button>
        </li>
      ))}
      {error ? (
        <li>
          <p className="text-base text-red-700" role="alert">
            {error}
          </p>
        </li>
      ) : null}
    </ul>
  );
}
