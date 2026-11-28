-- 007_internships_and_deferred_fks.sql
-- Intern Portal Domain & Deferred Program FKs (Zero Forward-FK Errors)

create table public.internship_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cohort_code text not null unique,
  duration_weeks integer not null default 8,
  start_date date,
  end_date date,
  attendance_enabled boolean not null default false,
  status public.cohort_status_t not null default 'planned',
  created_at timestamptz not null default now()
);

alter table public.invitations
  add constraint fk_invitations_cohort
  foreign key (cohort_id) references public.internship_programs(id) on delete set null;

alter table public.job_postings
  add constraint fk_jobs_program
  foreign key (target_program_id) references public.internship_programs(id) on delete set null;

alter table public.offers
  add constraint fk_offers_program
  foreign key (target_program_id) references public.internship_programs(id) on delete set null;

create table public.intern_enrollments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.internship_programs(id) on delete restrict,
  user_id uuid not null references public.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  mentor_id uuid not null references public.users(id) on delete restrict,
  onboarding_checklist jsonb not null default '{}'::jsonb,
  nda_accepted_at timestamptz,
  policy_accepted_at timestamptz,
  onboarding_status text not null default 'pending',
  status public.enrollment_status_t not null default 'active',
  joined_at timestamptz not null default now(),
  unique (program_id, user_id)
);

create index idx_intern_enrollments_mentor on public.intern_enrollments (mentor_id);

create table public.cohort_announcements (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.internship_programs(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete restrict,
  title text not null,
  body text not null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_cohort_announcements_prog on public.cohort_announcements (program_id, created_at desc);

create table public.intern_tasks (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.intern_enrollments(id) on delete cascade,
  assigned_by uuid not null references public.users(id) on delete restrict,
  title text not null,
  instructions text not null,
  due_at timestamptz,
  priority public.ticket_priority_t not null default 'medium',
  status public.intern_task_status_t not null default 'todo',
  created_at timestamptz not null default now()
);

create index idx_intern_tasks_enroll_status on public.intern_tasks (enrollment_id, status);

create table public.task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.intern_tasks(id) on delete cascade,
  submitted_by uuid not null references public.users(id) on delete cascade,
  submission_url text,
  file_asset_id uuid references public.media_assets(id) on delete set null,
  notes text,
  mentor_feedback text,
  rating smallint check (rating between 1 and 5),
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_task_submissions_task on public.task_submissions (task_id);

create table public.intern_attendance (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.intern_enrollments(id) on delete cascade,
  attendance_date date not null,
  status public.attendance_status_t not null default 'present',
  recorded_by uuid not null references public.users(id) on delete restrict,
  note text,
  unique (enrollment_id, attendance_date)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.intern_enrollments(id) on delete restrict,
  certificate_code text not null unique,
  recipient_name text not null,
  program_title_snapshot text not null,
  issued_by uuid not null references public.users(id) on delete restrict,
  issued_at timestamptz not null default now(),
  pdf_asset_id uuid references public.media_assets(id) on delete set null,
  revoked_at timestamptz,
  revocation_reason text
);
