import { Nfc, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/server"

export default async function TouchpointsPage() {
  const supabase = await createClient();

  const { data: touchpoints, error } = await supabase
    .from("touchpoints")
    .select("*")

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Touchpoints
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra los touchpoints de tu sucursal.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link href="/dashboard/branches/new">
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
          title="No hay sucursales"
          description="No has creado ninguna sucursal todavía. Empieza creando tu primera ubicación."
          icon={Nfc}
        >
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
