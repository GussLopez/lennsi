"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const sectionNames: Record<string, string> = {
  "/dashboard": "Resumen",
  "/dashboard/branches": "Sucursales",
  "/dashboard/touchpoints": "Puntos NFC",
  "/dashboard/actions": "Acciones",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Configuración",
}

export function DashboardHeader({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname()
  const section = Object.entries(sectionNames).sort(([a], [b]) => b.length - a.length)
    .find(([path]) => pathname === path || (path !== "/dashboard" && pathname.startsWith(`${path}/`)))?.[1] ?? "Dashboard"
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
      <div className="min-w-0"><p className="truncate text-sm font-medium">{section}</p><p className="truncate text-xs text-muted-foreground md:hidden">{restaurantName}</p></div>
      <p className="ml-auto hidden max-w-64 truncate text-sm text-muted-foreground md:block">{restaurantName}</p>
    </header>
  )
}
