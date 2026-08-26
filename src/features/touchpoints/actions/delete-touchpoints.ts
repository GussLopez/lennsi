"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"

import {
  ACTIVE_BRANCH_COOKIE,
  ACTIVE_RESTAURANT_COOKIE,
} from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"

const touchpointIdsSchema = z
  .array(z.number().int().positive())
  .min(1)
  .max(100)
  .transform((ids) => [...new Set(ids)])

export type DeleteTouchpointsResult = {
  status: "success" | "error"
  message: string
}

export async function deleteTouchpoints(
  touchpointIds: number[],
): Promise<DeleteTouchpointsResult> {
  const parsedIds = touchpointIdsSchema.safeParse(touchpointIds)
  if (!parsedIds.success) {
    return { status: "error", message: "La selección no es válida." }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { status: "error", message: "Tu sesión expiró. Vuelve a iniciar sesión." }
  }

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

  if (
    !membership ||
    !branch ||
    !["owner", "admin", "manager"].includes(membership.role)
  ) {
    return { status: "error", message: "No tienes permiso para eliminar touchpoints." }
  }

  const { data: existing, error: lookupError } = await supabase
    .from("touchpoints")
    .select("id")
    .eq("branch_id", branch.id)
    .in("id", parsedIds.data)

  if (lookupError || existing?.length !== parsedIds.data.length) {
    return { status: "error", message: "Uno o más touchpoints no son válidos." }
  }

  const { data: deleted, error } = await supabase
    .from("touchpoints")
    .delete()
    .eq("branch_id", branch.id)
    .in("id", parsedIds.data)
    .select("id")

  if (error || deleted?.length !== parsedIds.data.length) {
    return { status: "error", message: "No se pudieron eliminar los touchpoints." }
  }

  revalidatePath("/dashboard/touchpoints")

  return {
    status: "success",
    message: parsedIds.data.length === 1
      ? "Touchpoint eliminado correctamente."
      : `${parsedIds.data.length} touchpoints eliminados correctamente.`,
  }
}
