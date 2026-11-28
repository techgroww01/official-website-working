-- 004_sales_leads.sql
-- Sales Team Portal Domain (Contacts, Leads, Opportunities, Proposals, Activities)

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  full_name text not null,
  email citext,
  phone text,
  designation text,
  owner_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_contacts_org on public.contacts (organization_id);
create index idx_contacts_owner on public.contacts (owner_id);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid references public.contact_enquiries(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  company_name text,
  full_name text not null,
  email citext not null,
  phone text,
  service_interest text not null,
  budget_bracket text,
  stage public.lead_stage_t not null default 'new',
  disqualified_reason text,
  source text not null default 'website_contact',
  assigned_to uuid references public.users(id) on delete set null,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index uq_leads_enquiry on public.leads (enquiry_id) where enquiry_id is not null;
create index idx_leads_assigned_stage on public.leads (assigned_to, stage);
create index idx_leads_created on public.leads (created_at desc);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  primary_contact_id uuid references public.contacts(id) on delete set null,
  title text not null,
  owner_id uuid not null references public.users(id) on delete restrict,
  pipeline_stage public.opportunity_stage_t not null default 'discovery',
  estimated_value_minor bigint not null default 0,
  currency varchar(3) not null default 'INR',
  expected_close_date date,
  lost_reason text,
  created_at timestamptz not null default now()
);

create index idx_opps_owner_stage on public.opportunities (owner_id, pipeline_stage);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  version integer not null default 1,
  title text not null,
  scope_summary text,
  amount_minor bigint not null default 0,
  currency varchar(3) not null default 'INR',
  document_asset_id uuid references public.media_assets(id) on delete set null,
  status public.proposal_status_t not null default 'draft',
  valid_until date,
  created_by uuid references public.users(id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (opportunity_id, version)
);

create table public.sales_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  actor_id uuid not null references public.users(id) on delete restrict,
  activity_type public.sales_activity_t not null default 'note',
  summary text not null,
  next_follow_up_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  check (lead_id is not null or opportunity_id is not null)
);

create index idx_sales_act_lead on public.sales_activities (lead_id, created_at desc);
create index idx_sales_act_opp on public.sales_activities (opportunity_id, created_at desc);
create index idx_sales_act_followup on public.sales_activities (actor_id, next_follow_up_at);
