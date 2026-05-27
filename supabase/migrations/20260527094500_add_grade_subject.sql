-- Add grade/subject dimensions for classes, sessions, mastery, and materials

create type public.grade_level as enum (
  'G1','G2','G3','G4','G5','G6',
  'G7','G8','G9',
  'G10','G11','G12'
);

create type public.subject_type as enum (
  'math',
  'english',
  'chinese',
  'science',
  'social'
);

alter table public.classes
  add column grade public.grade_level;

alter table public.learning_sessions
  add column subject public.subject_type;

alter table public.question_attempts
  add column subject public.subject_type;

alter table public.mastery_nodes
  add column subject public.subject_type;

alter table public.material_uploads
  add column subject public.subject_type;

create index if not exists classes_grade_idx
  on public.classes (grade);

create index if not exists learning_sessions_subject_idx
  on public.learning_sessions (subject);

create index if not exists mastery_nodes_subject_idx
  on public.mastery_nodes (subject);

