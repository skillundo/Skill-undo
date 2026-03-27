-- CampusGigs Complete Database Schema

-- 1. Profiles Table (Stores user information linked to Clerk Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id text primary key, -- Clerk User ID
  username text unique not null,
  full_name text,
  is_anonymous boolean default false,
  skills text[] default '{}',
  top_rated boolean default false,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tasks Table (Stores gigs and assignments)
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  budget numeric not null,
  deadline timestamp with time zone not null,
  category text not null,
  status text default 'open',
  posted_by text references public.profiles(id),
  assigned_to text references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Portfolio Items Table (Stores user portfolio projects)
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid default gen_random_uuid() primary key,
  profile_id text references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  demo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTE: Since we are using Clerk for authentication (which is a third-party auth provider),
-- standard Supabase Row Level Security (RLS) policies utilizing `auth.uid()` will block all writes.
-- For local development and to get the app running instantly, we are disabling RLS on these tables.
-- Before deploying to production, you should set up a custom Clerk JWT Template in your Supabase dashboard.

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items DISABLE ROW LEVEL SECURITY;
