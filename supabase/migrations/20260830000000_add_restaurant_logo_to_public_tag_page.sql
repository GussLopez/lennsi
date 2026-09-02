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
    'actions', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', action.id,
            'type', action.type,
            'label', action.label,
            'url', action.url
          )
          order by action.sort_order, action.id
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
  limit 1;
$$;

revoke all on function public.get_public_tag_page(text) from public;
grant execute on function public.get_public_tag_page(text) to anon, authenticated;
