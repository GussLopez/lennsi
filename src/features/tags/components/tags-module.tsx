"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { Check, Copy, Edit, MoreHorizontal, Nfc, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { type DataTableFeatures } from "@/components/ui/data-table-features"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EmptyState from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { deleteTags, fetchTags } from "@/features/tags/api/tags-client"
import type { Tag } from "@/features/tags/types/types"
import { getPublicTagUrl } from "@/features/tags/public-tag-url"

type TagsModuleProps = {
  branchId: number
  branchName: string
}

export function TagsModule({ branchId, branchName }: TagsModuleProps) {
  const queryClient = useQueryClient()
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const tagsQuery = useQuery({
    queryKey: ["tags", branchId],
    queryFn: fetchTags,
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTags,
    onSuccess: async () => {
      setSelectedTags([])
      setDialogOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["tags", branchId] })
    },
  })
  const columns = useMemo(
    () => createTagColumns(copiedToken, async (tag) => {
      await navigator.clipboard.writeText(getPublicTagUrl(tag.token))
      setCopiedToken(tag.token)
      window.setTimeout(() => setCopiedToken((current) => current === tag.token ? null : current), 2000)
    }),
    [copiedToken],
  )

  if (tagsQuery.isPending) {
    return <div className="flex min-h-64 items-center justify-center"><Spinner /></div>
  }

  if (tagsQuery.isError) {
    return <p role="alert" className="text-sm text-destructive">{tagsQuery.error.message}</p>
  }

  const { tags, canManage } = tagsQuery.data

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Tags NFC</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra los tags NFC de {branchName}.
          </p>
        </div>
        {canManage && tagsQuery.data.touchpoints.length > 0 && (
          <Button nativeButton={false} render={
            <Link href="/dashboard/tags/new">
              <Plus />
              Crear Tag
            </Link>
          } />
        )}
      </div>

      {!tags.length ? (
        <EmptyState
          title="No hay tags NFC"
          description={tagsQuery.data.touchpoints.length
            ? "Todavía no hay tags registrados. Crea el primero para comenzar."
            : "Primero crea un touchpoint donde puedas asignar el tag NFC."}
          icon={Nfc}
        >
          {canManage && (
            <Button className="mt-5" nativeButton={false} render={
              <Link href={tagsQuery.data.touchpoints.length ? "/dashboard/tags/new" : "/dashboard/touchpoints/new"}>
                <Plus />
                {tagsQuery.data.touchpoints.length ? "Crear tag" : "Crear touchpoint"}
              </Link>
            } />
          )}
        </EmptyState>
      ) : (
        <div className="space-y-2">
          <DataTable
            key={tags.map((tag) => tag.id).join("-")}
            columns={columns}
            data={tags}
            onSelectionChange={setSelectedTags}
          />

          {canManage && selectedTags.length > 0 && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {selectedTags.length} {selectedTags.length === 1 ? "seleccionado" : "seleccionados"}
              </p>
              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger render={
                  <Button variant="destructive"><Trash2 />Eliminar ({selectedTags.length})</Button>
                } />
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Eliminar {selectedTags.length === 1 ? "este tag" : `estos ${selectedTags.length} tags`}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Las URLs dejarán de funcionar. Esta acción no se puede revertir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(selectedTags.map((tag) => tag.id))}
                    >
                      {deleteMutation.isPending && <Spinner />}
                      {deleteMutation.isPending ? "Eliminando" : "Eliminar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {deleteMutation.isError && (
            <p role="alert" className="text-sm text-destructive">{deleteMutation.error.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

const columnHelper = createColumnHelper<DataTableFeatures, Tag>()

function createTagColumns(
  copiedToken: string | null,
  copyUrl: (tag: Tag) => Promise<void>,
) {
  return columnHelper.columns([
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
    columnHelper.accessor("label", { header: "Tag" }),
    columnHelper.display({
      id: "url",
      header: "URL NFC",
      cell: ({ row }) => {
        const url = getPublicTagUrl(row.original.token)
        return (
          <div className="flex min-w-64 items-center gap-2">
            <a className="truncate text-primary hover:underline" href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => void copyUrl(row.original)}
              aria-label="Copiar URL NFC"
            >
              {copiedToken === row.original.token ? <Check /> : <Copy />}
            </Button>
          </div>
        )
      },
    }),
    columnHelper.accessor("touchpoint_name", { header: "Touchpoint" }),
    columnHelper.accessor("is_active", {
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant="secondary" className={row.original.is_active ? "bg-green-100 text-emerald-700" : ""}>
          {row.original.is_active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Fecha",
      cell: ({ row }) => new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" })
        .format(new Date(row.original.created_at)),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger nativeButton render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Abrir menú</span><MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem render={
                <Link href={`/dashboard/tags/${row.original.id}/edit`}><Edit />Editar</Link>
              } />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
