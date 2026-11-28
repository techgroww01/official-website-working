-- 002_identity_media_rbac.sql
-- Identity, Multi-Tenancy, 20-Role RBAC & Media Assets (Zero Forward FKs)

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null,
  full_name text not null,
  account_class public.account_class_t not null default 'candidate',
  status public.user_status_t not null default 'invited',
  mfa_enabled boolean not null default false,
  session_version integer not null default 1,
  notification_preferences jsonb not null default '{}'::jsonb,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index uq_users_active_email on public.users (email) where deleted_at is null;
create index idx_users_class_status on public.users (account_class, status);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  storage_path text not null unique,
  mime_type text not null,
  byte_size integer not null check (byte_size > 0),
  width integer,
  height integer,
  alt_text text,
  is_decorative boolean not null default false,
  folder text not null default 'general',
  tags text[] not null default '{}',
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint chk_media_alt_text check (
    mime_type not like 'image/%'
    or is_decorative = true
    or length(trim(coalesce(alt_text, ''))) > 0
  )
);

create index idx_media_tags on public.media_assets using gin (tags);

alter table public.users
  add column avatar_asset_id uuid references public.media_assets(id) on delete set null;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug varchar(64) not null unique,
  label text not null,
  portal_scope text not null,
  is_system boolean not null default true
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  resource varchar(64) not null,
  action varchar(32) not null,
  description text,
  unique (resource, action)
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  granted_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, role_id)
);

create index idx_user_roles_user on public.user_roles (user_id);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  org_type public.org_type_t not null default 'prospect',
  industry text,
  website text,
  country text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_organizations_type on public.organizations (org_type);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  org_role public.org_role_t not null default 'client_member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  target_role_id uuid not null references public.roles(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete cascade,
  cohort_id uuid,
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  invited_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_invitations_email on public.invitations (email);
