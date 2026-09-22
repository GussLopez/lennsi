"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Check, Copy, Download, Pencil } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DataTableFeatures } from "@/components/ui/data-table-features"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"
import type { Sign } from "@/features/signs/schemas/sign-schema"

const columnHelper = createColumnHelper<DataTableFeatures, Sign>()

export function createSignColumns({ canManage, copiedToken, busyToken, onCopy, onDownload }: {
  canManage: boolean; copiedToken: string | null; busyToken: string | null
  onCopy: (sign: Sign) => void; onDownload: (sign: Sign) => void
}) {
  return columnHelper.columns([
    columnHelper.accessor("label", { header: "Cartel" }),
    columnHelper.accessor("business_name", {
      header: "Negocio", cell: ({ row }) => row.original.business_name ?? "Sin asignar",
    }),
    columnHelper.display({
      id: "public_url", header: "Enlace QR / NFC",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <a
            href={getPublicSignUrl(row.original.token)}
            target="_blank"
            rel="noreferrer"
            className="max-w-40 truncate text-primary hover:underline"
          >
            {getPublicSignUrl(row.original.token)}
          </a>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onCopy(row.original)}
            aria-label="Copiar enlace"
          >
            {copiedToken === row.original.token ? <Check /> : <Copy />}
          </Button>
        </div>
      )
    }),
    columnHelper.accessor("destination_url", {
      header: "Destino",
      cell: ({ row }) => (
        <span
          className="block max-w-40 truncate"
          title={row.original.destination_url ?? undefined}
        >
          {row.original.destination_url ?? "Pendiente de configurar"}
        </span>
      )
    }),
    columnHelper.display({
      id: "status", header: "Estado",
      cell: ({ row }) => {
        const sign = row.original
        const active = sign.is_active && Boolean(sign.destination_url)
        return (
          <Badge
            variant="secondary"
            className={active ? "bg-green-100 text-emerald-700" : ""}
          >
            {!sign.is_active ? "Desactivado" : active ? "Activo" : "Pendiente"}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Fecha",
      cell: ({ row }) => new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium"
      }).format(new Date(row.original.created_at)),
    }),
    columnHelper.display({
      id: "actions", header: "Acciones",
      cell: ({ row }) => (<div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={busyToken === row.original.token}
          onClick={() => onDownload(row.original)}
        >
          <Download />
          QR SVG
        </Button>
        {canManage && (
          <Button
            size="icon-sm"
            variant="ghost"
            nativeButton={false}
            render={
              <Link
                href={`/dashboard/signs/${row.original.id}/edit`}
                aria-label={`Editar ${row.original.label}`}>
                <Pencil />
              </Link>
            }
          />
        )}
      </div>
      )
    }),
  ])
}
