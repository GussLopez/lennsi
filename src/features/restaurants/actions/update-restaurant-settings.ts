"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"

import { ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"
import { RestaurantForm } from "../types"


const restaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre no puede exceder 120 caracteres."),
  description: z
    .string()
    .trim()
    .max(300, "La descripción no puede exceder 300 caracteres"),
  isActive: z.boolean(),
})

export type RestaurantSettingsState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: Partial<
    Record<"name" | "description", string>
  >
}

export async function updateRestaurantSettings(
  formData: RestaurantForm
): Promise<RestaurantSettingsState> {
  const parsed = restaurantSchema.safeParse({
    name: formData.name,
    description: formData.description,
    isActive: formData.isActive,
  })

  if (!parsed.success) {
    const fields = z.flattenError(parsed.error).fieldErrors
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: {
        name: fields.name?.[0],
        description: fields.description?.[0],
      },
    }
  }

  const cookieStore = await cookies()
  const restaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  if (!Number.isSafeInteger(restaurantId) || restaurantId <= 0) {
    return {
      status: "error",
      message: "No se pudo identificar el restaurante activo.",
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

  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("role")
    .eq("restaurant_id", restaurantId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    return {
      status: "error",
      message: "No tienes permiso para editar este restaurante.",
    }
  }

  const { error } = await supabase
    .from("restaurants")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      is_active: parsed.data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restaurantId)
  console.log(error);
  if (error) {
    return {
      status: "error",
      message: "No se pudieron guardar los cambios. Intenta de nuevo.",
    }
  }

  revalidatePath("/dashboard", "layout")
  return { status: "success", message: "Información actualizada correctamente." }
}
