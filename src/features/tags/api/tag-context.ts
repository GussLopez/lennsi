import "server-only"

import { cookies } from "next/headers"

import { ACTIVE_BRANCH_COOKIE, ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"

export async function getTagContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const requestedBranchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)

  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const membership = memberships?.find(
    (item) => item.restaurant_id === requestedRestaurantId,
  ) ?? memberships?.[0]
  if (!membership) return null

  const { data: branches } = await supabase
    .from("branches")
    .select("id, name")
    .eq("restaurant_id", membership.restaurant_id)
    .order("created_at", { ascending: true })

  const branch = branches?.find((item) => item.id === requestedBranchId) ?? branches?.[0]
  if (!branch) return null

  return {
    supabase,
    branch,
    restaurantId: membership.restaurant_id,
    role: membership.role,
    canManage: ["owner", "admin", "manager"].includes(membership.role),
  }
}
