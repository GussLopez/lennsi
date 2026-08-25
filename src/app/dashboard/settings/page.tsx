import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { RestaurantSettingsForm } from "@/components/restaurants/restaurant-settings-form"
import { ACTIVE_RESTAURANT_COOKIE } from "@/lib/dashboard"
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
      "restaurant_id, role, restaurants(id, name, instagram_url, facebook_url, website, is_active)"
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
        name: activeRestaurant.name,
        instagramUrl: activeRestaurant.instagram_url ?? "",
        facebookUrl: activeRestaurant.facebook_url ?? "",
        website: activeRestaurant.website ?? "",
        isActive: activeRestaurant.is_active,
      }}
      canEdit={activeRestaurant.role === "owner" || activeRestaurant.role === "admin"}
    />
  )
}
