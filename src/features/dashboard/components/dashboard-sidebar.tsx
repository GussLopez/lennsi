"use client"

import * as React from "react"
import { BarChart3, Building2, LayoutDashboard, MousePointerClick, Nfc, Settings2, Zap } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavHeader } from "./nav-header"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

const navigation = [
  { title: "Resumen", url: "/dashboard", icon: LayoutDashboard },
  { title: "Sucursales", url: "/dashboard/branches", icon: Building2 },
  { title: "Puntos NFC", url: "/dashboard/touchpoints", icon: Zap },
  { title: "Acciones", url: "/dashboard/actions", icon: MousePointerClick },
  { title: "Tags", url: "/dashboard/tags", icon: Nfc },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Configuración", url: "/dashboard/settings", icon: Settings2 },
]

export type DashboardRestaurant = { id: number; name: string; role: string }
export type DashboardBranch = { id: number; name: string; restaurantId: number }

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  restaurants: DashboardRestaurant[]
  activeRestaurantId: number
  branches: DashboardBranch[]
  activeBranchId: number | null
  user: { name: string; email: string }
}

export function DashboardSidebar({ restaurants, activeRestaurantId, branches, activeBranchId, user, ...props }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-white">
        <NavHeader
          key={`${activeRestaurantId}:${activeBranchId ?? "none"}`}
          restaurants={restaurants}
          activeRestaurantId={activeRestaurantId}
          branches={branches}
          activeBranchId={activeBranchId}
        />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
