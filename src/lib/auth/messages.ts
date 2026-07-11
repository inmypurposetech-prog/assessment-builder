/**
 * Plain-language auth errors for 50s+ educators.
 * Prefer specific next steps over generic “try again”.
 */

export function getAuthErrorMessage(
  message: string,
  code?: string,
): string {
  if (code === "email_not_confirmed") {
    return "Please confirm your email first. Check your inbox (and spam) for the link from Supabase, then try logging in again.";
  }
  if (code === "invalid_credentials") {
    return "Incorrect email or password. Double-check what you used when signing up.";
  }
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Please confirm your email first. Check your inbox (and spam) for the confirmation link.";
  }
  return "We could not log you in. Check your email and password.";
}

export function getSignupErrorMessage(
  message: string,
  code?: string,
): string {
  const lower = message.toLowerCase();

  if (
    code === "user_already_exists" ||
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already exists")
  ) {
    return "This email is already registered. Try logging in, or use “Forgot password” if you need a new password.";
  }

  if (
    code === "weak_password" ||
    (lower.includes("password") &&
      (lower.includes("weak") ||
        lower.includes("short") ||
        lower.includes("least") ||
        lower.includes("characters") ||
        lower.includes("strength")))
  ) {
    return "That password is too weak. Use at least 8 characters, and mix letters and numbers if possible.";
  }

  if (
    code === "email_address_invalid" ||
    lower.includes("invalid email") ||
    lower.includes("email address") && lower.includes("invalid")
  ) {
    return "That email address does not look valid. Check for typos and try again.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    lower.includes("rate limit") ||
    lower.includes("too many requests")
  ) {
    return "Too many sign-up attempts. Wait a few minutes, then try again.";
  }

  if (code === "signup_disabled" || lower.includes("signups not allowed")) {
    return "New sign-ups are temporarily turned off. Please try again later.";
  }

  if (
    lower.includes("redirect") ||
    lower.includes("redirect_uri") ||
    lower.includes("redirect url")
  ) {
    return "Sign-up could not finish because this site’s address is not allowed yet. Ask the AssessMate admin to add this site under Supabase Auth URL settings.";
  }

  // Fall back to Supabase’s own wording when we don’t recognise the code —
  // better than a vague “try a different email or stronger password”.
  const cleaned = message.trim();
  if (cleaned.length > 0 && cleaned.length < 180) {
    return `We could not create your account: ${cleaned}`;
  }

  return "We could not create your account. Check your email and password, then try again.";
}

export function getSignupSuccessMessage(
  hasSession: boolean,
  identitiesLength: number,
): { type: "dashboard" | "confirm_email" | "error" } {
  if (hasSession) {
    return { type: "dashboard" };
  }
  // Supabase returns user but no session when email confirmation is required
  if (identitiesLength > 0) {
    return { type: "confirm_email" };
  }
  // Empty identities usually means the email is already registered
  // (Supabase avoids confirming that in the API response shape).
  return { type: "error" };
}

export function getSignupDuplicateEmailMessage(): string {
  return "This email may already be registered. Try logging in instead. If you never finished signup, check your inbox for a confirmation link.";
}
