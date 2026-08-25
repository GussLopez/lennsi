"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { ACTIVE_RESTAURANT_COOKIE } from "@/lib/dashboard"
import { createClient } from "@/lib/supabase/server"

const optionalUrl = z.union([
  z.literal(""),
  z.url("Ingresa una URL completa, por ejemplo https://..."),
])

const branchSchema = z.object({
  branchId: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre no puede exceder 120 caracteres."),
  address: z.string().trim().max(300, "La dirección es demasiado larga."),
  phone: z.string().trim().max(30, "El teléfono es demasiado largo."),
  whatsapp: z.string().trim().max(30, "El WhatsApp es demasiado largo."),
  googleReviewUrl: optionalUrl,
  wifiSsid: z.string().trim().max(100, "El nombre de red es demasiado largo."),
  wifiPassword: z.string().max(100, "La contraseña es demasiado larga."),
  timezone: z.string().trim().min(1, "Ingresa una zona horaria."),
  isActive: z.enum(["true", "false"]),
})

type BranchField =
  | "name"
  | "address"
  | "phone"
  | "whatsapp"
  | "googleReviewUrl"
  | "wifiSsid"
  | "wifiPassword"
  | "timezone"

export type BranchFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: Partial<Record<BranchField, string>>
}

function getFieldErrors(
  error: z.ZodError<z.infer<typeof branchSchema>>
): BranchFormState["errors"] {
  const fields = z.flattenError(error).fieldErrors

  return {
    name: fields.name?.[0],
    address: fields.address?.[0],
    phone: fields.phone?.[0],
    whatsapp: fields.whatsapp?.[0],
    googleReviewUrl: fields.googleReviewUrl?.[0],
    wifiSsid: fields.wifiSsid?.[0],
    wifiPassword: fields.wifiPassword?.[0],
    timezone: fields.timezone?.[0],
  }
}

export async function saveBranch(
  _previousState: BranchFormState,
  formData: FormData
): Promise<BranchFormState> {
  const parsed = branchSchema.safeParse({
    branchId: formData.get("branchId") || undefined,
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    googleReviewUrl: formData.get("googleReviewUrl"),
    wifiSsid: formData.get("wifiSsid"),
    wifiPassword: formData.get("wifiPassword"),
    timezone: formData.get("timezone"),
    isActive: formData.get("isActive"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: getFieldErrors(parsed.error),
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      status: "error",
      message: "Tu sesión expiró. Vuelve a iniciar sesión.",
    }
  }

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
    return {
      status: "error",
      message: "No tienes permiso para administrar sucursales.",
    }
  }

  const values = {
    name: parsed.data.name,
    address: parsed.data.address || null,
    phone: parsed.data.phone || null,
    whatsapp: parsed.data.whatsapp || null,
    google_review_url: parsed.data.googleReviewUrl || null,
    wifi_ssid: parsed.data.wifiSsid || null,
    wifi_password: parsed.data.wifiPassword || null,
    timezone: parsed.data.timezone,
    is_active: parsed.data.isActive === "true",
    updated_at: new Date().toISOString(),
  }

  if (parsed.data.branchId) {
    const branchId = Number(parsed.data.branchId)
    if (!Number.isSafeInteger(branchId) || branchId <= 0) {
      return { status: "error", message: "La sucursal no es válida." }
    }

    const { data: branch, error } = await supabase
      .from("branches")
      .update(values)
      .eq("id", branchId)
      .eq("restaurant_id", membership.restaurant_id)
      .select("id")
      .maybeSingle()

    if (error || !branch) {
      return {
        status: "error",
        message: "No se pudo actualizar la sucursal.",
      }
    }

    revalidatePath("/dashboard/branches")
    revalidatePath(`/dashboard/branches/${branchId}/edit`)
    return { status: "success", message: "Sucursal actualizada correctamente." }
  }

  const { error } = await supabase.from("branches").insert({
    ...values,
    restaurant_id: membership.restaurant_id,
  })

  if (error) {
    return { status: "error", message: "No se pudo crear la sucursal." }
  }

  revalidatePath("/dashboard/branches")
  redirect("/dashboard/branches")
}
