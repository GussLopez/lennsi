alter table public.restaurants
  add column if not exists use_case text,
  add column if not exists use_case_value text;

alter table public.restaurants drop constraint if exists restaurants_use_case_check;
alter table public.restaurants add constraint restaurants_use_case_check check (
  use_case is null or use_case in ('google_reviews', 'menu', 'whatsapp', 'social_media', 'link_page')
);

create or replace function public.create_restaurant_onboarding(p_name text, p_use_case text, p_use_case_value text)
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
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if exists (select 1 from public.restaurant_members where user_id = current_user_id) then
    raise exception 'User already belongs to a restaurant';
  end if;
  if nullif(trim(p_name), '') is null or length(trim(p_name)) > 120 then raise exception 'Invalid restaurant name'; end if;
  if p_use_case not in ('google_reviews', 'menu', 'whatsapp', 'social_media', 'link_page') then raise exception 'Invalid use case'; end if;
  if nullif(trim(p_use_case_value), '') is null or length(trim(p_use_case_value)) > 2048 then raise exception 'Invalid use case value'; end if;

  restaurant_slug := trim(both '-' from lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g')));
  if restaurant_slug = '' then restaurant_slug := 'restaurant'; end if;
  restaurant_slug := restaurant_slug || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 8);

  insert into public.restaurants (name, slug, use_case, use_case_value)
  values (trim(p_name), restaurant_slug, p_use_case, trim(p_use_case_value)) returning id into restaurant_id;
  insert into public.restaurant_members (restaurant_id, user_id, role) values (restaurant_id, current_user_id, 'owner');
  insert into public.branches (restaurant_id, name) values (restaurant_id, 'Sucursal principal');
  return restaurant_id;
end;
$$;

revoke all on function public.create_restaurant_onboarding(text, text, text) from public;
grant execute on function public.create_restaurant_onboarding(text, text, text) to authenticated;
