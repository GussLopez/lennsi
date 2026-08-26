import { ArrowLeft } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ACTIVE_BRANCH_COOKIE, ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { TouchpointForm } from "@/features/touchpoints/components/touchpoint-form"
import { TOUCHPOINT_TYPES } from "@/features/touchpoints/schemas/touchpoint-schema"
import { createClient } from "@/lib/supabase/server"

type EditTouchpointPageProps = {
  params: Promise<{ touchpointId: string }>
}

export default async function EditTouchpointPage({ params }: EditTouchpointPageProps) {
  const { touchpointId: touchpointIdParam } = await params
  const touchpointId = Number(touchpointIdParam)
  if (!Number.isSafeInteger(touchpointId) || touchpointId <= 0) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const restaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const branchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)

  const [{ data: membership }, { data: branch }] = await Promise.all([
    supabase
      .from("restaurant_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("restaurant_id", restaurantId)
      .maybeSingle(),
    supabase
      .from("branches")
      .select("id")
      .eq("id", branchId)
      .eq("restaurant_id", restaurantId)
      .maybeSingle(),
  ])

  if (!membership || !branch || !["owner", "admin", "manager"].includes(membership.role)) {
    redirect("/dashboard/touchpoints")
  }

  const { data: touchpoint } = await supabase
    .from("touchpoints")
    .select("id, name, type, number, is_active")
    .eq("id", touchpointId)
    .eq("branch_id", branch.id)
    .maybeSingle()

  if (!touchpoint || !TOUCHPOINT_TYPES.some((type) => type === touchpoint.type)) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/dashboard/touchpoints">
              <ArrowLeft />
              <span className="sr-only">Volver atrás</span>
            </Link>
          }
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editar touchpoint</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza la información de {touchpoint.name}.
          </p>
        </div>
      </div>

      <TouchpointForm
        initialValues={{
          id: touchpoint.id,
          name: touchpoint.name,
          type: touchpoint.type as (typeof TOUCHPOINT_TYPES)[number],
          number: touchpoint.number,
          isActive: touchpoint.is_active,
        }}
      />
    </div>
  )
}
