create index if not exists events_restaurant_created_at_idx
  on public.events (restaurant_id, created_at desc);

create or replace function public.get_restaurant_analytics(
  p_restaurant_id bigint,
  p_date_from date,
  p_date_to date,
  p_branch_id bigint default null,
  p_touchpoint_id bigint default null
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with bounds as (
    select
      greatest(p_date_from, p_date_to - 89) as date_from,
      greatest(p_date_from, p_date_to) as date_to
  ),
  scoped_events as (
    select
      event.event_name,
      event.device_type,
      event.action_id,
      event.branch_id,
      event.touchpoint_id,
      branch.name as branch_name,
      touchpoint.name as touchpoint_name,
      coalesce(action.label, initcap(replace(event.event_name, '_', ' '))) as action_label,
      (event.created_at at time zone branch.timezone)::date as local_date,
      (now() at time zone branch.timezone)::date as branch_today
    from public.events as event
    join public.branches as branch on branch.id = event.branch_id
    left join public.touchpoints as touchpoint on touchpoint.id = event.touchpoint_id
    left join public.actions as action on action.id = event.action_id
    cross join bounds
    where event.restaurant_id = p_restaurant_id
      and (p_branch_id is null or event.branch_id = p_branch_id)
      and (p_touchpoint_id is null or event.touchpoint_id = p_touchpoint_id)
      and event.created_at >= least(
        bounds.date_from::timestamp,
        now() - interval '8 days'
      ) - interval '14 hours'
      and event.created_at < bounds.date_to::timestamp
        + interval '1 day 14 hours'
  ),
  filtered_events as (
    select scoped_events.*
    from scoped_events
    cross join bounds
    where scoped_events.local_date between bounds.date_from and bounds.date_to
  ),
  daily as (
    select
      series.day::date as day,
      count(*) filter (where event.event_name = 'tap')::integer as taps,
      count(*) filter (where event.event_name <> 'tap')::integer as interactions
    from bounds
    cross join lateral generate_series(
      bounds.date_from::timestamp,
      bounds.date_to::timestamp,
      interval '1 day'
    ) as series(day)
    left join filtered_events as event on event.local_date = series.day::date
    group by series.day
    order by series.day
  ),
  action_totals as (
    select
      event.action_label as name,
      count(*)::integer as value
    from filtered_events as event
    where event.event_name <> 'tap'
    group by event.action_label
    order by value desc, name
    limit 6
  ),
  touchpoint_totals as (
    select
      coalesce(event.touchpoint_name, 'Sin touchpoint') as name,
      count(*)::integer as value
    from filtered_events as event
    where event.event_name = 'tap'
    group by event.touchpoint_id, event.touchpoint_name
    order by value desc, name
    limit 6
  ),
  branch_totals as (
    select
      event.branch_name as name,
      count(*)::integer as value
    from filtered_events as event
    where event.event_name = 'tap'
    group by event.branch_id, event.branch_name
    order by value desc, name
    limit 6
  )
  select jsonb_build_object(
    'summary', jsonb_build_object(
      'tapsToday', (
        select count(*)::integer
        from scoped_events
        where event_name = 'tap'
          and local_date = branch_today
      ),
      'tapsLast7Days', (
        select count(*)::integer
        from scoped_events
        where event_name = 'tap'
          and local_date between branch_today - 6 and branch_today
      ),
      'interactions', (
        select count(*)::integer
        from filtered_events
        where event_name <> 'tap'
      ),
      'googleReviewClicks', (
        select count(*)::integer
        from filtered_events
        where event_name = 'google_review_click'
      )
    ),
    'daily', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'date', daily.day,
          'taps', daily.taps,
          'interactions', daily.interactions
        ) order by daily.day
      )
      from daily
    ), '[]'::jsonb),
    'actions', coalesce((
      select jsonb_agg(
        jsonb_build_object('name', name, 'value', value)
        order by value desc, name
      )
      from action_totals
    ), '[]'::jsonb),
    'touchpoints', coalesce((
      select jsonb_agg(
        jsonb_build_object('name', name, 'value', value)
        order by value desc, name
      )
      from touchpoint_totals
    ), '[]'::jsonb),
    'branches', coalesce((
      select jsonb_agg(
        jsonb_build_object('name', name, 'value', value)
        order by value desc, name
      )
      from branch_totals
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_restaurant_analytics(
  bigint,
  date,
  date,
  bigint,
  bigint
) from public;

grant execute on function public.get_restaurant_analytics(
  bigint,
  date,
  date,
  bigint,
  bigint
) to authenticated;

comment on function public.get_restaurant_analytics(
  bigint,
  date,
  date,
  bigint,
  bigint
) is 'Returns RLS-protected aggregate analytics for one restaurant and optional branch/touchpoint filters.';
