"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPasswordUpdateErrorMessage } from "@/lib/auth/messages";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PasswordField } from "@/components/ui/password-field";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [noSession, setNoSession] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        setNoSession(true);
      }
      setReady(true);
    }
    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match. Type the same password twice.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setLoading(false);
      setError(getPasswordUpdateErrorMessage(updateError.message, updateError.code));
      return;
    }

    setStatus("Password updated. Opening your dashboard…");
    router.push("/dashboard");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <Card>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>Checking your reset link…</CardDescription>
          <p className="mt-6 text-lg text-muted-foreground" role="status">
            Please wait…
          </p>
        </Card>
      </div>
    );
  }

  if (noSession) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <Card>
          <CardTitle>Reset link needed</CardTitle>
          <CardDescription>
            Open the link from your email first, or request a new one. Links
            expire after a short time.
          </CardDescription>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/auth/forgot-password">
              <Button className="w-full">Request a new reset link</Button>
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex min-h-12 items-center justify-center text-lg font-semibold text-primary underline underline-offset-4"
            >
              Back to log in
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>
          Choose a password you will remember. At least 8 characters.
        </CardDescription>
        <form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit}>
          <PasswordField
            label="New password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            hint="At least 8 characters. Use Show if you want to check for typos."
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
          />
          {error ? (
            <p className="text-base text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="text-base text-foreground" role="status" aria-live="polite">
              {status}
            </p>
          ) : null}
          <Button type="submit" disabled={loading} className="w-full" aria-busy={loading}>
            {loading ? (status ?? "Saving password…") : "Save new password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
