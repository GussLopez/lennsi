"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"
import { deleteTouchpoints, type DeleteTouchpointsResult } from "@/features/touchpoints/actions/delete-touchpoints"
import { touchpointColumns } from "@/features/touchpoints/components/touchpoint-columns"
import type { Touchpoint } from "@/features/touchpoints/types/types"
import toast from "react-hot-toast"

type TouchpointsTableProps = {
  touchpoints: Touchpoint[]
  canManage: boolean
}

export function TouchpointsTable({ touchpoints, canManage }: TouchpointsTableProps) {
  const [selectedTouchpoints, setSelectedTouchpoints] = useState<Touchpoint[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const nextResult = await deleteTouchpoints(
        selectedTouchpoints.map((touchpoint) => touchpoint.id),
      )
      toast.success(nextResult.message);

      if (nextResult.status === "success") {
        setSelectedTouchpoints([])
        setDialogOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-2">
      <DataTable
        key={touchpoints.map((touchpoint) => touchpoint.id).join("-")}
        columns={touchpointColumns}
        data={touchpoints}
        onSelectionChange={setSelectedTouchpoints}
      />

      {canManage && selectedTouchpoints.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {selectedTouchpoints.length} {selectedTouchpoints.length === 1 ? "seleccionado" : "seleccionados"}
          </p>

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger render={
              <Button variant="destructive">
                <Trash2 />
                Eliminar ({selectedTouchpoints.length})
              </Button>
            } />
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Eliminar {selectedTouchpoints.length === 1 ? "este touchpoint" : `estos ${selectedTouchpoints.length} touchpoints`}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción es permanente y puede afectar los tags NFC asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDelete}>
                  {isPending && <Spinner />}
                  {isPending ? "Eliminando" : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
