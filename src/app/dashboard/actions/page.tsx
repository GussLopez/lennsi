import { redirect } from "next/navigation"

import { ActionsModule } from "@/features/actions/components/actions-module"
import { ACTION_TEMPLATE_IDS, type ActionItem, type ActionTemplateId, type ActionType } from "@/features/actions/types/types"
import { getDashboardContext } from "@/features/dashboard/api/get-dashboard-context"
import { createClient } from "@/lib/supabase/server"

export default async function ActionsPage() {
  const context = await getDashboardContext()
  if (!context) redirect("/login")
  if (!context.activeRestaurant) redirect("/dashboard")

  const { activeRestaurant: restaurant, activeBranch: branch } = context
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from("actions")
    .select("id, branch_id, type, label, url, display_mode, is_enabled, sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order")

  const mapAction = (row: NonNullable<typeof rows>[number]): ActionItem => ({
    id: row.id,
    branchId: row.branch_id,
    type: row.type as ActionType,
    label: row.label,
    url: row.url ?? "",
    source: row.url === null ? "branch" : "custom",
    displayMode: row.display_mode === "icon" ? "icon" : "link",
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
    branchName={branch?.name ?? null}
    activeBranchId={branch?.id ?? null}
    branchData={{
      whatsapp: branch?.whatsapp ?? null,
      googleReviewUrl: branch?.google_review_url ?? null,
      menuUrl: branch?.menu_url ?? null,
      wifiSsid: branch?.wifi_ssid ?? null,
      wifiPassword: branch?.wifi_password ?? null,
    }}
    canManage={["owner", "admin", "manager"].includes(restaurant.role)}
    initialBranchTemplateId={branchTemplateId}
    initialGlobal={actions.filter((item) => item.branchId === null)}
    initialBranch={actions.filter((item) => item.branchId === branch?.id)}
  />
}
