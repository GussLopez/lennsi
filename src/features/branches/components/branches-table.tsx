"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"
import {
  deleteBranches,
  type DeleteBranchesResult,
} from "@/features/branches/actions/delete-branches"
import { columns } from "@/features/branches/components/branch-columns"
import type { Branch } from "@/features/branches/types/types"

type BranchesTableProps = {
  branches: Branch[]
  canDelete: boolean
}

export function BranchesTable({ branches, canDelete }: BranchesTableProps) {
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([])
  const [result, setResult] = useState<DeleteBranchesResult | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    const branchIds = selectedBranches.map((branch) => branch.id)

    startTransition(async () => {
      const nextResult = await deleteBranches(branchIds)
      setResult(nextResult)

      if (nextResult.status === "success") {
        setSelectedBranches([])
        setDialogOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-2">
      <DataTable
        key={branches.map((branch) => branch.id).join("-")}
        columns={columns}
        data={branches}
        onSelectionChange={setSelectedBranches}
      />

      {canDelete && selectedBranches.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {selectedBranches.length}{" "}
            {selectedBranches.length === 1
              ? "sucursal seleccionada"
              : "sucursales seleccionadas"}
          </p>

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger
              render={
                <Button variant="destructive">
                  <Trash2 />
                  Eliminar ({selectedBranches.length})
                </Button>
              }
            />
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Eliminar {selectedBranches.length === 1
                    ? "esta sucursal"
                    : `estas ${selectedBranches.length} sucursales`}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción también eliminará sus puntos NFC y acciones
                  asociadas. Es permanente y no se puede revertir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isPending}
                  onClick={handleDelete}
                >
                  {isPending && <Spinner />}
                  {isPending ? "Eliminando" : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {result && (
        <p
          role="status"
          aria-live="polite"
          className={
            result.status === "success"
              ? "text-sm text-emerald-600"
              : "text-sm text-destructive"
          }
        >
          {result.message}
        </p>
      )}
    </div>
  )
}
