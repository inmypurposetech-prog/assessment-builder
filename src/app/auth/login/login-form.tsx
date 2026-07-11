"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/messages";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setLoading(false);
      setError(getAuthErrorMessage(signInError.message, signInError.code));
      return;
    }
    setStatus("Opening your dashboard…");
    router.push(next);
    router.refresh();
    // Keep loading=true until the next page paints
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Use the email and password you signed up with.
        </CardDescription>
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
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
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
            {loading ? (status ?? "Logging in…") : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-lg">
          New here?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
