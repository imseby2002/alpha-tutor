-- Accounts: role on signup, parent-child links, student link codes, guide default class

alter table public.profiles
  add column if not exists link_code text;

create unique index if not exists profiles_link_code_uidx
  on public.profiles (link_code)
  where link_code is not null;

-- Parent ↔ Student (one parent, many children)
create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (parent_id, student_id),
  check (parent_id <> student_id)
);

alter table public.parent_student_links enable row level security;

create or replace function public.generate_link_code()
returns text
language plpgsql
as $$
declare
  code text;
begin
  loop
    code := upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 8));
    exit when not exists (select 1 from public.profiles where link_code = code);
  end loop;
  return code;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_role public.user_role;
  meta_role text;
begin
  meta_role := new.raw_user_meta_data ->> 'role';
  chosen_role := case
    when meta_role in ('student', 'guide', 'parent') then meta_role::public.user_role
    else 'student'::public.user_role
  end;

  insert into public.profiles (id, display_name, role, link_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    chosen_role,
    public.generate_link_code()
  );
  return new;
end;
$$;

-- Default class for new guides
create or replace function public.create_default_class_for_guide()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'guide' then
    insert into public.classes (guide_id, name)
    values (new.id, coalesce(new.display_name, '我的班級') || ' · 預設班');
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_created_default_class on public.profiles;
create trigger on_profile_created_default_class
  after insert on public.profiles
  for each row execute function public.create_default_class_for_guide();

-- Backfill link codes for existing profiles
update public.profiles
set link_code = public.generate_link_code()
where link_code is null;

alter table public.profiles
  alter column link_code set not null;

-- RLS: parent_student_links
create policy "parent_links_select_own"
  on public.parent_student_links for select
  using (parent_id = auth.uid() or student_id = auth.uid());

create policy "parent_links_insert_own"
  on public.parent_student_links for insert
  with check (parent_id = auth.uid());

create policy "parent_links_delete_own"
  on public.parent_student_links for delete
  using (parent_id = auth.uid());

-- Parents can read linked student profiles
create policy "profiles_select_linked_children"
  on public.profiles for select
  using (
    exists (
      select 1 from public.parent_student_links psl
      where psl.parent_id = auth.uid() and psl.student_id = profiles.id
    )
  );

-- RPC: parent links child by code
create or replace function public.link_child_by_code(p_code text)
returns table (student_id uuid, display_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_role public.user_role;
  v_student_id uuid;
  v_name text;
begin
  select role into v_parent_role from public.profiles where id = auth.uid();
  if v_parent_role is distinct from 'parent' then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  select id, profiles.display_name
  into v_student_id, v_name
  from public.profiles
  where link_code = upper(trim(p_code)) and role = 'student';

  if v_student_id is null then
    raise exception 'invalid_code' using errcode = 'P0001';
  end if;

  insert into public.parent_student_links (parent_id, student_id)
  values (auth.uid(), v_student_id)
  on conflict (parent_id, student_id) do nothing;

  return query select v_student_id, v_name;
end;
$$;

grant execute on function public.link_child_by_code(text) to authenticated;

-- RPC: guide enrolls student into a class by link code
create or replace function public.enroll_student_by_code(p_class_id uuid, p_code text)
returns table (student_id uuid, display_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_guide_role public.user_role;
  v_student_id uuid;
  v_name text;
begin
  select role into v_guide_role from public.profiles where id = auth.uid();
  if v_guide_role is distinct from 'guide' then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.classes c
    where c.id = p_class_id and c.guide_id = auth.uid()
  ) then
    raise exception 'invalid_class' using errcode = 'P0001';
  end if;

  select id, profiles.display_name
  into v_student_id, v_name
  from public.profiles
  where link_code = upper(trim(p_code)) and role = 'student';

  if v_student_id is null then
    raise exception 'invalid_code' using errcode = 'P0001';
  end if;

  insert into public.enrollments (class_id, student_id)
  values (p_class_id, v_student_id)
  on conflict (class_id, student_id) do nothing;

  return query select v_student_id, v_name;
end;
$$;

grant execute on function public.enroll_student_by_code(uuid, text) to authenticated;
