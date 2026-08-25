"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"

import { ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"

const branchIdsSchema = z
  .array(z.number().int().positive())
  .min(1)
  .max(100)
  .transform((ids) => [...new Set(ids)])

export type DeleteBranchesResult = {
  status: "success" | "error"
  message: string
}

export async function deleteBranches(
  branchIds: number[]
): Promise<DeleteBranchesResult> {
  const parsedIds = branchIdsSchema.safeParse(branchIds)
  if (!parsedIds.success) {
    return { status: "error", message: "La selección de sucursales no es válida." }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { status: "error", message: "Tu sesión expiró. Vuelve a iniciar sesión." }
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

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { status: "error", message: "No tienes permiso para eliminar sucursales." }
  }

  const { data: branches, error: lookupError } = await supabase
    .from("branches")
    .select("id")
    .eq("restaurant_id", membership.restaurant_id)
    .in("id", parsedIds.data)

  if (lookupError || branches?.length !== parsedIds.data.length) {
    return { status: "error", message: "Una o más sucursales no son válidas." }
  }

  const { data: deletedBranches, error } = await supabase
    .from("branches")
    .delete()
    .eq("restaurant_id", membership.restaurant_id)
    .in("id", parsedIds.data)
    .select("id")

  if (error || deletedBranches?.length !== parsedIds.data.length) {
    return { status: "error", message: "No se pudieron eliminar las sucursales." }
  }

  revalidatePath("/dashboard/branches")

  return {
    status: "success",
    message: parsedIds.data.length === 1
      ? "Sucursal eliminada correctamente."
      : `${parsedIds.data.length} sucursales eliminadas correctamente.`,
  }
}
