create extension if not exists pgcrypto;

create table public.notebook_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  resource_id uuid not null references public.curriculum_resources(id) on delete cascade,
  note_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, resource_id)
);

create function public.notebook_entries_updated_at_trigger()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_notebook_entries_updated_at
before update on public.notebook_entries
for each row
execute function public.notebook_entries_updated_at_trigger();

alter table public.notebook_entries enable row level security;

create policy "notebook_entries_select_own"
  on public.notebook_entries for select
  using (student_id = auth.uid());

create policy "notebook_entries_insert_own"
  on public.notebook_entries for insert
  with check (student_id = auth.uid());

create policy "notebook_entries_update_own"
  on public.notebook_entries for update
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy "notebook_entries_delete_own"
  on public.notebook_entries for delete
  using (student_id = auth.uid());
