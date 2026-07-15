"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getSignupDuplicateEmailMessage,
  getSignupErrorMessage,
  getSignupSuccessMessage,
} from "@/lib/auth/messages";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/ui/password-field";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [confirmEmailMessage, setConfirmEmailMessage] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setConfirmEmailMessage(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          school: school || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(getSignupErrorMessage(signUpError.message, signUpError.code));
      return;
    }

    const outcome = getSignupSuccessMessage(
      Boolean(data.session),
      data.user?.identities?.length ?? 0,
    );

    if (outcome.type === "confirm_email") {
      setLoading(false);
      setConfirmEmailMessage(
        `Account created. We sent a confirmation link to ${email}. Open it, then log in.`,
      );
      return;
    }

    if (outcome.type === "dashboard") {
      setStatus("Opening your dashboard…");
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setLoading(false);
    setError(getSignupDuplicateEmailMessage());
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Free for educators. Tell us your name so we can greet you on your dashboard.
        </CardDescription>
        {confirmEmailMessage ? (
          <div className="mt-8 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
            <p className="text-lg text-foreground">{confirmEmailMessage}</p>
            <Link
              href="/auth/login"
              className="mt-4 inline-block text-lg font-semibold text-primary underline underline-offset-4"
            >
              Go to log in
            </Link>
          </div>
        ) : (
          <form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit}>
            <Input
              label="Full name"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
            <Input
              label="School (optional)"
              hint="Helps us tailor examples later."
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <PasswordField
              label="Password"
              autoComplete="new-password"
              required
              minLength={8}
              hint="At least 8 characters. Use Show if you want to check for typos."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? (status ?? "Creating account…") : "Create account"}
            </Button>
          </form>
        )}
        <p className="mt-6 text-lg">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
