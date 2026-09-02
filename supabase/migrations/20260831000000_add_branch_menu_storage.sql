alter table public.branches
  add column if not exists menu_url text;

comment on column public.branches.menu_url is
  'Path of the branch menu file in the menus storage bucket.';

create schema if not exists private;

create or replace function private.can_manage_branch_menu(p_branch_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.branches as branch
    join public.restaurant_members as membership
      on membership.restaurant_id = branch.restaurant_id
    where branch.id = p_branch_id
      and membership.user_id = (select auth.uid())
      and membership.role in ('owner', 'admin', 'manager')
  );
$$;

revoke all on function private.can_manage_branch_menu(bigint) from public;
grant execute on function private.can_manage_branch_menu(bigint) to authenticated;

drop policy if exists "Public can view branch menus" on storage.objects;
create policy "Public can view branch menus"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'menus');

drop policy if exists "Managers can upload branch menus" on storage.objects;
create policy "Managers can upload branch menus"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'menus'
  and case
    when (storage.foldername(name))[1] ~ '^[1-9][0-9]*$'
      then private.can_manage_branch_menu(
        ((storage.foldername(name))[1])::bigint
      )
    else false
  end
);

drop policy if exists "Managers can update branch menus" on storage.objects;
create policy "Managers can update branch menus"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'menus'
  and case
    when (storage.foldername(name))[1] ~ '^[1-9][0-9]*$'
      then private.can_manage_branch_menu(
        ((storage.foldername(name))[1])::bigint
      )
    else false
  end
)
with check (
  bucket_id = 'menus'
  and case
    when (storage.foldername(name))[1] ~ '^[1-9][0-9]*$'
      then private.can_manage_branch_menu(
        ((storage.foldername(name))[1])::bigint
      )
    else false
  end
);

drop policy if exists "Managers can delete branch menus" on storage.objects;
create policy "Managers can delete branch menus"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'menus'
  and case
    when (storage.foldername(name))[1] ~ '^[1-9][0-9]*$'
      then private.can_manage_branch_menu(
        ((storage.foldername(name))[1])::bigint
      )
    else false
  end
);
