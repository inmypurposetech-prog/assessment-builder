"use client";

import { useState } from "react";
import { saveGeneratedAssessment } from "@/lib/actions/assessments";
import type { GeneratedAssessment } from "@/lib/generation/types";
import { Button } from "@/components/ui/button";

interface ExportDownloadButtonProps {
  assessmentId: string;
  /** Current review draft — saved before export so the file matches the screen. */
  draft: GeneratedAssessment;
  subject: GeneratedAssessment["subject"];
  disabled?: boolean;
  className?: string;
  onExported?: () => void;
  onSaveOk?: () => void;
}

function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const match = /filename="([^"]+)"/i.exec(header);
  return match?.[1] ?? fallback;
}

/**
 * Saves the review draft, then downloads Maths ZIP (DOCX pack) or LS PDF.
 * Busy until the file download starts (50s+ UX).
 */
export function ExportDownloadButton({
  assessmentId,
  draft,
  subject,
  disabled = false,
  className = "",
  onExported,
  onSaveOk,
}: ExportDownloadButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMessage, setOkMessage] = useState<string | null>(null);

  const label =
    subject === "Mathematics"
      ? "Download Maths pack (DOCX ZIP)"
      : "Download Life Sciences PDF";
  const busyLabel =
    subject === "Mathematics"
      ? "Preparing Maths pack…"
      : "Preparing PDF…";

  async function handleClick() {
    setError(null);
    setOkMessage(null);
    setBusy(true);

    try {
      await saveGeneratedAssessment(assessmentId, draft);
      onSaveOk?.();

      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      });

      const contentType = response.headers.get("Content-Type") ?? "";

      if (!response.ok) {
        let message =
          "We could not prepare your download. Check your connection and try again.";
        if (contentType.includes("application/json")) {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) message = payload.error;
        }
        setError(message);
        setBusy(false);
        return;
      }

      const blob = await response.blob();
      const fallbackName =
        subject === "Mathematics"
          ? "assessmate-maths-export.zip"
          : "assessmate-life-sciences.pdf";
      const filename = filenameFromDisposition(
        response.headers.get("Content-Disposition"),
        fallbackName,
      );

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setOkMessage(
        subject === "Mathematics"
          ? "Download started — ZIP with question paper, memo, answer book, and cognitive summary."
          : "Download started — PDF with paper, memo, and Bloom summary (Arial-style 12pt, 1.5 spacing).",
      );
      onExported?.();
      setBusy(false);
    } catch {
      setError(
        "We could not prepare your download. Check your connection and try again.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="primary"
        className={className}
        disabled={busy || disabled}
        aria-busy={busy}
        onClick={handleClick}
      >
        {busy ? busyLabel : label}
      </Button>
      {busy ? (
        <p className="text-base text-muted-foreground" role="status" aria-live="polite">
          Saving your latest edits, then building the file. Please wait…
        </p>
      ) : null}
      {okMessage ? (
        <p className="text-base text-foreground" role="status" aria-live="polite">
          {okMessage}
        </p>
      ) : null}
      {error ? (
        <p className="text-base text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
