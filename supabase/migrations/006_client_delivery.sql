-- 006_client_delivery.sql
-- Client Portal & Operations Delivery Domain (Composite FKs for Strict Org Isolation)

create table public.client_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  opportunity_id uuid unique references public.opportunities(id) on delete set null,
  name text not null,
  code text not null unique,
  current_phase public.delivery_phase_t not null default 'Discovery',
  status public.client_project_status_t not null default 'onboarding',
  operations_manager_id uuid not null references public.users(id) on delete restrict,
  start_date date,
  target_launch_date date,
  created_at timestamptz not null default now(),
  unique (id, organization_id)
);

create index idx_client_projects_org_status on public.client_projects (organization_id, status);

create table public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  status public.milestone_status_t not null default 'not_started',
  due_date date,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz
);

create index idx_milestones_project_order on public.project_milestones (project_id, sort_order);

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.project_milestones(id) on delete cascade,
  title text not null,
  summary text,
  artifact_url text,
  file_asset_id uuid references public.media_assets(id) on delete set null,
  review_status public.deliverable_review_t not null default 'pending',
  client_feedback text,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_deliverables_milestone on public.deliverables (milestone_id);

create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  category public.project_file_cat_t not null default 'architecture',
  uploaded_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index idx_project_files_proj on public.project_files (project_id);

create table public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now()
);

create index idx_project_messages_proj on public.project_messages (project_id, created_at desc);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  organization_id uuid not null,
  created_by uuid not null references public.users(id) on delete restrict,
  assigned_to uuid references public.users(id) on delete set null,
  subject text not null,
  description text not null,
  priority public.ticket_priority_t not null default 'medium',
  status public.ticket_status_t not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint fk_ticket_project_org foreign key (project_id, organization_id)
    references public.client_projects(id, organization_id) on delete cascade
);

create index idx_tickets_org_status on public.support_tickets (organization_id, status);

create table public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete restrict,
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_ticket_comments_ticket on public.ticket_comments (ticket_id, created_at);

create table public.billing_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  organization_id uuid not null,
  milestone_id uuid references public.project_milestones(id) on delete set null,
  invoice_number text not null unique,
  description text,
  amount_minor bigint not null check (amount_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  currency varchar(3) not null default 'INR',
  status public.billing_status_t not null default 'draft',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  pdf_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint fk_billing_project_org foreign key (project_id, organization_id)
    references public.client_projects(id, organization_id) on delete cascade,
  constraint chk_billing_pdf_issued check (status = 'draft' or pdf_asset_id is not null)
);

create index idx_billing_org_status on public.billing_records (organization_id, status);
