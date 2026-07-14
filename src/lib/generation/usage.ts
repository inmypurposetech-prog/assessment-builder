import type { SupabaseClient } from "@supabase/supabase-js";
import { getGenerationCostConfig } from "@/lib/generation/config";

export async function countGenerationsThisMonth(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("generation_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", start.toISOString());

  if (error) {
    // Table missing / RLS — fail closed on cost control so we don't runaway-bill later
    throw new Error(`Could not read generation usage: ${error.message}`);
  }

  return count ?? 0;
}

export async function assertUnderMonthlyCap(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ used: number; cap: number }> {
  const config = getGenerationCostConfig();
  const used = await countGenerationsThisMonth(supabase, userId);
  if (used >= config.monthlyCap) {
    const err = new Error(
      `Monthly generation cap reached (${used}/${config.monthlyCap}). Try again next month or raise GENERATION_MONTHLY_CAP.`,
    );
    (err as Error & { code?: string }).code = "MONTHLY_CAP";
    throw err;
  }
  return { used, cap: config.monthlyCap };
}

export async function recordGenerationUsage(
  supabase: SupabaseClient,
  row: {
    userId: string;
    assessmentId: string;
    model: string;
    tokensUsed: number;
    source: string;
  },
): Promise<void> {
  const { error } = await supabase.from("generation_usage").insert({
    user_id: row.userId,
    assessment_id: row.assessmentId,
    model: row.model,
    tokens_used: row.tokensUsed,
    source: row.source,
  });

  if (error) {
    throw new Error(`Could not record generation usage: ${error.message}`);
  }
}
