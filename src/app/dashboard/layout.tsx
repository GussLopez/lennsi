import RestaurantOnboarding from "@/features/restaurants/components/restaurant-onboarding"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { DashboardSidebar, type DashboardBranch } from "@/features/dashboard/components/dashboard-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { RestaurantStoreProvider } from "@/store/restaurant-store-provider"
import { getDashboardContext } from "@/features/dashboard/api/get-dashboard-context"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const context = await getDashboardContext()
  if (!context) redirect("/login")
  if (!context.activeRestaurant) return <RestaurantOnboarding />

  const { user, profile, restaurants, activeRestaurant, activeBranch } = context
  const branches: DashboardBranch[] = context.branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    restaurantId: branch.restaurant_id,
  }))
  const supabase = await createClient()

  const restaurantLogoUrl = activeRestaurant.logo_url
    ? supabase.storage
        .from("restaurants-logos")
        .getPublicUrl(activeRestaurant.logo_url).data.publicUrl
    : null
  return (
    <RestaurantStoreProvider
      key={`${activeRestaurant.id}:${activeRestaurant.name}:${restaurantLogoUrl ?? "no-logo"}`}
      restaurant={{
        id: activeRestaurant.id,
        name: activeRestaurant.name,
        logoUrl: restaurantLogoUrl,
      }}
    >
      <SidebarProvider>
        <DashboardSidebar
          restaurants={restaurants}
          activeRestaurant={activeRestaurant}
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
    </RestaurantStoreProvider>
  )
}
