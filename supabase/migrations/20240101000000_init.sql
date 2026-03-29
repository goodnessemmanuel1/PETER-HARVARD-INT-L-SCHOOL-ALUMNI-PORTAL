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

-- Drop existing policies if re-running
drop policy if exists "Anyone can register" on public.alumni;
drop policy if exists "Public can view approved alumni" on public.alumni;
drop policy if exists "Public can view events" on public.events;
drop policy if exists "Admins can view all alumni" on public.alumni;
drop policy if exists "Admins can update alumni" on public.events;

-- Alumni policies
create policy "Anyone can register" on public.alumni
  for insert with check (status = 'pending');

create policy "Public can view approved alumni" on public.alumni
  for select using (status = 'approved');

-- Admins can see all alumni (pending, approved, rejected)
create policy "Admins can view all alumni" on public.alumni
  for select using (
    auth.jwt() ->> 'role' = 'service_role'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Events policies
create policy "Public can view events" on public.events
  for select using (true);

-- ============================================================
-- SEED: Create initial admin account
-- Email: anointedthedeveloper@gmail.com / Password: pass123
-- ============================================================
-- NOTE: Run this block AFTER the tables above.
-- This uses Supabase's auth.users directly via the service role.
-- The easiest way is to use the Supabase Dashboard:
--   Authentication → Users → Add User
--   Email: anointedthedeveloper@gmail.com
--   Password: pass123
--   Then run the UPDATE below to set the admin role.

-- After creating the user in the dashboard, run this to make them admin:
-- (Replace the email if needed)
update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
where email = 'anointedthedeveloper@gmail.com';
