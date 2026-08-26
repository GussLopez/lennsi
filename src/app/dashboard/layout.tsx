import RestaurantOnboarding from "@/features/restaurants/components/restaurant-onboarding"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { DashboardSidebar, type DashboardBranch, type DashboardRestaurant } from "@/features/dashboard/components/dashboard-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { ACTIVE_BRANCH_COOKIE, ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("restaurant_members")
      .select("restaurant_id, role, restaurants(id, name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ])

  if (!memberships?.length) return <RestaurantOnboarding />

  const restaurants: DashboardRestaurant[] = memberships.flatMap((membership) => {
    const restaurant = Array.isArray(membership.restaurants) ? membership.restaurants[0] : membership.restaurants
    return restaurant ? [{ id: restaurant.id, name: restaurant.name, role: membership.role }] : []
  })

  if (!restaurants.length) return <RestaurantOnboarding />

  const cookieStore = await cookies()
  const requestedRestaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)
  const activeRestaurant = restaurants
    .find((restaurant) => restaurant.id === requestedRestaurantId) ?? restaurants[0]
  const { data: branchRows } = await supabase
    .from("branches")
    .select("id, name, restaurant_id")
    .eq("restaurant_id", activeRestaurant.id)
    .order("created_at", { ascending: true })
  const branches: DashboardBranch[] = (branchRows ?? []).map((branch) => ({
    id: branch.id,
    name: branch.name,
    restaurantId: branch.restaurant_id,
  }))
  const requestedBranchId = Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)
  const activeBranch = branches.find((branch) => branch.id === requestedBranchId) ?? branches[0] ?? null

  return (
    <SidebarProvider>
      <DashboardSidebar
        restaurants={restaurants}
        activeRestaurantId={activeRestaurant.id}
        branches={branches}
        activeBranchId={activeBranch?.id ?? null}
        user={{
          name: profile?.full_name ?? user.email?.split("@")[0] ?? "Usuario",
          email: user.email ?? "",
        }}
      />
      <SidebarInset className="min-w-0 bg-muted/35">
        <DashboardHeader
          restaurantName={activeRestaurant.name}
          branchName={activeBranch?.name ?? null}
        />
        <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 bg-neutral-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
