alter table public.branches
  add column if not exists custom_links jsonb not null default '[]'::jsonb;

alter table public.branches
  drop constraint if exists branches_custom_links_is_array;

alter table public.branches
  add constraint branches_custom_links_is_array
  check (jsonb_typeof(custom_links) = 'array');

comment on column public.branches.custom_links is
  'Array of custom links. Each item is expected to contain a label and URL.';
