-- AssessMate initial schema (run in Supabase SQL Editor or via CLI)

create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  school text,
  province text,
  subjects text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Saved assessments (wizard state + future generated content)
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled assessment',
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'exported', 'archived')),
  wizard_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assessments_user_id_idx on public.assessments (user_id);
create index if not exists assessments_updated_at_idx on public.assessments (updated_at desc);

-- Question bank (populated in Phase 2 — extraction pipeline)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  grade text not null,
  exam_body text not null check (exam_body in ('DBE', 'IEB')),
  topic text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  marks integer not null check (marks > 0),
  bloom_level text,
  question_text text not null,
  memo_answer text,
  marking_points jsonb default '[]',
  source text,
  assessment_type text,
  language text default 'en',
  created_at timestamptz not null default now()
);

create index if not exists questions_subject_grade_idx
  on public.questions (subject, grade, exam_body);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, school)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'school'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists assessments_updated_at on public.assessments;
create trigger assessments_updated_at
  before update on public.assessments
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.questions enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can read own assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on public.assessments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own assessments"
  on public.assessments for update
  using (auth.uid() = user_id);

create policy "Users can delete own assessments"
  on public.assessments for delete
  using (auth.uid() = user_id);

-- Questions readable by authenticated users (admin ingest later)
create policy "Authenticated users can read questions"
  on public.questions for select
  to authenticated
  using (true);
