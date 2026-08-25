"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "@/components/ui/data-table-features"
import { type Branch } from "@/features/branches/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Branch>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox 
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false
  }),

  columnHelper.accessor("name", {
    header: "Sucursal",
  }),
  columnHelper.accessor("address", {
    header: "Ubicación",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return <div>
        {address ? address : '—'}
      </div>
    }
  }),
  columnHelper.accessor("phone", {
    header: "Telefono",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return <div>
        {phone ? phone : '—'}
      </div>
    }
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton
            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem render={
                <Link href={`/dashboard/branches/${branch.id}`}>
                  <Eye />
                  Ver detalles
                </Link>
              } />
              <DropdownMenuItem render={
                <Link href={`/dashboard/branches/${branch.id}/edit`}>
                  <Edit />
                  Editar
                </Link>
              } />
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
