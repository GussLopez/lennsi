alter table public.actions
  add column if not exists token uuid not null default gen_random_uuid();

create unique index if not exists actions_token_key
  on public.actions (token);

alter table public.events
  drop constraint if exists events_event_name_check;

alter table public.events
  add constraint events_event_name_check
  check (
    event_name in (
      'tap',
      'menu_click',
      'wifi_click',
      'google_review_click',
      'instagram_click',
      'facebook_click',
      'tiktok_click',
      'whatsapp_click',
      'promotion_click',
      'website_click',
      'custom_click'
    )
  );

create or replace function public.track_public_action_click(
  p_tag_token text,
  p_action_token uuid,
  p_session_id text default null,
  p_user_agent text default null,
  p_referrer text default null,
  p_device_type text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  resolved record;
begin
  select
    restaurant.id as restaurant_id,
    branch.id as branch_id,
    touchpoint.id as touchpoint_id,
    tag.id as tag_id,
    action.id as action_id,
    action.type as action_type,
    action.url as action_url,
    branch.whatsapp,
    branch.google_review_url,
    branch.menu_url,
    branch.wifi_ssid,
    branch.wifi_password
  into resolved
  from public.tags as tag
  join public.touchpoints as touchpoint
    on touchpoint.id = tag.touchpoint_id
  join public.branches as branch
    on branch.id = touchpoint.branch_id
  join public.restaurants as restaurant
    on restaurant.id = branch.restaurant_id
  join public.actions as action
    on action.restaurant_id = restaurant.id
  where tag.token = p_tag_token
    and action.token = p_action_token
    and tag.is_active = true
    and touchpoint.is_active = true
    and branch.is_active = true
    and restaurant.is_active = true
    and action.is_enabled = true
    and (
      (
        exists (
          select 1
          from public.actions as branch_action
          where branch_action.restaurant_id = restaurant.id
            and branch_action.branch_id = branch.id
        )
        and action.branch_id = branch.id
      )
      or (
        not exists (
          select 1
          from public.actions as branch_action
          where branch_action.restaurant_id = restaurant.id
            and branch_action.branch_id = branch.id
        )
        and action.branch_id is null
      )
    )
    and (
      action.url is not null
      or (action.type = 'whatsapp' and branch.whatsapp is not null)
      or (action.type = 'google_review' and branch.google_review_url is not null)
      or (action.type = 'menu' and branch.menu_url is not null)
      or (action.type = 'wifi' and branch.wifi_ssid is not null)
    )
  limit 1;

  if not found then
    return null;
  end if;

  insert into public.events (
    restaurant_id,
    branch_id,
    touchpoint_id,
    tag_id,
    action_id,
    event_name,
    session_id,
    device_type,
    user_agent,
    referrer,
    metadata
  )
  values (
    resolved.restaurant_id,
    resolved.branch_id,
    resolved.touchpoint_id,
    resolved.tag_id,
    resolved.action_id,
    resolved.action_type || '_click',
    nullif(left(p_session_id, 100), ''),
    nullif(left(p_device_type, 30), ''),
    nullif(left(p_user_agent, 512), ''),
    nullif(left(p_referrer, 2048), ''),
    '{}'::jsonb
  );

  return jsonb_build_object(
    'actionType', resolved.action_type,
    'url', resolved.action_url,
    'branch', jsonb_build_object(
      'whatsapp', resolved.whatsapp,
      'googleReviewUrl', resolved.google_review_url,
      'menuUrl', resolved.menu_url,
      'wifiSsid', resolved.wifi_ssid,
      'wifiPassword', resolved.wifi_password
    )
  );
end;
$$;

revoke all on function public.track_public_action_click(
  text,
  uuid,
  text,
  text,
  text,
  text
) from public;

grant execute on function public.track_public_action_click(
  text,
  uuid,
  text,
  text,
  text,
  text
) to anon, authenticated;

comment on function public.track_public_action_click(
  text,
  uuid,
  text,
  text,
  text,
  text
) is 'Validates a public tag/action pair, records the click and returns its destination data.';

create or replace function public.get_public_tag_page(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'restaurantName', restaurant.name,
    'restaurantLogoPath', restaurant.logo_url,
    'branchName', branch.name,
    'templateId', branch.template_id,
    'branch', jsonb_build_object(
      'whatsapp', branch.whatsapp,
      'googleReviewUrl', branch.google_review_url,
      'menuUrl', branch.menu_url,
      'wifiSsid', branch.wifi_ssid,
      'wifiPassword', branch.wifi_password
    ),
    'actions', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'token', action.token,
            'type', action.type,
            'label', action.label,
            'url', action.url,
            'displayMode', action.display_mode
          ) order by action.sort_order, action.id
        )
        from public.actions as action
        where action.restaurant_id = branch.restaurant_id
          and action.is_enabled = true
          and (
            (
              exists (
                select 1
                from public.actions as branch_action
                where branch_action.restaurant_id = branch.restaurant_id
                  and branch_action.branch_id = branch.id
              )
              and action.branch_id = branch.id
            )
            or (
              not exists (
                select 1
                from public.actions as branch_action
                where branch_action.restaurant_id = branch.restaurant_id
                  and branch_action.branch_id = branch.id
              )
              and action.branch_id is null
            )
          )
      ),
      '[]'::jsonb
    )
  )
  from public.tags as tag
  join public.touchpoints as touchpoint on touchpoint.id = tag.touchpoint_id
  join public.branches as branch on branch.id = touchpoint.branch_id
  join public.restaurants as restaurant on restaurant.id = branch.restaurant_id
  where tag.token = p_token
    and tag.is_active = true
    and touchpoint.is_active = true
    and branch.is_active = true
    and restaurant.is_active = true
  limit 1;
$$;

revoke all on function public.get_public_tag_page(text) from public;
grant execute on function public.get_public_tag_page(text) to anon, authenticated;
