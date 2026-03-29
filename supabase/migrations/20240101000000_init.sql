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

-- Alumni policies
-- Anyone can submit a registration (insert pending)
create policy "Anyone can register" on public.alumni
  for insert with check (status = 'pending');

-- Approved alumni are publicly readable
create policy "Public can view approved alumni" on public.alumni
  for select using (status = 'approved');

-- Admins (service role) can do everything — handled via edge function with service role key

-- Events policies
-- Anyone can read events
create policy "Public can view events" on public.events
  for select using (true);

-- Only service role can insert/delete events (via admin dashboard using service role)
