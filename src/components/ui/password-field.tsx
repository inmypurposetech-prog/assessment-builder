"use client";

import { type InputHTMLAttributes, forwardRef, useId, useState } from "react";

export interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  error?: string;
}

/**
 * Password input with Show/Hide — WCAG-friendly (visible affordance, not hover-only).
 * WCAG 2.2 supports password visibility for accessible authentication (G211).
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { className = "", label, hint, error, id, disabled, ...props },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? `password-${autoId}`;
    const [visible, setVisible] = useState(false);
    const descId = hint || error ? `${inputId}-desc` : undefined;

    return (
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={inputId} className="text-lg font-medium text-foreground">
          {label}
        </label>
        <div className="flex gap-2">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            disabled={disabled}
            className={`min-h-12 w-full flex-1 rounded-lg border-2 border-border bg-white px-4 text-lg text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 ${error ? "border-red-600" : ""} ${className}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={descId}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            aria-pressed={visible}
            aria-controls={inputId}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg border-2 border-primary px-4 text-lg font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
        {hint && !error ? (
          <p id={descId} className="text-base text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={descId} className="text-base text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
