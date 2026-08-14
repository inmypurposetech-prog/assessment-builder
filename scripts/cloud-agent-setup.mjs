/**
 * Cloud Agent per-repo setup (runs from `install` in .cursor/environment.json).
 *
 * Ensures a usable `.env.local` exists so `next dev`/`next build` can boot.
 * - If real Supabase env vars are injected (as Cloud Agent secrets), they are used.
 * - Otherwise safe placeholders are written so the app boots for UI + offline work.
 *   Auth/persistence flows require real Supabase credentials.
 *
 * Idempotent: never overwrites an existing `.env.local`.
 */
import { existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(repoRoot, ".env.local");

if (existsSync(envPath)) {
  console.log("[cloud-agent-setup] .env.local already exists — leaving it untouched.");
} else {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  const usingPlaceholders =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  writeFileSync(
    envPath,
    `NEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}\n`,
  );

  console.log(
    usingPlaceholders
      ? "[cloud-agent-setup] Wrote .env.local with placeholder Supabase values. " +
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY as secrets to enable auth/persistence."
      : "[cloud-agent-setup] Wrote .env.local from injected Supabase secrets.",
  );
}
