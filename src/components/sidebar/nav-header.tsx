"use client"

import { Check, ChevronsUpDown, Utensils } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { setActiveRestaurant } from "@/app/dashboard/action"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import type { DashboardRestaurant } from "./dashboard-sidebar"

type NavHeaderProps = { restaurants: DashboardRestaurant[]; activeRestaurantId: number }

export function NavHeader({ restaurants, activeRestaurantId }: NavHeaderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedId, setSelectedId] = useState(activeRestaurantId)
  const activeRestaurant = restaurants.find((restaurant) => restaurant.id === selectedId) ?? restaurants[0]

  function selectRestaurant(restaurantId: number) {
    if (restaurantId === selectedId) return
    startTransition(async () => {
      await setActiveRestaurant(restaurantId)
      setSelectedId(restaurantId)
      router.refresh()
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <SidebarMenuButton size="lg" disabled={isPending} className="data-[state=open]:bg-sidebar-accent">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Utensils className="size-4" /></span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-semibold">{activeRestaurant.name}</span>
                <span className="truncate text-xs capitalize text-muted-foreground">{activeRestaurant.role}</span>
              </span>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          } />
          <DropdownMenuContent className="min-w-64" align="start" side="bottom">
            <DropdownMenuLabel>Tus restaurantes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {restaurants.map((restaurant) => (
              <DropdownMenuItem key={restaurant.id} onClick={() => selectRestaurant(restaurant.id)}>
                <span className="flex size-7 items-center justify-center rounded-md border bg-background"><Utensils className="size-3.5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{restaurant.name}</span>
                  <span className="block text-xs capitalize text-muted-foreground">{restaurant.role}</span>
                </span>
                {restaurant.id === selectedId && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
