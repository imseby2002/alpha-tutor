-- ============================================================
-- 註冊出現 "Database error saving new user" 時執行此檔
-- Supabase Dashboard → SQL Editor → 貼上整份 → Run
-- ============================================================

create extension if not exists "pgcrypto";

alter table public.profiles
  add column if not exists link_code text;

create or replace function public.generate_link_code()
returns text
language plpgsql
as $$
declare
  code text;
begin
  loop
    code := upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 8));
    exit when not exists (
      select 1 from public.profiles p where p.link_code = code
    );
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
  v_link_code text;
begin
  meta_role := new.raw_user_meta_data ->> 'role';
  chosen_role := case
    when meta_role in ('student', 'guide', 'parent') then meta_role::public.user_role
    else 'student'::public.user_role
  end;

  v_link_code := public.generate_link_code();

  insert into public.profiles (id, display_name, role, link_code)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      '使用者'
    ),
    chosen_role,
    v_link_code
  )
  on conflict (id) do update
    set
      display_name = excluded.display_name,
      role = excluded.role,
      link_code = coalesce(public.profiles.link_code, excluded.link_code);

  return new;
exception
  when others then
    raise exception 'handle_new_user failed: %', sqlerrm;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.seed_mastery_nodes_for_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'student' then
    insert into public.mastery_nodes (student_id, node_key, label, status) values
      (new.id, 'math-1', '基礎加法', 'mastered'),
      (new.id, 'math-2', '分數', 'mastered'),
      (new.id, 'math-3', '代數基礎', 'in_progress'),
      (new.id, 'math-4', '二次方程式', 'locked'),
      (new.id, 'math-5', '微積分入門', 'locked')
    on conflict (student_id, node_key) do nothing;
  end if;
  return new;
exception
  when others then
    raise warning 'seed_mastery_nodes_for_student: %', sqlerrm;
    return new;
end;
$$;

create or replace function public.create_default_class_for_guide()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'guide' then
    insert into public.classes (guide_id, name)
    values (
      new.id,
      coalesce(nullif(trim(new.display_name), ''), '我的班級') || ' · 預設班'
    );
  end if;
  return new;
exception
  when others then
    raise warning 'create_default_class_for_guide: %', sqlerrm;
    return new;
end;
$$;

update public.profiles
set link_code = public.generate_link_code()
where link_code is null;

alter table public.profiles
  alter column link_code set not null;
