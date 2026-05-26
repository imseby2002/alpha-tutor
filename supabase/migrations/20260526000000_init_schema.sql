-- Alpha Tutor initial schema
-- Run in Supabase Dashboard → SQL Editor, or: supabase db push

create extension if not exists "pgcrypto";

create type public.user_role as enum (
  'student',
  'guide',
  'parent',
  'admin'
);

create type public.mastery_status as enum (
  'locked',
  'in_progress',
  'mastered'
);

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'student',
  level int not null default 1 check (level >= 1),
  xp int not null default 0 check (xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create table public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  topic text not null,
  mode text not null check (mode in ('diagnostic', 'teaching', 'adaptive')),
  xp_earned int not null default 0 check (xp_earned >= 0),
  focus_score numeric(5, 2) check (focus_score >= 0 and focus_score <= 100),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.learning_sessions (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  question_text text not null,
  selected_option text,
  is_correct boolean,
  difficulty text,
  created_at timestamptz not null default now()
);

create table public.mastery_nodes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  node_key text not null,
  label text not null,
  status public.mastery_status not null default 'locked',
  updated_at timestamptz not null default now(),
  unique (student_id, node_key)
);

create table public.material_uploads (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references public.profiles (id) on delete cascade,
  class_id uuid references public.classes (id) on delete set null,
  file_name text not null,
  storage_path text,
  status text not null default 'processing' check (status in ('processing', 'ready', 'failed')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.question_attempts enable row level security;
alter table public.mastery_nodes enable row level security;
alter table public.material_uploads enable row level security;

-- Profiles: read/update own row
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Guides see students in their classes
create policy "profiles_select_class_students"
  on public.profiles for select
  using (
    exists (
      select 1 from public.classes c
      join public.enrollments e on e.class_id = c.id
      where c.guide_id = auth.uid() and e.student_id = profiles.id
    )
  );

-- Classes: guide owns
create policy "classes_guide_all"
  on public.classes for all
  using (guide_id = auth.uid())
  with check (guide_id = auth.uid());

-- Enrollments: guide of class or enrolled student
create policy "enrollments_select"
  on public.enrollments for select
  using (
    student_id = auth.uid()
    or exists (
      select 1 from public.classes c
      where c.id = enrollments.class_id and c.guide_id = auth.uid()
    )
  );

create policy "enrollments_guide_insert"
  on public.enrollments for insert
  with check (
    exists (
      select 1 from public.classes c
      where c.id = class_id and c.guide_id = auth.uid()
    )
  );

-- Learning sessions: student owns
create policy "learning_sessions_student_all"
  on public.learning_sessions for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy "learning_sessions_guide_select"
  on public.learning_sessions for select
  using (
    exists (
      select 1 from public.enrollments e
      join public.classes c on c.id = e.class_id
      where e.student_id = learning_sessions.student_id and c.guide_id = auth.uid()
    )
  );

-- Question attempts: student owns
create policy "question_attempts_student_all"
  on public.question_attempts for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Mastery nodes: student owns
create policy "mastery_nodes_student_all"
  on public.mastery_nodes for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Material uploads: uploader or class guide
create policy "material_uploads_select"
  on public.material_uploads for select
  using (
    uploaded_by = auth.uid()
    or exists (
      select 1 from public.classes c
      where c.id = material_uploads.class_id and c.guide_id = auth.uid()
    )
  );

create policy "material_uploads_insert"
  on public.material_uploads for insert
  with check (uploaded_by = auth.uid());

-- Seed default mastery nodes for new students (optional trigger)
create or replace function public.seed_mastery_nodes_for_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'student' then
    insert into public.mastery_nodes (student_id, node_key, label, status) values
      (new.id, 'math-1', 'Basic Addition', 'mastered'),
      (new.id, 'math-2', 'Fractions', 'mastered'),
      (new.id, 'math-3', 'Algebra Basics', 'in_progress'),
      (new.id, 'math-4', 'Quadratic Equations', 'locked'),
      (new.id, 'math-5', 'Calculus Intro', 'locked');
  end if;
  return new;
end;
$$;

create trigger on_profile_created_seed_mastery
  after insert on public.profiles
  for each row execute function public.seed_mastery_nodes_for_student();
