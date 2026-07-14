"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveAssessmentWizard } from "@/lib/actions/assessments";
import type { AssessmentWizardData } from "@/lib/types/assessment";
import { Button } from "@/components/ui/button";

interface GenerateAssessmentButtonProps {
  assessmentId?: string;
  /** When provided, save wizard data before generating (wizard finish). */
  wizardData?: AssessmentWizardData;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  /** Confirm before overwrite if content already exists */
  confirmOverwrite?: boolean;
  label?: string;
  busyLabel?: string;
  /** Called after a successful generate (before navigation). */
  onBeforeNavigate?: () => void;
}

/**
 * Saves draft (optional), calls POST /api/generate, navigates to review.
 * Keeps busy state until navigation completes (50s+ UX standard).
 */
export function GenerateAssessmentButton({
  assessmentId: existingId,
  wizardData,
  variant = "primary",
  className = "",
  disabled = false,
  confirmOverwrite = false,
  label = "Build my paper",
  busyLabel = "Building your paper…",
  onBeforeNavigate,
}: GenerateAssessmentButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (
      confirmOverwrite &&
      !window.confirm(
        "This will rebuild the paper from your wizard settings and replace the current draft. Continue?",
      )
    ) {
      return;
    }

    setError(null);
    setBusy(true);

    try {
      let assessmentId = existingId;
      if (wizardData) {
        const saved = await saveAssessmentWizard(wizardData, existingId);
        assessmentId = saved.id;
      }

      if (!assessmentId) {
        setError("Save the assessment first, then try again.");
        setBusy(false);
        return;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        code?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(
          payload.error ??
            "We could not build your paper. Check your connection and try again.",
        );
        setBusy(false);
        return;
      }

      onBeforeNavigate?.();
      router.push(`/assessments/${assessmentId}/review`);
      router.refresh();
      // Keep busy until navigation completes
    } catch {
      setError(
        "We could not build your paper. Check your connection and try again.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={variant}
        className={className}
        disabled={busy || disabled}
        aria-busy={busy}
        onClick={handleClick}
      >
        {busy ? busyLabel : label}
      </Button>
      {busy ? (
        <p className="text-base text-muted-foreground" role="status" aria-live="polite">
          {busyLabel} This usually takes a few seconds.
        </p>
      ) : null}
      {error ? (
        <p className="text-base text-red-700" role="alert">
          {error}{" "}
          <Link href="/dashboard" className="underline">
            Back to dashboard
          </Link>
        </p>
      ) : null}
    </div>
  );
}
