import { AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

import { getAnalytics } from "@/features/analytics/api/get-analytics"
import { AnalyticsDashboard } from "@/features/analytics/components/analytics-dashboard"
import type {
  AnalyticsFilters,
  AnalyticsPeriod,
} from "@/features/analytics/types"
import { getDashboardContext } from "@/features/dashboard/api/get-dashboard-context"
import { createClient } from "@/lib/supabase/server"

const validPeriods = new Set<AnalyticsPeriod>(["1", "7", "30"])

export default async function AnalyticsPage({
  searchParams,
}: PageProps<"/dashboard/analytics">) {
  const context = await getDashboardContext()
  if (!context) redirect("/login")
  if (!context.activeRestaurant) redirect("/dashboard")

  const rawFilters = await searchParams
  const period = validPeriods.has(rawFilters.period as AnalyticsPeriod)
    ? (rawFilters.period as AnalyticsPeriod)
    : "7"
  const requestedBranchId = parsePositiveInteger(rawFilters.branch)
  const branchId = context.branches.some(
    (branch) => branch.id === requestedBranchId,
  )
    ? requestedBranchId
    : null
  const branchIds = context.branches.map((branch) => branch.id)
  const supabase = await createClient()
  const { data: touchpointRows, error: touchpointsError } = branchIds.length
    ? await supabase
        .from("touchpoints")
        .select("id, branch_id, name")
        .in("branch_id", branchIds)
        .eq("is_active", true)
        .order("name")
    : { data: [], error: null }

  if (touchpointsError) {
    return <AnalyticsError />
  }

  const touchpoints = (touchpointRows ?? []).map((touchpoint) => ({
    id: touchpoint.id,
    branchId: touchpoint.branch_id,
    name: touchpoint.name,
  }))
  const requestedTouchpointId = parsePositiveInteger(rawFilters.touchpoint)
  const selectedTouchpoint = touchpoints.find(
    (touchpoint) =>
      touchpoint.id === requestedTouchpointId &&
      (!branchId || touchpoint.branchId === branchId),
  )
  const filters: AnalyticsFilters = {
    period,
    branchId,
    touchpointId: selectedTouchpoint?.id ?? null,
  }

  let data
  try {
    data = await getAnalytics(context.activeRestaurant.id, filters)
  } catch {
    return <AnalyticsError />
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta el rendimiento de tus puntos NFC y las acciones que más
          utilizan tus clientes.
        </p>
      </header>

      <AnalyticsDashboard
        data={data}
        filters={filters}
        branches={context.branches.map((branch) => ({
          id: branch.id,
          name: branch.name,
        }))}
        touchpoints={touchpoints}
      />
    </div>
  )
}

function AnalyticsError() {
  return (
    <div className="mx-auto flex min-h-96 w-full max-w-2xl items-center justify-center">
      <div className="rounded-xl border bg-background p-8 text-center shadow-xs">
        <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </span>
        <h1 className="font-semibold">No se pudieron cargar los analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verifica que la migración del módulo de analytics esté aplicada e
          inténtalo nuevamente.
        </p>
      </div>
    </div>
  )
}

function parsePositiveInteger(value: string | string[] | undefined) {
  if (typeof value !== "string") return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}
