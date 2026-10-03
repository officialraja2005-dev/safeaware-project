-- SafeAware initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push` if using the CLI.

create extension if not exists "uuid-ossp";

-- 1. Profiles ---------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  phone_optional text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Onboarding preferences --------------------------------------------------
create table if not exists onboarding_preferences (
  user_id uuid primary key references profiles (id) on delete cascade,
  interests text[] not null default '{}',
  wants_survey boolean not null default false,
  completed boolean not null default false,
  updated_at timestamptz not null default now()
);

-- 3. Survey -------------------------------------------------------------------
create table if not exists survey_questions (
  id uuid primary key default uuid_generate_v4(),
  prompt text not null,
  question_type text not null check (question_type in ('multiple_choice','checkbox','rating','yes_no','text')),
  is_required boolean not null default false,
  is_active boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists survey_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references survey_questions (id) on delete cascade,
  label text not null,
  order_index int not null default 0
);

create table if not exists survey_responses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles (id) on delete set null,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists survey_answers (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid not null references survey_responses (id) on delete cascade,
  question_id uuid not null references survey_questions (id) on delete cascade,
  answer_value text not null
);

create index if not exists idx_survey_answers_response on survey_answers (response_id);
create index if not exists idx_survey_options_question on survey_options (question_id);

-- 4. Campaigns ------------------------------------------------------------------
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  category text not null,
  cover_image text,
  topics text[] not null default '{}',
  start_date date not null,
  end_date date not null,
  status text not null default 'draft' check (status in ('draft','published','completed')),
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Resources --------------------------------------------------------------
create table if not exists resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text not null,
  content text not null,
  category text not null,
  source_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Legal resources ----------------------------------------------------------
create table if not exists legal_resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  topic text not null,
  summary text not null,
  general_information text not null,
  official_source_url text,
  jurisdiction text not null,
  last_verified date not null default current_date,
  published boolean not null default true
);

-- 7. Emergency contacts -------------------------------------------------------
create table if not exists emergency_contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  phone text not null,
  website text,
  category text not null,
  jurisdiction text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Safety reports -------------------------------------------------------------
create table if not exists safety_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles (id) on delete set null,
  category text not null,
  description text not null,
  approximate_location text,
  incident_date date,
  is_anonymous boolean not null default false,
  contact_information text,
  status text not null default 'new' check (status in ('new','reviewing','resolved','closed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_safety_reports_status on safety_reports (status);

-- Keep updated_at fresh -------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger trg_campaigns_updated before update on campaigns
  for each row execute function set_updated_at();
create trigger trg_resources_updated before update on resources
  for each row execute function set_updated_at();
create trigger trg_emergency_updated before update on emergency_contacts
  for each row execute function set_updated_at();
create trigger trg_reports_updated before update on safety_reports
  for each row execute function set_updated_at();
