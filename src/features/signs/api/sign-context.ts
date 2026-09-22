import "server-only"

import { getDashboardContext } from "@/features/dashboard/api/get-dashboard-context"
import { createClient } from "@/lib/supabase/server"
import type { SignsDatabase } from "@/features/signs/types/pending-database.types"

export async function getSignContext() {
  const context = await getDashboardContext()
  if (!context?.activeRestaurant) return null

  return {
    restaurant: context.activeRestaurant,
    canManage: ["owner", "admin", "manager"].includes(context.activeRestaurant.role),
    supabase: await createClient<SignsDatabase>(),
  }
}
