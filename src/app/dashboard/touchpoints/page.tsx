import { Nfc, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/server"
import { ACTIVE_BRANCH_COOKIE, ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function TouchpointsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const requestedBranchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)

  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
  const membership = memberships?.find(
    (item) => item.restaurant_id === requestedRestaurantId
  ) ?? memberships?.[0]

  const { data: availableBranches } = membership
    ? await supabase
        .from("branches")
        .select("id, name")
        .eq("restaurant_id", membership.restaurant_id)
        .order("created_at", { ascending: true })
    : { data: [] }
  const branch = availableBranches?.find(
    (item) => item.id === requestedBranchId
  ) ?? availableBranches?.[0] ?? null

  const { data: touchpoints, error } = branch
    ? await supabase
        .from("touchpoints")
        .select("id, branch_id, name, type, number, is_active, created_at, updated_at")
        .eq("branch_id", branch.id)
        .order("created_at", { ascending: true })
    : { data: [], error: null }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Touchpoints
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra los touchpoints de {branch?.name ?? "la sucursal seleccionada"}.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link href="/dashboard/touchpoints/new">
              <Plus />
              Crear Touchpoint
            </Link>
          }
        />
      </div>

      {/* {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          No se pudieron cargar las sucursales.
        </div>
      )} */}

      {!error && touchpoints?.length === 0 && (
        <EmptyState
          title={branch ? "No hay touchpoints" : "Selecciona una sucursal"}
          description={branch
            ? `Todavía no hay touchpoints en ${branch.name}. Crea el primero para comenzar.`
            : "Crea o selecciona una sucursal para administrar sus touchpoints."}
          icon={Nfc}
        >
          <Button
            className="mt-5"
            nativeButton={false}
            render={
              <Link href={branch ? "/dashboard/touchpoints/new" : "/dashboard/branches/new"}>
                <Plus />
                {branch ? "Crear touchpoint" : "Crear sucursal"}
              </Link>
            }
          />
        </EmptyState>
      )}

      {!error && touchpoints && touchpoints.length > 0 && (
        <div className="flex flex-col gap-2">
          {/* <BranchesTable branches={branches} canDelete={canDelete} /> */}
        </div>
      )}
    </div>
  )
}
