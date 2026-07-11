-- Phase 1A: question bank metadata for Maths CAPS + Life Sciences Bloom
-- Run in Supabase SQL Editor after 001_initial_schema.sql

-- CAPS cognitive level for Mathematics items (Bloom stays in bloom_level)
alter table public.questions
  add column if not exists cognitive_level text;

alter table public.questions
  drop constraint if exists questions_cognitive_level_check;

alter table public.questions
  add constraint questions_cognitive_level_check
  check (
    cognitive_level is null
    or cognitive_level in (
      'knowledge',
      'routine_procedure',
      'complex_procedure',
      'problem_solving'
    )
  );

-- Optional IEB Life Sciences AIM (1–3) from analysis grids
alter table public.questions
  add column if not exists aim text;

alter table public.questions
  drop constraint if exists questions_aim_check;

alter table public.questions
  add constraint questions_aim_check
  check (
    aim is null
    or aim in ('aim_1', 'aim_2', 'aim_3')
  );

-- Syllabus strand label (free text for now; LS grids use named strands)
alter table public.questions
  add column if not exists strand text;

-- System vs educator-authored later
alter table public.questions
  add column if not exists visibility text not null default 'system';

alter table public.questions
  drop constraint if exists questions_visibility_check;

alter table public.questions
  add constraint questions_visibility_check
  check (visibility in ('system', 'private', 'school'));

comment on table public.questions is
  'Question bank — Phase 1A seed lives in src/lib/content/question-bank; load into DB when ready for multi-device generation.';

comment on column public.questions.cognitive_level is
  'Mathematics CAPS cognitive level (not Bloom).';

comment on column public.questions.bloom_level is
  'Life Sciences Bloom level (knowledge…evaluation).';

create index if not exists questions_cognitive_level_idx
  on public.questions (cognitive_level)
  where cognitive_level is not null;

create index if not exists questions_bloom_level_idx
  on public.questions (bloom_level)
  where bloom_level is not null;
