-- Replace onboarding intent data with the restaurant acquisition source.
alter table public.restaurants
  add column if not exists discovery_source text;

update public.restaurants
set discovery_source = 'other'
where discovery_source is null;

alter table public.restaurants
  alter column discovery_source set not null;

alter table public.restaurants
  drop constraint if exists restaurants_discovery_source_check;

alter table public.restaurants
  add constraint restaurants_discovery_source_check
  check (
    discovery_source in (
      'google_search',
      'social_media',
      'recommendation',
      'event',
      'other'
    )
  );

alter table public.restaurants
  drop constraint if exists restaurants_use_case_check,
  drop column if exists use_case,
  drop column if exists use_case_value;

drop function if exists public.create_restaurant_onboarding(text, text, text);

create function public.create_restaurant_onboarding(
  p_name text,
  p_discovery_source text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  restaurant_id bigint;
  restaurant_slug text;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if exists (
    select 1
    from public.restaurant_members
    where user_id = current_user_id
  ) then
    raise exception 'User already belongs to a restaurant';
  end if;

  if nullif(trim(p_name), '') is null or length(trim(p_name)) > 120 then
    raise exception 'Invalid restaurant name';
  end if;

  if p_discovery_source not in (
    'google_search',
    'social_media',
    'recommendation',
    'event',
    'other'
  ) then
    raise exception 'Invalid discovery source';
  end if;

  restaurant_slug := trim(
    both '-'
    from lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'))
  );

  if restaurant_slug = '' then
    restaurant_slug := 'restaurant';
  end if;

  restaurant_slug := restaurant_slug
    || '-'
    || substr(md5(random()::text || clock_timestamp()::text), 1, 8);

  insert into public.restaurants (name, slug, discovery_source)
  values (trim(p_name), restaurant_slug, p_discovery_source)
  returning id into restaurant_id;

  insert into public.restaurant_members (restaurant_id, user_id, role)
  values (restaurant_id, current_user_id, 'owner');

  insert into public.branches (restaurant_id, name)
  values (restaurant_id, 'Sucursal principal');

  return restaurant_id;
end;
$$;

revoke all on function public.create_restaurant_onboarding(text, text) from public;
grant execute on function public.create_restaurant_onboarding(text, text) to authenticated;
