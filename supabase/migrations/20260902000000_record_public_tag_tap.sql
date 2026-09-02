create or replace function public.record_public_tag_tap(
  p_token text,
  p_user_agent text default null,
  p_referrer text default null,
  p_device_type text default null
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  resolved_tag record;
begin
  select
    tag.id as tag_id,
    touchpoint.id as touchpoint_id,
    branch.id as branch_id,
    restaurant.id as restaurant_id
  into resolved_tag
  from public.tags as tag
  join public.touchpoints as touchpoint
    on touchpoint.id = tag.touchpoint_id
  join public.branches as branch
    on branch.id = touchpoint.branch_id
  join public.restaurants as restaurant
    on restaurant.id = branch.restaurant_id
  where tag.token = p_token
    and tag.is_active = true
    and touchpoint.is_active = true
    and branch.is_active = true
    and restaurant.is_active = true
  limit 1;

  if not found then
    return false;
  end if;

  insert into public.events (
    restaurant_id,
    branch_id,
    touchpoint_id,
    tag_id,
    event_name,
    device_type,
    user_agent,
    referrer,
    metadata
  )
  values (
    resolved_tag.restaurant_id,
    resolved_tag.branch_id,
    resolved_tag.touchpoint_id,
    resolved_tag.tag_id,
    'tap',
    nullif(left(p_device_type, 30), ''),
    nullif(left(p_user_agent, 512), ''),
    nullif(left(p_referrer, 2048), ''),
    '{}'::jsonb
  );

  return true;
end;
$$;

revoke all on function public.record_public_tag_tap(text, text, text, text)
  from public;
grant execute on function public.record_public_tag_tap(text, text, text, text)
  to anon, authenticated;

comment on function public.record_public_tag_tap(text, text, text, text) is
  'Resolves a public NFC token server-side and records one tap event.';
