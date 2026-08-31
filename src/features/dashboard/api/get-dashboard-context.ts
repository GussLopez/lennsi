import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import {
  ACTIVE_BRANCH_COOKIE,
  ACTIVE_RESTAURANT_COOKIE,
} from "../constants"

export const getDashboardContext = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("restaurant_members")
      .select("restaurant_id, role, restaurants(id, name, logo_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ])

  const restaurants = (memberships ?? []).flatMap((membership) => {
    const restaurant = Array.isArray(membership.restaurants)
      ? membership.restaurants[0]
      : membership.restaurants

    return restaurant
      ? [
          {
            id: restaurant.id,
            name: restaurant.name,
            role: membership.role,
            logo_url: restaurant.logo_url,
          },
        ]
      : []
  })

  if (!restaurants.length) {
    return { user, profile, restaurants, activeRestaurant: null, branches: [], activeBranch: null }
  }

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(
    cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value,
  )
  const activeRestaurant =
    restaurants.find(({ id }) => id === requestedRestaurantId) ?? restaurants[0]

  const { data: branchRows } = await supabase
    .from("branches")
    .select("id, name, restaurant_id, template_id")
    .eq("restaurant_id", activeRestaurant.id)
    .order("created_at", { ascending: true })

  const branches = branchRows ?? []
  const requestedBranchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)
  const activeBranch =
    branches.find(({ id }) => id === requestedBranchId) ?? branches[0] ?? null

  return {
    user,
    profile,
    restaurants,
    activeRestaurant,
    branches,
    activeBranch,
  }
})
