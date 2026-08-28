import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ActionsModule } from "@/features/actions/components/actions-module"
import { ACTION_TEMPLATE_IDS, type ActionItem, type ActionTemplateId, type ActionType } from "@/features/actions/types/types"
import { ACTIVE_BRANCH_COOKIE, ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"

export default async function ActionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const requestedBranchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)
  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role, restaurants(id, name)")
    .eq("user_id", user.id)
    .order("created_at");

  const available = (memberships ?? []).flatMap((membership) => {
    const restaurant = Array.isArray(membership.restaurants) ? membership.restaurants[0] : membership.restaurants
    return restaurant ? [{ id: restaurant.id, name: restaurant.name, role: membership.role }] : []
  })

  const restaurant = available.find((item) => item.id === requestedRestaurantId) ?? available[0];

  if (!restaurant) redirect("/dashboard");

  const [{ data: branches }, { data: rows }] = await Promise.all([
    supabase
      .from("branches")
      .select("id, name, template_id")
      .eq("restaurant_id", restaurant.id)
      .order("created_at"),
    supabase
      .from("actions")
      .select("id, branch_id, type, label, url, is_enabled, sort_order")
      .eq("restaurant_id", restaurant.id)
      .order("sort_order"),
  ])
  const branch = (branches ?? [])
    .find((item) => item.id === requestedBranchId) ?? branches?.[0] ?? null;

  const mapAction = (row: NonNullable<typeof rows>[number]): ActionItem => ({
    id: row.id,
    branchId: row.branch_id,
    type: row.type as ActionType,
    label: row.label,
    url: row.url ?? "",
    isEnabled: row.is_enabled,
    sortOrder: row.sort_order,
    clientId: `action-${row.id}`,
  })
  const actions = (rows ?? []).map(mapAction)
  const branchTemplateId = ACTION_TEMPLATE_IDS.includes(
    branch?.template_id as ActionTemplateId,
  )
    ? (branch?.template_id as ActionTemplateId)
    : "classic"

  return <ActionsModule
    key={`${restaurant.id}:${branch?.id ?? "none"}`}
    restaurantName={restaurant.name}
    branchName={branch?.name ?? null}
    activeBranchId={branch?.id ?? null}
    canManage={["owner", "admin", "manager"].includes(restaurant.role)}
    initialBranchTemplateId={branchTemplateId}
    initialGlobal={actions.filter((item) => item.branchId === null)}
    initialBranch={actions.filter((item) => item.branchId === branch?.id)}
  />
}
