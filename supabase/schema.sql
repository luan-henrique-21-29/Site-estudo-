-- Futuro Lab cross-device sync
-- Run this once in Supabase > SQL Editor.

create table if not exists public.study_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.study_profiles enable row level security;

drop policy if exists "Users can read own study profile" on public.study_profiles;
create policy "Users can read own study profile"
on public.study_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own study profile" on public.study_profiles;
create policy "Users can insert own study profile"
on public.study_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own study profile" on public.study_profiles;
create policy "Users can update own study profile"
on public.study_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- No public/anonymous policy is created. A user can only read or write their own row.
