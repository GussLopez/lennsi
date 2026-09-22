-- Local migration: verify the existing restaurants/restaurant_members schema
-- and policies in the target project before applying. Does not change tags.
begin;

create table public.signs (
  id bigint generated always as identity primary key,
  restaurant_id bigint not null references public.restaurants(id) on delete restrict,
  token text not null unique check (token ~ '^[a-f0-9]{32}$'),
  label text not null check (char_length(btrim(label)) between 2 and 120),
  business_name text check (business_name is null or char_length(btrim(business_name)) between 1 and 160),
  destination_url text check (
    destination_url is null or (
      char_length(destination_url) between 1 and 2048
      and destination_url ~* '^https?://[^[:space:]/?#@]+([/?#]|$)'
      and destination_url !~ '[[:cntrl:]]'
    )
  ),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index signs_restaurant_created_idx on public.signs (restaurant_id, created_at desc);
alter table public.signs enable row level security;

-- Revoke potential project default privileges. Tokens and ownership are immutable
-- for API clients; only the editable fields can be updated. Retire via is_active.
revoke all on public.signs from public, anon, authenticated;
grant select on public.signs to authenticated;
grant insert (restaurant_id, token, label, business_name, destination_url, is_active)
  on public.signs to authenticated;
grant update (label, business_name, destination_url, is_active)
  on public.signs to authenticated;
revoke all on sequence public.signs_id_seq from public, anon, authenticated;
grant usage on sequence public.signs_id_seq to authenticated;

create policy signs_members_select on public.signs
for select to authenticated using (
  restaurant_id in (
    select membership.restaurant_id from public.restaurant_members as membership
    where membership.user_id = (select auth.uid())
  )
);

create policy signs_managers_insert on public.signs
for insert to authenticated with check (
  restaurant_id in (
    select membership.restaurant_id from public.restaurant_members as membership
    where membership.user_id = (select auth.uid())
      and membership.role in ('owner', 'admin', 'manager')
  )
);

create policy signs_managers_update on public.signs
for update to authenticated using (
  restaurant_id in (
    select membership.restaurant_id from public.restaurant_members as membership
    where membership.user_id = (select auth.uid())
      and membership.role in ('owner', 'admin', 'manager')
  )
) with check (
  restaurant_id in (
    select membership.restaurant_id from public.restaurant_members as membership
    where membership.user_id = (select auth.uid())
      and membership.role in ('owner', 'admin', 'manager')
  )
);

create schema if not exists private;
create function private.set_sign_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function private.set_sign_updated_at() from public, anon, authenticated;
create trigger signs_updated_at before update on public.signs
for each row execute function private.set_sign_updated_at();

-- Dedicated non-exposed schema: do not grant anonymous usage on the existing
-- private schema, which also contains unrelated privileged application helpers.
create schema signs_private;
revoke all on schema signs_private from public, anon, authenticated;
grant usage on schema signs_private to anon, authenticated;

-- Intentionally public token lookup, not an authenticated management operation.
-- The definer bypasses table RLS only for this exact-token lookup. It returns no
-- IDs, membership, labels or inventory, and withholds inactive destinations.
create function signs_private.resolve_sign(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case
    when not sign.is_active or not restaurant.is_active then jsonb_build_object('status', 'inactive')
    when sign.destination_url is null then jsonb_build_object('status', 'pending')
    else jsonb_build_object('status', 'active', 'destinationUrl', sign.destination_url)
  end
  from public.signs as sign
  join public.restaurants as restaurant on restaurant.id = sign.restaurant_id
  where p_token ~ '^[a-f0-9]{32}$' and sign.token = p_token;
$$;
revoke all on function signs_private.resolve_sign(text) from public, anon, authenticated;
grant execute on function signs_private.resolve_sign(text) to anon, authenticated;

create function public.get_public_sign(p_token text)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select signs_private.resolve_sign(p_token);
$$;
revoke all on function public.get_public_sign(text) from public, anon, authenticated;
grant execute on function public.get_public_sign(text) to anon, authenticated;

comment on table public.signs is 'Permanent QR/NFC inventory; destination can be assigned after printing.';
comment on column public.signs.restaurant_id is 'Administrative owner, independent of the recipient business.';
comment on column public.signs.token is 'Permanent random token. Never change after printing or reuse for another physical sign.';
comment on function public.get_public_sign(text) is 'Exact-token public resolver; exposes only status and active destination.';

commit;
