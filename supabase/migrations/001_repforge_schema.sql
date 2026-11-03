-- ============================================================
-- RepForge schema — profiles, workouts, progress, notifications
-- Run in Supabase SQL Editor OR via CLI: supabase db push
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  preferred_name text not null default 'Athlete',
  email text not null default '',
  photo_url text,
  bio text not null default '',
  city text not null default 'Lagos',
  country text not null default 'Nigeria',
  height_cm numeric,
  weight_kg numeric,
  goal text not null default 'build-muscle',
  experience text not null default 'beginner',
  location text not null default 'home',
  equipment text[] not null default array['none']::text[],
  preferred_days text[] not null default array['Monday','Wednesday','Friday']::text[],
  session_minutes integer not null default 45,
  focus_areas text[] not null default array['full-body']::text[],
  notifications_enabled boolean not null default false,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

-- ------------------------------------------------------------
-- workout_plans
-- ------------------------------------------------------------
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text not null default '',
  goal text not null default 'build-muscle',
  level text not null default 'beginner',
  location text not null default 'home',
  duration_minutes integer not null default 45,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workout_plans_user_idx on public.workout_plans (user_id);

-- ------------------------------------------------------------
-- workout_plan_exercises
-- ------------------------------------------------------------
create table if not exists public.workout_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans (id) on delete cascade,
  exercise_id text not null,
  sort_order integer not null default 0,
  sets integer not null default 3,
  reps text not null default '8-12',
  rest_seconds integer not null default 60,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists workout_plan_exercises_plan_idx
  on public.workout_plan_exercises (plan_id);

-- ------------------------------------------------------------
-- workout_records (completed / logged sessions)
-- ------------------------------------------------------------
create table if not exists public.workout_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workout_plan_id uuid references public.workout_plans (id) on delete set null,
  name text not null,
  workout_date date not null default (timezone('utc', now()))::date,
  duration_minutes integer not null default 0,
  exercises_completed integer not null default 0,
  notes text,
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists workout_records_user_idx on public.workout_records (user_id);
create index if not exists workout_records_date_idx on public.workout_records (user_id, workout_date desc);

-- ------------------------------------------------------------
-- progress_entries (body weight / notes over time)
-- ------------------------------------------------------------
create table if not exists public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null default (timezone('utc', now()))::date,
  body_weight_kg numeric,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists progress_entries_user_idx on public.progress_entries (user_id);

-- ------------------------------------------------------------
-- personal_records
-- ------------------------------------------------------------
create table if not exists public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  exercise_name text not null,
  value text not null,
  recorded_on date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default now()
);

create index if not exists personal_records_user_idx on public.personal_records (user_id);

-- ------------------------------------------------------------
-- notifications (cloud copy of in-app alerts)
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  detail text,
  href text,
  kind text not null default 'system',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

-- ------------------------------------------------------------
-- updated_at helper
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists workout_plans_set_updated_at on public.workout_plans;
create trigger workout_plans_set_updated_at
  before update on public.workout_plans
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Auto-create profile when a user signs up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    preferred_name,
    email,
    country,
    email_verified
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'preferred_name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, 'athlete'), '@', 1)
    ),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'country', 'Nigeria'),
    coalesce(new.email_confirmed_at is not null, false)
  )
  on conflict (id) do update
    set
      email = excluded.email,
      email_verified = excluded.email_verified,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_plan_exercises enable row level security;
alter table public.workout_records enable row level security;
alter table public.progress_entries enable row level security;
alter table public.personal_records enable row level security;
alter table public.notifications enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- workout_plans
drop policy if exists "workout_plans_all_own" on public.workout_plans;
create policy "workout_plans_all_own"
  on public.workout_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- workout_plan_exercises (via plan ownership)
drop policy if exists "workout_plan_exercises_all_own" on public.workout_plan_exercises;
create policy "workout_plan_exercises_all_own"
  on public.workout_plan_exercises for all
  using (
    exists (
      select 1 from public.workout_plans p
      where p.id = plan_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_plans p
      where p.id = plan_id and p.user_id = auth.uid()
    )
  );

-- workout_records
drop policy if exists "workout_records_all_own" on public.workout_records;
create policy "workout_records_all_own"
  on public.workout_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- progress_entries
drop policy if exists "progress_entries_all_own" on public.progress_entries;
create policy "progress_entries_all_own"
  on public.progress_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- personal_records
drop policy if exists "personal_records_all_own" on public.personal_records;
create policy "personal_records_all_own"
  on public.personal_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- notifications
drop policy if exists "notifications_all_own" on public.notifications;
create policy "notifications_all_own"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
