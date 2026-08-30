import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { RestaurantSettingsForm } from "@/features/restaurants/components/restaurant-settings-form"
import { ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select(
      `
        restaurant_id, 
        role, 
        restaurants(
          id,
          name,
          description,
          logo_url,
          is_active
        )
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const availableRestaurants = (memberships ?? []).flatMap((membership) => {
    const restaurant = Array.isArray(membership.restaurants)
      ? membership.restaurants[0]
      : membership.restaurants

    return restaurant ? [{ ...restaurant, role: membership.role }] : []
  })
  const activeRestaurant = availableRestaurants.find(
    (restaurant) => restaurant.id === requestedRestaurantId
  ) ?? availableRestaurants[0]
  if (!activeRestaurant) redirect("/dashboard")

  return (
    <RestaurantSettingsForm
      key={activeRestaurant.id}
      restaurant={{
        id: activeRestaurant.id,
        name: activeRestaurant.name,
        description: activeRestaurant.description ?? "",
        logo_url: activeRestaurant.logo_url ?? null,
        isActive: activeRestaurant.is_active,
      }}
      canEdit={activeRestaurant.role === "owner" || activeRestaurant.role === "admin"}
    />
  )
}
