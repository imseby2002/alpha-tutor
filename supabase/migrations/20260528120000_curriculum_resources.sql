-- Create a flexible curriculum resource schema for Taiwan-first metadata with multi-country support.
-- This table stores textbooks, question banks, exams, lesson notes, and related curriculum resources.

create type public.curriculum_resource_type as enum (
  'textbook',
  'question_bank',
  'exam',
  'lesson_notes',
  'reference'
);

create extension if not exists pgcrypto;

create table public.curriculum_resources (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  grade text not null,
  subject text not null,
  resource_type public.curriculum_resource_type not null,
  title text not null,
  publisher text,
  year int,
  source_url text,
  license text,
  file_size_bytes bigint,
  storage_path text,
  language text default 'zh-TW',
  metadata jsonb default '{}'::jsonb,
  description text,
  created_by uuid null references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index curriculum_resources_unique_source on public.curriculum_resources (country_code, grade, subject, resource_type, title);

create function public.curriculum_resources_updated_at_trigger()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_curriculum_resources_updated_at
before update on public.curriculum_resources
for each row
execute function public.curriculum_resources_updated_at_trigger();
