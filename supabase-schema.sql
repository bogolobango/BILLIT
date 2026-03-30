-- BILLIT Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  company_name text not null default '',
  logo_url text,
  services text[] default '{}',
  certifications text[] default '{}',
  bio text default '',
  industry_focus text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Team Members
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  name text not null,
  title text not null default '',
  role text not null default '',
  bio text default '',
  years_experience integer default 0,
  certifications text[] default '{}',
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.team_members enable row level security;

create policy "Users can manage own team members" on public.team_members
  for all using (auth.uid() = profile_id);

-- Past Projects
create table public.past_projects (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  name text not null,
  client text not null default '',
  project_type text not null default '',
  value numeric default 0,
  location text default '',
  description text default '',
  year_completed integer,
  key_personnel uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.past_projects enable row level security;

create policy "Users can manage own past projects" on public.past_projects
  for all using (auth.uid() = profile_id);

-- Past Proposals (uploaded for AI learning)
create table public.past_proposals (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  file_url text not null,
  file_name text not null,
  extracted_text text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.past_proposals enable row level security;

create policy "Users can manage own past proposals" on public.past_proposals
  for all using (auth.uid() = profile_id);

-- Generated Proposals
create table public.proposals (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  title text not null default 'Untitled Proposal',
  client_name text not null default '',
  project_type text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'sent', 'won', 'lost')),
  rfp_source_type text not null default 'paste' check (rfp_source_type in ('upload', 'paste')),
  rfp_text text,
  rfp_file_url text,
  scoping_data jsonb,
  compliance_checklist jsonb,
  content jsonb,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  price_paid numeric,
  stripe_payment_id text
);

alter table public.proposals enable row level security;

create policy "Users can manage own proposals" on public.proposals
  for all using (auth.uid() = profile_id);

-- Storage buckets (run separately or via Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('logos', 'logos', true);
-- insert into storage.buckets (id, name, public) values ('photos', 'photos', true);
-- insert into storage.buckets (id, name, public) values ('proposals', 'proposals', false);
-- insert into storage.buckets (id, name, public) values ('rfps', 'rfps', false);
