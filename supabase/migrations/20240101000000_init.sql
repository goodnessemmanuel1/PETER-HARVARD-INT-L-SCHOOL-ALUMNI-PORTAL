-- ============================================================
-- PETER HARVARD INT'L SCHOOL ALUMNI PORTAL — DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Alumni table
create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  graduation_year integer not null,
  current_occupation text,
  bio text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false,
  auth_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  type text not null default 'Announcement' check (type in ('Announcement', 'Event', 'News')),
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.alumni enable row level security;
alter table public.events enable row level security;

-- Drop all existing policies before recreating
drop policy if exists "Anyone can register" on public.alumni;
drop policy if exists "Public can view approved alumni" on public.alumni;
drop policy if exists "Admins can view all alumni" on public.alumni;
drop policy if exists "Admins can update alumni" on public.alumni;
drop policy if exists "Admins can delete alumni" on public.alumni;
drop policy if exists "Public can view events" on public.events;
drop policy if exists "Admins can insert events" on public.events;
drop policy if exists "Admins can delete events" on public.events;

-- ── ALUMNI POLICIES ──────────────────────────────────────────

-- Anyone (anon) can submit a registration
create policy "Anyone can register" on public.alumni
  for insert with check (status = 'pending');

-- Anyone can view approved alumni
create policy "Public can view approved alumni" on public.alumni
  for select using (status = 'approved');

-- Admins can view ALL alumni (pending, approved, rejected)
create policy "Admins can view all alumni" on public.alumni
  for select using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admins can update alumni (approve, reject, feature)
create policy "Admins can update alumni" on public.alumni
  for update using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ── EVENTS POLICIES ──────────────────────────────────────────

-- Anyone can read events
create policy "Public can view events" on public.events
  for select using (true);

-- Admins can insert events
create policy "Admins can insert events" on public.events
  for insert with check (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admins can delete events
create policy "Admins can delete events" on public.events
  for delete using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================================
-- SEED: Create initial admin account
-- Step 1: Go to Supabase Dashboard → Authentication → Users
--         → Add User → Email: anointedthedeveloper@gmail.com
--         → Password: pass123 → Auto Confirm: ON
-- Step 2: Run the UPDATE below
-- ============================================================
update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
where email = 'anointedthedeveloper@gmail.com';
