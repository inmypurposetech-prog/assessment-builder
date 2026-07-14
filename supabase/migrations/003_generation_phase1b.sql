-- Phase 1B: structured generation — store paper/memo JSON + monthly usage for cost caps
-- Run in Supabase SQL Editor after deploy (or via CLI with SUPABASE_DB_URL).

alter table public.assessments
  add column if not exists generated_content jsonb;

alter table public.assessments
  add column if not exists generated_at timestamptz;

comment on column public.assessments.generated_content is
  'Structured paper + memo + taxonomy JSON from /api/generate (schemaVersion 1).';
comment on column public.assessments.generated_at is
  'When generated_content was last written.';

create table if not exists public.generation_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete set null,
  model text not null default 'bank-only',
  tokens_used integer not null default 0 check (tokens_used >= 0),
  source text not null default 'question_bank'
    check (source in ('question_bank', 'question_bank+ai_gaps')),
  created_at timestamptz not null default now()
);

create index if not exists generation_usage_user_created_idx
  on public.generation_usage (user_id, created_at desc);

create index if not exists generation_usage_assessment_idx
  on public.generation_usage (assessment_id);

alter table public.generation_usage enable row level security;

drop policy if exists "Users can read own generation usage" on public.generation_usage;
create policy "Users can read own generation usage"
  on public.generation_usage for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own generation usage" on public.generation_usage;
create policy "Users can insert own generation usage"
  on public.generation_usage for insert
  with check (auth.uid() = user_id);

comment on table public.generation_usage is
  'Per-generation cost/usage log for monthly caps (Phase 1B).';
