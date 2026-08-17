-- Bright Vision English School Management System
-- Production database foundation for Supabase/Postgres.
-- Run in Supabase SQL Editor after creating a project.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin','teacher','accountant','student','parent');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.record_status as enum ('active','inactive');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.attendance_status as enum ('present','absent','late');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.fee_status as enum ('paid','pending','overdue');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.fee_frequency as enum ('monthly','term','annual');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.payment_method as enum ('cash','bank','online');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.exam_status as enum ('scheduled','ongoing','completed');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.notice_status as enum ('published','draft');
exception when duplicate_object then null; end $$;

create table if not exists public.school_settings (
  id uuid primary key default gen_random_uuid(),
  school_name text not null,
  logo_url text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  academic_session text not null default '',
  principal_name text not null default '',
  currency text not null default 'PKR',
  date_format text not null default 'dd/MM/yyyy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.app_role not null default 'parent',
  status public.record_status not null default 'active',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.school_classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sections text[] not null default '{}',
  class_teacher_id uuid references public.user_accounts(id) on delete set null,
  student_count integer not null default 0 check (student_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  teacher_id text not null unique,
  full_name text not null,
  email text not null,
  phone text not null default '',
  subject text not null default '',
  assigned_classes uuid[] not null default '{}',
  joining_date date,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_id text not null unique,
  admission_number text not null unique,
  full_name text not null,
  father_name text not null default '',
  mother_name text not null default '',
  date_of_birth date,
  gender text not null check (gender in ('male','female')),
  class_id uuid not null references public.school_classes(id) on delete restrict,
  section text not null,
  roll_number text not null,
  phone text not null default '',
  address text not null default '',
  admission_date date,
  photo_url text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  class_id uuid not null references public.school_classes(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null,
  class_id uuid not null references public.school_classes(id) on delete cascade,
  section text not null,
  status public.attendance_status not null,
  created_at timestamptz not null default now(),
  unique(student_id, date)
);

create table if not exists public.fee_structure (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null check (amount >= 0),
  frequency public.fee_frequency not null default 'monthly',
  created_at timestamptz not null default now()
);

create table if not exists public.fee_invoices (
  id uuid primary key default gen_random_uuid(),
  receipt_no text not null unique,
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null check (amount >= 0),
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  due_date date not null,
  paid_date date,
  method public.payment_method,
  status public.fee_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  weight numeric(5,2) not null check (weight >= 0 and weight <= 100),
  created_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  exam_type_id uuid not null references public.exam_types(id) on delete restrict,
  class_id uuid not null references public.school_classes(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status public.exam_status not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists public.marks (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  obtained numeric(8,2) not null check (obtained >= 0),
  total numeric(8,2) not null check (total > 0),
  created_at timestamptz not null default now(),
  unique(exam_id, student_id, subject_id)
);

create table if not exists public.timetable_slots (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  section text not null,
  day text not null check (day in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
  period integer not null check (period > 0),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  room text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  date date not null default current_date,
  audience text not null check (audience in ('all','students','teachers','parents','staff')),
  status public.notice_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_class_idx on public.students(class_id);
create index if not exists attendance_date_idx on public.attendance(date);
create index if not exists fees_student_idx on public.fee_invoices(student_id);
create index if not exists fees_status_idx on public.fee_invoices(status);
create index if not exists marks_exam_idx on public.marks(exam_id);
create index if not exists notices_date_idx on public.notices(date desc);

alter table public.school_settings enable row level security;
alter table public.user_accounts enable row level security;
alter table public.school_classes enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.subjects enable row level security;
alter table public.attendance enable row level security;
alter table public.fee_structure enable row level security;
alter table public.fee_invoices enable row level security;
alter table public.exam_types enable row level security;
alter table public.exams enable row level security;
alter table public.marks enable row level security;
alter table public.timetable_slots enable row level security;
alter table public.notices enable row level security;

-- Initial development policy: authenticated school staff can read/write.
-- Tighten these policies by role before production launch.
create policy if not exists "authenticated read school settings" on public.school_settings for select to authenticated using (true);
create policy if not exists "authenticated manage school settings" on public.school_settings for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage user accounts" on public.user_accounts for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage classes" on public.school_classes for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage teachers" on public.teachers for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage students" on public.students for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage subjects" on public.subjects for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage attendance" on public.attendance for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage fee structure" on public.fee_structure for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage invoices" on public.fee_invoices for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage exam types" on public.exam_types for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage exams" on public.exams for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage marks" on public.marks for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage timetable" on public.timetable_slots for all to authenticated using (true) with check (true);
create policy if not exists "authenticated manage notices" on public.notices for all to authenticated using (true) with check (true);
