"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  ACTIVE_BRANCH_COOKIE,
  ACTIVE_RESTAURANT_COOKIE,
} from "@/features/dashboard/constants"
import {
  touchpointSchema,
  type TouchpointFormValues,
} from "@/features/touchpoints/schemas/touchpoint-schema"
import { createClient } from "@/lib/supabase/server"

export type SaveTouchpointResult = {
  status: "success" | "error"
  message: string
  errors?: Partial<Record<keyof TouchpointFormValues, string>>
}

export async function saveTouchpoint(
  input: TouchpointFormValues,
): Promise<SaveTouchpointResult> {
  const parsed = touchpointSchema.safeParse(input)

  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors

    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: {
        name: fields.name?.[0],
        type: fields.type?.[0],
        number: fields.number?.[0],
      },
    }
  }

  const context = await getTouchpointWriteContext()
  if (!context) {
    return {
      status: "error",
      message: "No tienes permiso para administrar touchpoints en esta sucursal.",
    }
  }

  const values = {
    name: parsed.data.name,
    type: parsed.data.type,
    number: parsed.data.number,
    is_active: parsed.data.isActive,
    updated_at: new Date().toISOString(),
  }

  if (parsed.data.id) {
    const { data: touchpoint, error } = await context.supabase
      .from("touchpoints")
      .update(values)
      .eq("id", parsed.data.id)
      .eq("branch_id", context.branchId)
      .select("id")
      .maybeSingle()

    if (error || !touchpoint) {
      return { status: "error", message: "No se pudo actualizar el touchpoint." }
    }

    revalidatePath("/dashboard/touchpoints")
    revalidatePath(`/dashboard/touchpoints/${parsed.data.id}/edit`)

    return {
      status: "success",
      message: "Touchpoint actualizado correctamente.",
    }
  }

  const { error } = await context.supabase.from("touchpoints").insert({
    ...values,
    branch_id: context.branchId,
  })

  if (error) {
    return { status: "error", message: "No se pudo crear el touchpoint." }
  }

  revalidatePath("/dashboard/touchpoints")
  redirect("/dashboard/touchpoints")
}

async function getTouchpointWriteContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const cookieStore = await cookies()
  const restaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const branchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)

  if (
    !Number.isSafeInteger(restaurantId) ||
    restaurantId <= 0 ||
    !Number.isSafeInteger(branchId) ||
    branchId <= 0
  ) {
    return null
  }

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

  if (
    !membership ||
    !branch ||
    !["owner", "admin", "manager"].includes(membership.role)
  ) {
    return null
  }

  return { supabase, branchId: branch.id }
}
