import { Building2, Plus } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { columns } from "@/components/branches/colums"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import EmptyState from "@/components/ui/empty-state"
import { ACTIVE_RESTAURANT_COOKIE } from "@/lib/dashboard"
import { createClient } from "@/lib/supabase/server"

export default async function BranchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(
    cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value
  )
  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
  const membership = memberships?.find(
    (item) => item.restaurant_id === requestedRestaurantId
  ) ?? memberships?.[0]

  if (!membership) redirect("/dashboard")

  const { data: branches, error } = await supabase
    .from("branches")
    .select("id, name, address, phone, is_active")
    .eq("restaurant_id", membership.restaurant_id)
    .order("created_at", { ascending: true })
  const canManage = ["owner", "admin", "manager"].includes(membership.role)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Sucursales
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra las ubicaciones de tu restaurante.
          </p>
        </div>
        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href="/dashboard/branches/new">
                <Plus />
                Crear sucursal
              </Link>
            }
          />
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          No se pudieron cargar las sucursales.
        </div>
      )}

      {!error && branches?.length === 0 && (
        <EmptyState
          title="No hay sucursales"
          description="No has creado ninguna sucursal todavía. Empieza creando tu primera ubicación."
          icon={Building2}
        >
          {canManage && (
            <Button
              className="mt-5"
              nativeButton={false}
              render={
                <Link href="/dashboard/branches/new">
                  <Plus />
                  Crear sucursal
                </Link>
              }
            />
          )}
        </EmptyState>
      )}

      {!error && branches && branches.length > 0 && (
        <div className="flex flex-col gap-2">
          <DataTable columns={columns} data={branches} />
        </div>
      )}
    </div>
  )
}
