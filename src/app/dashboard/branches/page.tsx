'use client'

import { ArrowUpRight, Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Branches } from "@/types"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/branches/colums"
import EmptyState from "@/components/ui/empty-state"

export default function BranchesPage() {
  const getBranches = async () => {
    const response = await fetch('/api/branches');
    if (!response.ok) throw new Error('Error fetching');

    return response.json();
  }
  const { data, isLoading, error } = useQuery<Branches[]>({
    queryKey: ["branches"],
    queryFn: getBranches,
  })

  return (
    <div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Sucursales
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra las ubicaciones de tu restaurante.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={
              <Link href={'/dashboard/branches/new'}>
                <Plus />
                Crear sucursal
              </Link>
            }
          />
        </div>
        {data?.length === 0 ? (
          <EmptyState
            title="No hay sucursaeles"
            description=" No haz creado ninguna sucursal  todavía. Empieza creando tu primera sucursal"
            icon={Building2}
          >
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button
                variant={'outline'}
                nativeButton={false}
                render={
                  <Link href={'/'}>
                    Leer más
                    <ArrowUpRight />
                  </Link>
                } />
              <Button
                nativeButton={false}
                render={
                  <Link href={'/dashboard/branches/new'}>
                    <Plus />
                    Crear sucursal
                  </Link>
                }
              />
            </div>
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {data && <DataTable columns={columns} data={data} />}
          </div>
        )}
      </div>
    </div>
  )
}
