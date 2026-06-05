-- curriculum_resources had RLS enabled but no policies, so every read through a
-- user/anon session returned zero rows. These are public curriculum materials,
-- so allow read access to everyone (anon + authenticated).

create policy "curriculum_resources_public_read"
  on public.curriculum_resources
  for select
  using (true);
