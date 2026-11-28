-- 001_extensions_and_enums.sql
-- Tech Groww Greenfield Relational Schema — Extensions & Canonical Enums

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.account_class_t as enum ('staff', 'client', 'intern', 'candidate');
create type public.user_status_t as enum ('invited', 'active', 'suspended');
create type public.org_type_t as enum ('client', 'prospect', 'partner');
create type public.org_role_t as enum ('client_admin', 'client_member', 'client_viewer');
create type public.cms_status_t as enum ('draft', 'in_review', 'scheduled', 'published', 'archived');
create type public.project_type_t as enum ('client_project', 'internal_product', 'reference_blueprint');
create type public.redirect_code_t as enum ('301', '302', '410');
create type public.subscriber_status_t as enum ('pending', 'active', 'unsubscribed', 'bounced', 'complained');
create type public.email_kind_t as enum ('transactional', 'broadcast');
create type public.email_priority_t as enum ('critical', 'high', 'medium');
create type public.email_status_t as enum ('queued', 'deferred_quota', 'sent', 'delivered', 'bounced', 'complained', 'failed');
create type public.lead_stage_t as enum ('new', 'contacted', 'qualified', 'disqualified', 'converted');
create type public.opportunity_stage_t as enum ('discovery', 'scoping', 'proposal_sent', 'negotiation', 'won', 'lost');
create type public.proposal_status_t as enum ('draft', 'sent', 'accepted', 'declined');
create type public.sales_activity_t as enum ('call', 'email', 'whatsapp', 'meeting', 'note');
create type public.delivery_phase_t as enum ('Discovery', 'Architecture', 'Development', 'QA', 'Launch');
create type public.client_project_status_t as enum ('onboarding', 'active', 'on_hold', 'completed', 'archived');
create type public.milestone_status_t as enum ('not_started', 'in_progress', 'in_review', 'approved');
create type public.deliverable_review_t as enum ('pending', 'approved', 'changes_requested');
create type public.project_file_cat_t as enum ('contract', 'architecture', 'design', 'report');
create type public.ticket_priority_t as enum ('low', 'medium', 'high', 'urgent');
create type public.ticket_status_t as enum ('open', 'in_progress', 'waiting_on_client', 'resolved', 'closed');
create type public.billing_status_t as enum ('draft', 'issued', 'paid', 'void');
create type public.posting_kind_t as enum ('job', 'internship');
create type public.posting_status_t as enum ('draft', 'open', 'paused', 'closed');
create type public.application_stage_t as enum ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn');
create type public.interview_status_t as enum ('scheduled', 'completed', 'cancelled', 'no_show');
create type public.recruitment_note_t as enum ('screening', 'scorecard', 'general');
create type public.offer_status_t as enum ('draft', 'sent', 'accepted', 'declined', 'expired');
create type public.cohort_status_t as enum ('planned', 'active', 'completed');
create type public.enrollment_status_t as enum ('active', 'completed', 'exited');
create type public.intern_task_status_t as enum ('todo', 'in_progress', 'submitted', 'revision_requested', 'completed');
create type public.attendance_status_t as enum ('present', 'absent', 'excused');
