-- Cloud state bridge for the current Bright Vision app.
-- Run after schema.sql when Supabase is being enabled.

create table if not exists public.school_app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.school_app_state enable row level security;

create policy if not exists "authenticated read school app state"
on public.school_app_state for select to authenticated using (true);

create policy if not exists "authenticated write school app state"
on public.school_app_state for insert to authenticated with check (true);

create policy if not exists "authenticated update school app state"
on public.school_app_state for update to authenticated using (true) with check (true);
