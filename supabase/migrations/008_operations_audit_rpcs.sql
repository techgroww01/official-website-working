-- 008_operations_audit_rpcs.sql
-- Immutable Audit Logs, Settings, Idempotency Keys, Webhooks, Auth Hooks & Atomic RPCs

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.users(id) on delete set null,
  actor_roles text[] not null default '{}',
  action varchar(96) not null,
  resource_type varchar(64) not null,
  resource_id varchar(128) not null,
  changed_fields text[] not null default '{}',
  redacted_diff jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_audit_resource on public.audit_logs (resource_type, resource_id);
create index idx_audit_created on public.audit_logs (created_at desc);

-- Enforce strict append-only audit log semantics
revoke update, delete, truncate on public.audit_logs from anon, authenticated, public;

create table public.system_settings (
  key varchar(128) primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_by uuid references public.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.idempotency_keys (
  key text not null,
  route text not null,
  actor_user_id uuid references public.users(id) on delete set null,
  request_hash text not null,
  response_status integer not null,
  response_body jsonb not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(),
  primary key (key, route)
);

create index idx_idempotency_expires on public.idempotency_keys (expires_at);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('resend', 'google')),
  external_event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz not null default now(),
  error text,
  unique (provider, external_event_id)
);

-- Atomic Public Enquiry -> Sales Lead RPC
create or replace function public.create_enquiry_with_lead(
  p_full_name text,
  p_email citext,
  p_phone text,
  p_company_name text,
  p_service_interest text,
  p_budget_bracket text,
  p_preferred_channel text,
  p_message text,
  p_source_page text,
  p_ip_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_enquiry_id uuid;
  v_lead_id uuid;
begin
  insert into public.contact_enquiries (
    full_name, email, phone, company_name, service_interest,
    budget_bracket, preferred_channel, message, source_page, ip_hash
  ) values (
    p_full_name, p_email, p_phone, p_company_name, p_service_interest,
    p_budget_bracket, coalesce(nullif(p_preferred_channel, ''), 'email'), p_message,
    coalesce(nullif(p_source_page, ''), '/contact'), p_ip_hash
  )
  returning id into v_enquiry_id;

  insert into public.leads (
    enquiry_id, company_name, full_name, email, phone,
    service_interest, budget_bracket, stage, source
  ) values (
    v_enquiry_id, p_company_name, p_full_name, p_email, p_phone,
    p_service_interest, p_budget_bracket, 'new', 'website_contact'
  )
  returning id into v_lead_id;

  insert into public.audit_logs (
    actor_user_id, actor_roles, action, resource_type, resource_id, changed_fields, ip_hash
  ) values (
    null, array['public'], 'ENQUIRY_CREATED', 'lead', v_lead_id::text,
    array['enquiry_id', 'service_interest', 'stage'], p_ip_hash
  );

  return jsonb_build_object('enquiryId', v_enquiry_id, 'leadId', v_lead_id);
end;
$$;

revoke all on function public.create_enquiry_with_lead(text, citext, text, text, text, text, text, text, text, text) from public;
grant execute on function public.create_enquiry_with_lead(text, citext, text, text, text, text, text, text, text, text) to service_role;

-- Atomic Candidate Application Intake RPC (includes committed resume media_asset)
create or replace function public.create_application(
  p_posting_id uuid,
  p_full_name text,
  p_email citext,
  p_phone text,
  p_linkedin_url text,
  p_portfolio_url text,
  p_cover_note text,
  p_storage_bucket text,
  p_storage_path text,
  p_mime_type text,
  p_byte_size integer,
  p_talent_pool_consent boolean,
  p_status_token_hash text,
  p_ip_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_asset_id uuid;
  v_app_id uuid;
begin
  if not exists (
    select 1 from public.job_postings
    where id = p_posting_id and status = 'open' and deleted_at is null
  ) then
    raise exception 'JOB_NOT_OPEN';
  end if;

  insert into public.media_assets (
    bucket, storage_path, mime_type, byte_size, alt_text, is_decorative, folder
  ) values (
    p_storage_bucket, p_storage_path, p_mime_type, p_byte_size, 'Candidate resume document', true, 'resumes'
  )
  returning id into v_asset_id;

  insert into public.applications (
    posting_id, full_name, email, phone, linkedin_url, portfolio_url,
    cover_note, resume_asset_id, stage, talent_pool_consent, status_token_hash
  ) values (
    p_posting_id, p_full_name, p_email, p_phone, p_linkedin_url, p_portfolio_url,
    p_cover_note, v_asset_id, 'applied', coalesce(p_talent_pool_consent, false), p_status_token_hash
  )
  returning id into v_app_id;

  insert into public.audit_logs (
    actor_user_id, actor_roles, action, resource_type, resource_id, changed_fields, ip_hash
  ) values (
    null, array['public'], 'APPLICATION_SUBMITTED', 'application', v_app_id::text,
    array['posting_id', 'stage'], p_ip_hash
  );

  return jsonb_build_object('applicationId', v_app_id, 'assetId', v_asset_id);
end;
$$;

revoke all on function public.create_application(uuid, text, citext, text, text, text, text, text, text, text, integer, boolean, text, text) from public;
grant execute on function public.create_application(uuid, text, citext, text, text, text, text, text, text, text, integer, boolean, text, text) to service_role;

-- Atomic Won Opportunity -> Client Project Conversion RPC
create or replace function public.convert_opportunity_to_project(
  p_opp_id uuid,
  p_project_code text,
  p_ops_manager_id uuid,
  p_actor_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_opp public.opportunities%rowtype;
  v_project_id uuid;
begin
  select * into v_opp from public.opportunities where id = p_opp_id for update;
  if not found then
    raise exception 'OPPORTUNITY_NOT_FOUND';
  end if;

  select id into v_project_id from public.client_projects where opportunity_id = p_opp_id;
  if found then
    return jsonb_build_object('projectId', v_project_id, 'organizationId', v_opp.organization_id, 'alreadyConverted', true);
  end if;

  update public.opportunities set pipeline_stage = 'won' where id = p_opp_id;
  update public.organizations set org_type = 'client' where id = v_opp.organization_id;

  insert into public.client_projects (
    organization_id, opportunity_id, name, code, current_phase, status, operations_manager_id, start_date
  ) values (
    v_opp.organization_id, p_opp_id, v_opp.title, p_project_code, 'Discovery', 'onboarding', p_ops_manager_id, current_date
  )
  returning id into v_project_id;

  insert into public.project_milestones (project_id, title, description, sort_order, status)
  values
    (v_project_id, '01 Understand & Discovery Sign-off', 'Architecture baseline, requirements alignment, and sprint kickoff.', 1, 'in_progress'),
    (v_project_id, '02 Architect & Experience Prototype', 'Relational schema, technical interfaces, and UI specifications.', 2, 'not_started'),
    (v_project_id, '03 Core Engineering Build', 'Iterative production implementation and staging previews.', 3, 'not_started');

  insert into public.audit_logs (
    actor_user_id, actor_roles, action, resource_type, resource_id, changed_fields
  ) values (
    p_actor_id, array['sales_manager'], 'OPPORTUNITY_CONVERTED', 'client_project', v_project_id::text,
    array['opportunity_id', 'organization_id', 'pipeline_stage']
  );

  return jsonb_build_object('projectId', v_project_id, 'organizationId', v_opp.organization_id, 'alreadyConverted', false);
end;
$$;

revoke all on function public.convert_opportunity_to_project(uuid, text, uuid, uuid) from public;
grant execute on function public.convert_opportunity_to_project(uuid, text, uuid, uuid) to service_role;

-- Supabase Auth Hooks (Registered in Supabase Dashboard -> Auth -> Hooks)
create or replace function public.auth_hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email citext;
  v_provider text;
  v_hd text;
begin
  v_email := (event -> 'user' ->> 'email')::citext;
  v_provider := coalesce(event -> 'user' -> 'app_metadata' ->> 'provider', 'email');
  v_hd := coalesce(event -> 'user' -> 'user_metadata' ->> 'hd', '');

  if v_provider = 'google' then
    if lower(v_hd) <> 'techgroww.co.in' then
      return jsonb_build_object('error', jsonb_build_object('http_code', 403, 'message', 'Google Workspace domain @techgroww.co.in required.'));
    end if;

    if not exists (select 1 from public.users where email = v_email and status in ('invited', 'active') and deleted_at is null)
       and not exists (select 1 from public.invitations where email = v_email and accepted_at is null and revoked_at is null and expires_at > now()) then
      return jsonb_build_object('error', jsonb_build_object('http_code', 403, 'message', 'Pre-invited Tech Groww account required.'));
    end if;
  end if;

  return '{}'::jsonb;
end;
$$;

create or replace function public.auth_hook_custom_claims(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_claims jsonb;
  v_session_version integer;
begin
  v_user_id := (event ->> 'user_id')::uuid;
  v_claims := coalesce(event -> 'claims', '{}'::jsonb);

  select session_version into v_session_version
  from public.users
  where id = v_user_id and deleted_at is null;

  if v_session_version is not null then
    v_claims := jsonb_set(v_claims, '{session_version}', to_jsonb(v_session_version));
  end if;

  return jsonb_build_object('claims', v_claims);
end;
$$;

revoke all on function public.auth_hook_before_user_created(jsonb) from public;
revoke all on function public.auth_hook_custom_claims(jsonb) from public;
grant execute on function public.auth_hook_before_user_created(jsonb) to supabase_auth_admin;
grant execute on function public.auth_hook_custom_claims(jsonb) to supabase_auth_admin;
