import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getTagContext } from "@/features/tags/api/tag-context"
import { TagForm } from "@/features/tags/components/tag-form"

type EditTagPageProps = {
  params: Promise<{ tagId: string }>
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const { tagId: tagIdParam } = await params
  const tagId = Number(tagIdParam)
  if (!Number.isSafeInteger(tagId) || tagId <= 0) notFound()

  const context = await getTagContext()
  if (!context?.canManage) redirect("/dashboard/tags")

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button size="icon" variant="outline" nativeButton={false} render={
          <Link href="/dashboard/tags"><ArrowLeft /><span className="sr-only">Volver atrás</span></Link>
        } />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editar tag NFC</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza el tag asignado a {context.branch.name}.
          </p>
        </div>
      </div>
      <TagForm branchId={context.branch.id} tagId={tagId} />
    </div>
  )
}
