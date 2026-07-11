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
  return { type: "error" };
}
