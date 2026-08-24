"use client"
import * as React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../ui/sidebar";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

import {
  ArrowRightLeft,
  ChartNoAxesCombined,
  DollarSign,
  FileClock,
  LayoutTemplate,
  Package,
  PanelTopDashed,
  Settings2,
  Truck,
  Users,
  Utensils,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: LayoutTemplate,
    },
    {
      title: "Metricas",
      url: "/dashboard/metrics",
      icon: ChartNoAxesCombined,
    },
  ],
  projects: [
    {
      name: "Restaurantes",
      url: "/dashboard/restaurants",
      icon: Utensils
    },
    {
      name: "Menús",
      url: "/dashboard/menus",
      icon: PanelTopDashed
    },
    {
      name: "Proveedores",
      url: "/admin/proveedores",
      icon: Truck
    },
  ],
  settings: [
    {
      name: "Usuarios",
      url: "/admin/usuarios",
      icon: Users
    },
    {
      name: "Ajustes",
      url: "/admin/ajustes",
      icon: Settings2
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}