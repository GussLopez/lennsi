import { Building2, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"
import { getTagContext } from "@/features/tags/api/tag-context"
import { TagsModule } from "@/features/tags/components/tags-module"

export default async function TagsPage() {
  const context = await getTagContext()

  if (!context) {
    return (
      <EmptyState
        title="No hay una sucursal activa"
        description="Crea o selecciona una sucursal para administrar sus tags NFC."
        icon={Building2}
      >
        <Button className="mt-5" nativeButton={false} render={
          <Link href="/dashboard/branches/new"><Plus />Crear sucursal</Link>
        } />
      </EmptyState>
    )
  }

  return <TagsModule branchId={context.branch.id} branchName={context.branch.name} />
}
