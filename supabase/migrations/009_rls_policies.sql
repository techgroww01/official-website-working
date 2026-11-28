-- 009_rls_policies.sql
-- Non-Recursive SECURITY DEFINER RLS Helpers + 100% Table RLS Coverage

create or replace function public.app_is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = (select auth.uid())
      and u.status = 'active'
      and u.deleted_at is null
      and u.session_version = coalesce(
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'session_version')::integer,
        u.session_version
      )
  );
$$;

create or replace function public.app_has_permission(p_resource text, p_action text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.app_is_active_user() and exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = (select auth.uid())
      and (
        r.slug = 'super_admin'
        or (p.resource = p_resource and p.action = p_action)
      )
  );
$$;

create or replace function public.app_is_org_member(p_org_id uuid, p_roles text[] default array['client_admin', 'client_member', 'client_viewer'])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.app_is_active_user() and exists (
    select 1
    from public.organization_members om
    where om.organization_id = p_org_id
      and om.user_id = (select auth.uid())
      and om.org_role::text = any(p_roles)
  );
$$;

-- Enable RLS on ALL tables (100% coverage)
alter table public.users enable row level security;
alter table public.media_assets enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.invitations enable row level security;
alter table public.pages enable row level security;
alter table public.page_versions enable row level security;
alter table public.navigation_items enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.portfolio_gallery_assets enable row level security;
alter table public.service_portfolio_links enable row level security;
alter table public.team_members enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_relations enable row level security;
alter table public.testimonials enable row level security;
alter table public.redirects enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.broadcast_campaigns enable row level security;
alter table public.email_suppressions enable row level security;
alter table public.email_events enable row level security;
alter table public.notifications enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.opportunities enable row level security;
alter table public.proposals enable row level security;
alter table public.sales_activities enable row level security;
alter table public.client_projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.deliverables enable row level security;
alter table public.project_files enable row level security;
alter table public.project_messages enable row level security;
alter table public.support_tickets enable row level security;
alter table public.ticket_comments enable row level security;
alter table public.billing_records enable row level security;
alter table public.job_postings enable row level security;
alter table public.applications enable row level security;
alter table public.interviews enable row level security;
alter table public.recruitment_notes enable row level security;
alter table public.offers enable row level security;
alter table public.internship_programs enable row level security;
alter table public.intern_enrollments enable row level security;
alter table public.cohort_announcements enable row level security;
alter table public.intern_tasks enable row level security;
alter table public.task_submissions enable row level security;
alter table public.intern_attendance enable row level security;
alter table public.certificates enable row level security;
alter table public.audit_logs enable row level security;
alter table public.system_settings enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.webhook_events enable row level security;

-- Core Identity & Notifications Policies
create policy "users_self_read" on public.users for select to authenticated
  using (id = (select auth.uid()) or public.app_has_permission('users', 'read'));

create policy "users_self_prefs_update" on public.users for update to authenticated
  using (id = (select auth.uid()) and public.app_is_active_user())
  with check (id = (select auth.uid()) and public.app_is_active_user());

create policy "notifications_own_read" on public.notifications for select to authenticated
  using (user_id = (select auth.uid()) and public.app_is_active_user());

create policy "notifications_own_update" on public.notifications for update to authenticated
  using (user_id = (select auth.uid()) and public.app_is_active_user())
  with check (user_id = (select auth.uid()) and public.app_is_active_user());

-- Public CMS Read Policies
create policy "public_pages_read" on public.pages for select to anon, authenticated
  using ((status = 'published' and deleted_at is null) or public.app_has_permission('cms_pages', 'read'));

create policy "public_nav_read" on public.navigation_items for select to anon, authenticated
  using (is_active = true or public.app_has_permission('navigation_seo', 'read'));

create policy "public_services_read" on public.services for select to anon, authenticated
  using ((status = 'published' and deleted_at is null) or public.app_has_permission('services', 'read'));

create policy "public_portfolio_read" on public.portfolio_items for select to anon, authenticated
  using ((status = 'published' and (project_type <> 'client_project' or is_client_approved = true)) or public.app_has_permission('portfolio', 'read'));

create policy "public_team_read" on public.team_members for select to anon, authenticated
  using (is_public = true or public.app_has_permission('team_testimonials', 'read'));

create policy "public_blog_cat_read" on public.blog_categories for select to anon, authenticated using (true);

create policy "public_blog_posts_read" on public.blog_posts for select to anon, authenticated
  using ((status = 'published' and deleted_at is null and published_at <= now()) or public.app_has_permission('blog', 'read'));

create policy "public_testimonials_read" on public.testimonials for select to anon, authenticated
  using ((status = 'published' and is_approved = true) or public.app_has_permission('team_testimonials', 'read'));

create policy "public_redirects_read" on public.redirects for select to anon, authenticated
  using (is_active = true or public.app_has_permission('navigation_seo', 'read'));

create policy "public_jobs_read" on public.job_postings for select to anon, authenticated
  using ((status = 'open' and deleted_at is null) or public.app_has_permission('jobs', 'read'));

create policy "public_settings_read" on public.system_settings for select to anon, authenticated
  using (is_public = true or public.app_has_permission('settings', 'read'));

-- Client Portal Strict Organization Isolation Policies
create policy "client_org_read" on public.organizations for select to authenticated
  using (public.app_is_org_member(id) or public.app_has_permission('contacts_orgs', 'read') or public.app_has_permission('client_projects', 'read'));

create policy "client_projects_tenant_read" on public.client_projects for select to authenticated
  using (public.app_is_org_member(organization_id) or public.app_has_permission('client_projects', 'read'));

create policy "client_milestones_tenant_read" on public.project_milestones for select to authenticated
  using (
    exists (
      select 1 from public.client_projects cp
      where cp.id = project_id and (public.app_is_org_member(cp.organization_id) or public.app_has_permission('client_projects', 'read'))
    )
  );

create policy "client_deliverables_tenant_read" on public.deliverables for select to authenticated
  using (
    exists (
      select 1 from public.project_milestones pm
      join public.client_projects cp on cp.id = pm.project_id
      where pm.id = milestone_id and (public.app_is_org_member(cp.organization_id) or public.app_has_permission('deliverables', 'read'))
    )
  );

create policy "client_tickets_tenant_read" on public.support_tickets for select to authenticated
  using (public.app_is_org_member(organization_id) or public.app_has_permission('tickets', 'read'));

create policy "client_ticket_comments_read" on public.ticket_comments for select to authenticated
  using (
    exists (
      select 1 from public.support_tickets st
      where st.id = ticket_id and (
        (public.app_is_org_member(st.organization_id) and is_internal = false)
        or public.app_has_permission('tickets', 'manage')
      )
    )
  );

-- Billing: STRICTLY client_admin (own org) + Ops/Admin — denied to client_member/viewer!
create policy "client_billing_admin_only_read" on public.billing_records for select to authenticated
  using (
    public.app_is_org_member(organization_id, array['client_admin'])
    or public.app_has_permission('billing', 'read')
  );

-- Sales Leads & Opportunities Isolation
create policy "sales_leads_scoped_read" on public.leads for select to authenticated
  using (
    public.app_has_permission('leads', 'manage')
    or public.app_has_permission('leads', 'assign')
    or (public.app_has_permission('leads', 'read') and (assigned_to = (select auth.uid()) or assigned_to is null))
  );

create policy "sales_opps_scoped_read" on public.opportunities for select to authenticated
  using (
    public.app_has_permission('opportunities', 'manage')
    or public.app_has_permission('opportunities', 'export')
    or (public.app_has_permission('opportunities', 'read') and owner_id = (select auth.uid()))
  );

-- Recruitment & Confidential Notes Isolation
create policy "recruitment_notes_hr_only" on public.recruitment_notes for select to authenticated
  using (public.app_has_permission('recruitment_notes', 'read'));

-- Intern Cohort & Individual Isolation
create policy "intern_enrollments_scoped_read" on public.intern_enrollments for select to authenticated
  using (
    user_id = (select auth.uid())
    or mentor_id = (select auth.uid())
    or public.app_has_permission('intern_enrollment', 'manage')
  );

create policy "intern_tasks_scoped_read" on public.intern_tasks for select to authenticated
  using (
    exists (
      select 1 from public.intern_enrollments ie
      where ie.id = enrollment_id and (
        ie.user_id = (select auth.uid())
        or ie.mentor_id = (select auth.uid())
        or public.app_has_permission('intern_tasks', 'manage')
      )
    )
  );

create policy "task_submissions_scoped_read" on public.task_submissions for select to authenticated
  using (
    submitted_by = (select auth.uid())
    or exists (
      select 1 from public.intern_tasks it
      join public.intern_enrollments ie on ie.id = it.enrollment_id
      where it.id = task_id and (ie.mentor_id = (select auth.uid()) or public.app_has_permission('task_submissions', 'export'))
    )
  );

-- Audit Logs Read-Only (No Update/Delete for anyone)
create policy "audit_logs_read_policy" on public.audit_logs for select to authenticated
  using (public.app_has_permission('audit_logs', 'audit'));
