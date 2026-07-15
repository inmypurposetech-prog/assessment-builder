"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPasswordResetRequestMessage } from "@/lib/auth/messages";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo },
    );

    setLoading(false);

    if (resetError) {
      setError(getPasswordResetRequestMessage(resetError.message, resetError.code));
      return;
    }

    // Same success copy whether or not the email exists (avoid account enumeration).
    setSent(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter the email you signed up with. If we have an account for it, we
          will send a link to choose a new password.
        </CardDescription>

        {sent ? (
          <div className="mt-8 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
            <p className="text-lg text-foreground" role="status">
              If an account exists for <strong>{email.trim()}</strong>, check
              that inbox (and spam) for a reset link. The link opens a page where
              you set a new password.
            </p>
            <Link
              href="/auth/login"
              className="mt-4 inline-flex min-h-12 items-center text-lg font-semibold text-primary underline underline-offset-4"
            >
              Back to log in
            </Link>
          </div>
        ) : (
          <form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error ? (
              <p className="text-base text-red-700" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              aria-busy={loading}
            >
              {loading ? "Sending link…" : "Send reset link"}
            </Button>
          </form>
        )}

        {!sent ? (
          <p className="mt-6 text-lg">
            Remembered it?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        ) : null}
      </Card>
    </div>
  );
}
