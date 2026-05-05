-- ============================================================================
-- Bolig Norge — Supabase database schema
-- ============================================================================
-- Run this once in Supabase SQL Editor to set up the project.
-- After running, manually create the storage bucket via the steps at the end.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES table
--    Mirrors auth.users with extra fields (role, full_name).
--    Trigger keeps it in sync automatically on signup.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'board' check (role in ('admin','board')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'role', 'board')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. REPORTS table
--    Board reports, financial documents, board meeting minutes etc.
--    `file_path` references an object in the 'reports' storage bucket.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  summary       text,
  kind          text not null default 'Rapport',  -- 'Kvartalsrapport' | 'Årsrapport' | 'Styremøte' | 'Notat' | 'Rapport'
  period        text,                              -- 'Q1 2026', '2025' etc.
  file_path     text,                              -- path inside 'reports' storage bucket
  published_at  timestamptz not null default now(),
  created_by    uuid references auth.users on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists reports_published_at_idx
  on public.reports (published_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.reports  enable row level security;

-- profiles: every authenticated user can read all profiles
-- (so admin can see the user list, board members can see who else is on board)
drop policy if exists "profiles_select_authed" on public.profiles;
create policy "profiles_select_authed"
  on public.profiles for select
  to authenticated
  using (true);

-- profiles: a user can update their own profile (full_name only — role is
-- set by admin via service role / SQL)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- reports: any authenticated user with role 'admin' or 'board' can read
drop policy if exists "reports_select_authed" on public.reports;
create policy "reports_select_authed"
  on public.reports for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin','board')
    )
  );

-- reports: only admins can insert/update/delete
drop policy if exists "reports_admin_write" on public.reports;
create policy "reports_admin_write"
  on public.reports for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. STORAGE BUCKET POLICY (for the 'reports' bucket — create it first via UI)
--    Bucket should be PRIVATE (not public). Files are accessed via signed URLs.
-- ─────────────────────────────────────────────────────────────────────────────
-- After creating the 'reports' bucket in Supabase Storage UI:

-- Anyone authenticated with role 'admin' or 'board' can read files
drop policy if exists "reports_storage_read" on storage.objects;
create policy "reports_storage_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'reports'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin','board')
    )
  );

-- Only admin can upload/delete report files
drop policy if exists "reports_storage_admin_write" on storage.objects;
create policy "reports_storage_admin_write"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'reports'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    bucket_id = 'reports'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. PROMOTE A USER TO ADMIN
--    Run this AFTER you have created your own user account via the
--    Supabase dashboard (Authentication → Add user) or via the login flow.
--    Replace the email below with your actual admin email.
-- ─────────────────────────────────────────────────────────────────────────────
-- update public.profiles
--   set role = 'admin', full_name = 'Pål Morten Oxaal'
--   where email = 'pal.oxaal@bolignorge.no';
