import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { BranchForm } from "@/features/branches/components/branch-form"
import { Button } from "@/components/ui/button"
import { ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  params: Promise<{ branchId: string }>
}
export default async function EditBranchPage({
  params,
}: PageProps) {
  const { branchId: branchIdParam } = await params;
  const branchId = Number(branchIdParam)
  if (!Number.isSafeInteger(branchId) || branchId <= 0) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(
    cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value
  )
  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const membership = memberships?.find(
    (item) => item.restaurant_id === requestedRestaurantId
  ) ?? memberships?.[0]

  if (
    !membership ||
    !["owner", "admin", "manager"].includes(membership.role)
  ) {
    redirect("/dashboard/branches")
  }

  const { data: branch } = await supabase
    .from("branches")
    .select("*")
    .eq("id", branchId)
    .eq("restaurant_id", membership.restaurant_id)
    .maybeSingle()

  if (!branch) notFound()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/dashboard/branches">
              <ArrowLeft />
              <span className="sr-only">Volver atrás</span>
            </Link>
          }
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar sucursal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza la información de {branch.name}.
          </p>
        </div>
      </div>

      <BranchForm
        initialValues={{
          id: branch.id,
          branchId: branch.id,
          name: branch.name,
          address: branch.address ?? "",
          phone: branch.phone ?? "",
          whatsapp: branch.whatsapp ?? "",
          googleReviewUrl: branch.google_review_url ?? "",
          wifiSsid: branch.wifi_ssid ?? "",
          wifiPassword: branch.wifi_password ?? "",
          timezone: branch.timezone,
          menu_url: branch.menu_url,
          is_active: branch.is_active,
        }}
      />
    </div>
  )
}
