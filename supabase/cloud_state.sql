-- Cloud state bridge for the current Bright Vision app.
-- Run after schema.sql when Supabase is being enabled.

create table if not exists public.school_app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.school_app_state enable row level security;

-- PostgreSQL does not support CREATE POLICY IF NOT EXISTS, so remove/recreate
-- these named policies to make this script safely re-runnable.
drop policy if exists "authenticated read school app state" on public.school_app_state;
drop policy if exists "authenticated write school app state" on public.school_app_state;
drop policy if exists "authenticated update school app state" on public.school_app_state;

create policy "authenticated read school app state"
on public.school_app_state for select to authenticated using (true);

create policy "authenticated write school app state"
on public.school_app_state for insert to authenticated with check (true);

create policy "authenticated update school app state"
on public.school_app_state for update to authenticated using (true) with check (true);
