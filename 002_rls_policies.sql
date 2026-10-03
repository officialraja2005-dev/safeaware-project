-- Row Level Security policies for SafeAware
-- Run after 001_initial_schema.sql

alter table profiles enable row level security;
alter table onboarding_preferences enable row level security;
alter table survey_questions enable row level security;
alter table survey_options enable row level security;
alter table survey_responses enable row level security;
alter table survey_answers enable row level security;
alter table campaigns enable row level security;
alter table resources enable row level security;
alter table legal_resources enable row level security;
alter table emergency_contacts enable row level security;
alter table safety_reports enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- Profiles -------------------------------------------------------------------
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id or is_admin());

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = 'user');

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id and role = 'user');

create policy "Admins manage profiles" on profiles
  for all using (is_admin());

-- Onboarding preferences -------------------------------------------------------
create policy "Users manage own onboarding" on onboarding_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Survey questions & options: public read, admin write ------------------------
create policy "Anyone can read active survey questions" on survey_questions
  for select using (is_active or is_admin());

create policy "Admins manage survey questions" on survey_questions
  for all using (is_admin());

create policy "Anyone can read survey options" on survey_options
  for select using (true);

create policy "Admins manage survey options" on survey_options
  for all using (is_admin());

-- Survey responses & answers ---------------------------------------------------
create policy "Users can insert their own responses" on survey_responses
  for insert with check (auth.uid() = user_id or is_anonymous);

create policy "Users can view their own responses" on survey_responses
  for select using (auth.uid() = user_id or is_admin());

create policy "Users can insert answers for their response" on survey_answers
  for insert with check (
    exists (select 1 from survey_responses r where r.id = response_id and (r.user_id = auth.uid() or r.is_anonymous))
  );

create policy "Admins can read all answers" on survey_answers
  for select using (is_admin());

-- Campaigns ----------------------------------------------------------------
create policy "Public can read published campaigns" on campaigns
  for select using (status = 'published' or is_admin());

create policy "Admins manage campaigns" on campaigns
  for all using (is_admin());

-- Resources ------------------------------------------------------------------
create policy "Public can read published resources" on resources
  for select using (published or is_admin());

create policy "Admins manage resources" on resources
  for all using (is_admin());

-- Legal resources --------------------------------------------------------------
create policy "Public can read published legal resources" on legal_resources
  for select using (published or is_admin());

create policy "Admins manage legal resources" on legal_resources
  for all using (is_admin());

-- Emergency contacts -------------------------------------------------------------
create policy "Public can read active emergency contacts" on emergency_contacts
  for select using (is_active or is_admin());

create policy "Admins manage emergency contacts" on emergency_contacts
  for all using (is_admin());

-- Safety reports -----------------------------------------------------------------
create policy "Users can submit reports" on safety_reports
  for insert with check (auth.uid() = user_id or is_anonymous);

create policy "Users can view their own non-anonymous reports" on safety_reports
  for select using ((auth.uid() = user_id and not is_anonymous) or is_admin());

create policy "Admins manage reports" on safety_reports
  for update using (is_admin());
