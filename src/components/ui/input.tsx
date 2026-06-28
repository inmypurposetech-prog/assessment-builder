import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", label, hint, error, id, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-lg font-medium text-foreground">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`min-h-12 w-full rounded-lg border-2 border-border bg-white px-4 text-lg text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${error ? "border-red-600" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? `${inputId}-desc` : undefined}
        {...props}
      />
      {hint && !error ? (
        <p id={`${inputId}-desc`} className="text-base text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-desc`} className="text-base text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
