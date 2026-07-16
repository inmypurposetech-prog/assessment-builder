-- Phase 1E: Private template packs in Supabase Storage + link on assessments.
-- Apply in Supabase SQL Editor (or: SUPABASE_DB_URL=… npm run db:migrate:004).
-- Reminder: uploads are educator-owned school materials — no learner PII / marks.

-- ---------------------------------------------------------------------------
-- templates (metadata; files live in Storage bucket `templates`)
-- ---------------------------------------------------------------------------
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  subject text check (
    subject is null
    or subject in ('Mathematics', 'Life Sciences')
  ),
  exam_body text check (
    exam_body is null
    or exam_body in ('DBE', 'IEB')
  ),
  -- Phase 1E: Private only (School / Public later — ADR-005 / Phase 5)
  visibility text not null default 'private'
    check (visibility = 'private'),
  storage_path text not null,
  mime_type text,
  original_filename text,
  file_size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_user_id_idx
  on public.templates (user_id);

drop trigger if exists templates_updated_at on public.templates;
create trigger templates_updated_at
  before update on public.templates
  for each row execute function public.set_updated_at();

alter table public.templates enable row level security;

drop policy if exists "Users can read own templates" on public.templates;
create policy "Users can read own templates"
  on public.templates for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own templates" on public.templates;
create policy "Users can insert own templates"
  on public.templates for insert
  with check (
    auth.uid() = user_id
    and visibility = 'private'
  );

drop policy if exists "Users can update own templates" on public.templates;
create policy "Users can update own templates"
  on public.templates for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and visibility = 'private'
  );

drop policy if exists "Users can delete own templates" on public.templates;
create policy "Users can delete own templates"
  on public.templates for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- assessments.template_id (optional; set when creating / saving wizard)
-- ---------------------------------------------------------------------------
alter table public.assessments
  add column if not exists template_id uuid
    references public.templates (id) on delete set null;

create index if not exists assessments_template_id_idx
  on public.assessments (template_id);

-- ---------------------------------------------------------------------------
-- Storage bucket: private templates (path prefix = auth.uid())
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'templates',
  'templates',
  false,
  10485760, -- 10 MiB
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Folder convention: {user_id}/{template_id}/{filename}
drop policy if exists "Users can read own template objects" on storage.objects;
create policy "Users can read own template objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can upload own template objects" on storage.objects;
create policy "Users can upload own template objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own template objects" on storage.objects;
create policy "Users can update own template objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own template objects" on storage.objects;
create policy "Users can delete own template objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
