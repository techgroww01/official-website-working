-- 003_cms_and_comms.sql
-- Public CMS Entities, Inquiries, Newsletter, Broadcasts & Notifications

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  status public.cms_status_t not null default 'draft',
  sections jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_pages_status_slug on public.pages (status, slug);

create table public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  version_number integer not null,
  snapshot jsonb not null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (page_id, version_number)
);

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.navigation_items(id) on delete cascade,
  menu_group text not null,
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  is_external boolean not null default false,
  is_active boolean not null default true
);

create index idx_nav_group_order on public.navigation_items (menu_group, sort_order);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'Engineering',
  title text not null,
  summary text not null,
  problem_statement text not null,
  solution_approach text not null,
  capabilities jsonb not null default '[]'::jsonb,
  tech_tags text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  cover_asset_id uuid references public.media_assets(id) on delete set null,
  status public.cms_status_t not null default 'draft',
  sort_order integer not null default 0,
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_services_status_order on public.services (status, sort_order);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  project_type public.project_type_t not null default 'reference_blueprint',
  is_client_approved boolean not null default false,
  client_display_name text,
  industry text not null,
  summary text not null,
  challenge text not null,
  architecture text not null,
  outcomes text,
  tech_stack text[] not null default '{}',
  is_featured boolean not null default false,
  status public.cms_status_t not null default 'draft',
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint chk_portfolio_client_approval check (
    project_type <> 'client_project'
    or is_client_approved = true
    or status <> 'published'
  )
);

create table public.portfolio_gallery_assets (
  portfolio_id uuid not null references public.portfolio_items(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (portfolio_id, media_asset_id)
);

create table public.service_portfolio_links (
  service_id uuid not null references public.services(id) on delete cascade,
  portfolio_id uuid not null references public.portfolio_items(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (service_id, portfolio_id)
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  full_name text not null,
  designation text not null,
  bio text,
  photo_asset_id uuid references public.media_assets(id) on delete set null,
  linkedin_url text,
  is_public boolean not null default false,
  sort_order integer not null default 0
);

create index idx_team_public_order on public.team_members (is_public, sort_order);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body_markdown text not null,
  cover_asset_id uuid references public.media_assets(id) on delete set null,
  category_id uuid references public.blog_categories(id) on delete set null,
  tags text[] not null default '{}',
  author_member_id uuid references public.team_members(id) on delete set null,
  is_featured boolean not null default false,
  reading_time_mins integer not null default 4,
  status public.cms_status_t not null default 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_blog_status_pub on public.blog_posts (status, published_at desc);
create index idx_blog_tags on public.blog_posts using gin (tags);

create table public.blog_post_relations (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  related_post_id uuid not null references public.blog_posts(id) on delete cascade,
  primary key (post_id, related_post_id),
  check (post_id <> related_post_id)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text not null,
  company_name text not null,
  quote text not null,
  approval_proof_note text,
  is_approved boolean not null default false,
  status public.cms_status_t not null default 'draft',
  sort_order integer not null default 0,
  constraint chk_testimonial_approval check (
    status <> 'published' or is_approved = true
  )
);

create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  destination_path text not null,
  status_code public.redirect_code_t not null default '301',
  is_active boolean not null default true,
  check (source_path <> destination_path)
);

create index idx_redirects_active on public.redirects (source_path) where is_active = true;

create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext not null,
  phone text,
  company_name text,
  service_interest text not null,
  budget_bracket text,
  preferred_channel text not null default 'email',
  message text not null,
  source_page text not null default '/contact',
  ip_hash text,
  privacy_consented_at timestamptz not null default now(),
  retention_expires_at timestamptz not null default (now() + interval '24 months'),
  created_at timestamptz not null default now()
);

create index idx_enquiries_created on public.contact_enquiries (created_at desc);
create index idx_enquiries_retention on public.contact_enquiries (retention_expires_at);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  status public.subscriber_status_t not null default 'pending',
  resend_contact_id text,
  confirm_token_hash text,
  confirmed_at timestamptz,
  unsubscribe_token_hash text unique,
  consent_source text not null default 'footer',
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index idx_newsletter_status on public.newsletter_subscribers (status);

create table public.broadcast_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  segment_filter jsonb not null default '{}'::jsonb,
  body_markdown text not null,
  resend_broadcast_id text,
  status text not null default 'draft',
  sent_count integer not null default 0,
  created_by uuid references public.users(id) on delete set null,
  sent_by uuid references public.users(id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.email_suppressions (
  email citext primary key,
  reason text not null,
  source_event_id text,
  suppressed_at timestamptz not null default now()
);

create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  provider_message_id text,
  email_kind public.email_kind_t not null default 'transactional',
  priority public.email_priority_t not null default 'high',
  recipient_email citext not null,
  template_key text not null,
  status public.email_status_t not null default 'queued',
  retry_count integer not null default 0,
  next_retry_at timestamptz,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_email_events_provider on public.email_events (provider_message_id);
create index idx_email_events_retry on public.email_events (status, next_retry_at);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  portal text not null,
  title text not null,
  body text not null,
  link_href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_unread on public.notifications (user_id, created_at desc) where read_at is null;
