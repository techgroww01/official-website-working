-- 005_recruitment.sql
-- Recruitment Portal & Careers ATS Domain

create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  posting_kind public.posting_kind_t not null default 'job',
  target_program_id uuid,
  employment_type text not null default 'Full-time',
  department text not null default 'Engineering',
  location text not null default 'Greater Noida, Uttar Pradesh',
  summary text not null,
  responsibilities text not null,
  requirements text not null,
  stipend_or_range text,
  status public.posting_status_t not null default 'draft',
  valid_through timestamptz,
  seo jsonb not null default '{}'::jsonb,
  hiring_manager_id uuid references public.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_jobs_status_kind on public.job_postings (status, posting_kind);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  posting_id uuid not null references public.job_postings(id) on delete restrict,
  candidate_user_id uuid references public.users(id) on delete set null,
  full_name text not null,
  email citext not null,
  phone text not null,
  linkedin_url text,
  portfolio_url text,
  cover_note text,
  resume_asset_id uuid references public.media_assets(id) on delete set null,
  stage public.application_stage_t not null default 'applied',
  assigned_recruiter_id uuid references public.users(id) on delete set null,
  privacy_consented_at timestamptz not null default now(),
  talent_pool_consent boolean not null default false,
  status_token_hash text unique,
  retention_expires_at timestamptz not null default (now() + interval '180 days'),
  anonymized_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index uq_active_application on public.applications (posting_id, lower(email)) where anonymized_at is null;
create index idx_applications_posting_stage on public.applications (posting_id, stage);
create index idx_applications_retention on public.applications (retention_expires_at) where anonymized_at is null;

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  interviewer_id uuid not null references public.users(id) on delete restrict,
  scheduled_at timestamptz not null,
  duration_mins integer not null default 45,
  meeting_link text,
  status public.interview_status_t not null default 'scheduled',
  created_at timestamptz not null default now()
);

create index idx_interviews_app on public.interviews (application_id);
create index idx_interviews_interviewer on public.interviews (interviewer_id, scheduled_at);

create table public.recruitment_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete restrict,
  note_type public.recruitment_note_t not null default 'general',
  score smallint check (score between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);

create index idx_recruitment_notes_app on public.recruitment_notes (application_id);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications(id) on delete cascade,
  offer_kind public.posting_kind_t not null,
  target_program_id uuid,
  target_mentor_id uuid references public.users(id) on delete set null,
  compensation_summary text,
  offer_letter_asset_id uuid references public.media_assets(id) on delete set null,
  status public.offer_status_t not null default 'draft',
  issued_by uuid references public.users(id) on delete set null,
  issued_at timestamptz,
  expires_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);
