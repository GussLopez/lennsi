import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getSignContext } from "@/features/signs/api/sign-context"
import SignForm from "@/features/signs/components/sign-form"
import { signIdSchema } from "@/features/signs/schemas/sign-schema"

export default async function EditSignPage({ params }: { params: Promise<{ signId: string }> }) {
  const signId = signIdSchema.safeParse((await params).signId)
  if (!signId.success) notFound()
  const context = await getSignContext()
  if (!context?.canManage) redirect("/dashboard/signs")

  return <div className="mx-auto w-full max-w-4xl space-y-6">
    <div className="flex items-center gap-4">
      <Button
        size="icon"
        variant="outline"
        nativeButton={false}
        render={
          <Link href="/dashboard/signs">
            <ArrowLeft />
            <span className="sr-only">Volver atrás</span>
          </Link>
        } />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar cartel</h1>
        <p className="mt-1 text-sm text-muted-foreground">Actualiza el destino conservando el mismo QR y enlace NFC.</p>
      </div>
    </div>
    <SignForm
      restaurantId={context.restaurant.id}
      signId={signId.data}
    />
  </div>
}
