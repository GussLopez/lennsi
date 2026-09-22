"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus, Signpost } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import EmptyState from "@/components/ui/empty-state"
import FormMessage from "@/components/ui/form-message"
import { Spinner } from "@/components/ui/spinner"
import { fetchSigns } from "@/features/signs/api/signs-client"
import { createSignColumns } from "@/features/signs/components/colunms"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"

export function SignsModule({ restaurantId, restaurantName }: { restaurantId: number; restaurantName: string }) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [busyToken, setBusyToken] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const query = useQuery({ queryKey: ["signs", restaurantId], queryFn: () => fetchSigns(restaurantId) })
  const canManage = query.data?.canManage ?? false
  const columns = useMemo(() => createSignColumns({
    canManage, copiedToken, busyToken,
    onCopy: async (sign) => {
      setActionError(null)
      try {
        await navigator.clipboard.writeText(getPublicSignUrl(sign.token))
        setCopiedToken(sign.token)
      } catch {
        setActionError("No se pudo copiar el enlace. Puedes copiarlo directamente desde la tabla.")
      }
    },
    onDownload: async (sign) => {
      setActionError(null)
      setBusyToken(sign.token)
      try {
        const response = await fetch(`/api/signs/${sign.id}/qr?restaurantId=${restaurantId}`, { cache: "no-store" })
        if (!response.ok) throw new Error("No se pudo descargar el QR.")
        const url = URL.createObjectURL(await response.blob())
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `cartel-${sign.token}.svg`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch {
        setActionError("No se pudo descargar el QR. Inténtalo de nuevo.")
      } finally {
        setBusyToken(null)
      }
    },
  }), [canManage, copiedToken, busyToken, restaurantId])

  if (query.isPending) return <div className="flex min-h-64 items-center justify-center"><Spinner /></div>
  if (query.isError) return <FormMessage message={query.error.message} />
  const createButton = <Button nativeButton={false} render={
    <Link href="/dashboard/signs/new"><Plus />Crear cartel</Link>
  } />

  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Carteles</h1>
        <p className="mt-1 text-sm text-muted-foreground">Administra el inventario de carteles de {restaurantName}.</p>
      </div>
      {canManage && createButton}
    </div>
    {actionError && <FormMessage message={actionError} />}
    {query.data.signs.length ? <DataTable columns={columns} data={query.data.signs} /> : (
      <EmptyState title="No hay carteles" description="Crea un cartel, descarga su QR y configura el destino cuando esté listo." icon={Signpost}>
        {canManage && <div className="mt-5">{createButton}</div>}
      </EmptyState>
    )}
  </div>
}
