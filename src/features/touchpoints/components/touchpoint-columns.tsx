"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Edit, MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type DataTableFeatures } from "@/components/ui/data-table-features"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { touchpointTypeLabels } from "@/features/touchpoints/schemas/touchpoint-schema"
import type { Touchpoint } from "@/features/touchpoints/types/types"
import { Badge } from "@/components/ui/badge"

const columnHelper = createColumnHelper<DataTableFeatures, Touchpoint>()

export const touchpointColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("name", { header: "Touchpoint" }),
  columnHelper.accessor("type", {
    header: "Tipo",
    cell: ({ row }) => touchpointTypeLabels[row.original.type],
  }),
  columnHelper.accessor("number", {
    header: "Número",
    cell: ({ row }) => row.original.number ?? "—",
  }),
  columnHelper.accessor("is_active", {
    header: "Estado",
    cell: ({ row }) => (
      <div>
        <Badge
          variant={'secondary'}
          className={row.original.is_active
            ? "bg-green-100 text-emerald-700"
            : ""}
        >
          {row.original.is_active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger nativeButton render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem render={
              <Link href={`/dashboard/touchpoints/${row.original.id}/edit`}>
                <Edit />
                Editar
              </Link>
            } />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
])
