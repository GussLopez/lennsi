"use client"

import { Check, ChevronsUpDown, MapPin, Plus, Utensils } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { setActiveBranch, setActiveRestaurant } from "@/features/dashboard/actions/dashboard-actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import type { DashboardBranch, DashboardRestaurant } from "./dashboard-sidebar"
import Link from "next/link"

type NavHeaderProps = {
  restaurants: DashboardRestaurant[]
  activeRestaurantId: number
  branches: DashboardBranch[]
  activeBranchId: number | null
}

export function NavHeader({ restaurants, activeRestaurantId, branches, activeBranchId }: NavHeaderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedId, setSelectedId] = useState(activeRestaurantId)
  const [selectedBranchId, setSelectedBranchId] = useState(activeBranchId)
  const activeRestaurant = restaurants.find((restaurant) => restaurant.id === selectedId) ?? restaurants[0]
  const activeBranch = branches.find((branch) => branch.id === selectedBranchId) ?? branches[0]

  function selectRestaurant(restaurantId: number) {
    if (restaurantId === selectedId) return
    startTransition(async () => {
      await setActiveRestaurant(restaurantId)
      setSelectedId(restaurantId)
      router.refresh()
    })
  }

  function selectBranch(branchId: number) {
    if (branchId === selectedBranchId) return
    startTransition(async () => {
      await setActiveBranch(branchId)
      setSelectedBranchId(branchId)
      router.refresh()
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                disabled={isPending}
                className="data-[state=open]:bg-sidebar-accent"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Utensils className="size-4" />
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">
                    {activeRestaurant.name}
                  </span>
                  <span className="truncate text-xs capitalize text-muted-foreground">{activeRestaurant.role}</span>
                </span>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="min-w-64"
            align="start"
            side="bottom"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tus restaurantes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {restaurants.map((restaurant) => (
                <DropdownMenuItem
                  key={restaurant.id}
                  onClick={() => selectRestaurant(restaurant.id)}
                >
                  <span className="flex size-7 items-center justify-center rounded-md border bg-background">
                    <Utensils className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      {restaurant.name}
                    </span>
                    <span className="block text-xs capitalize text-muted-foreground">
                      {restaurant.role}
                    </span>
                  </span>
                  {restaurant.id === selectedId &&
                    <Check className="size-4 text-primary" />
                  }
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SidebarGroup className="p-0 mt-2">
        <SidebarGroupLabel>Sucursal</SidebarGroupLabel>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  disabled={isPending}
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <MapPin />
                  <span className="grid min-w-0 flex-1 text-left leading-tight">
                    <span className="truncate font-semibold">
                      {activeBranch?.name ?? "Sin sucursales"}
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent
              className="min-w-64"
              align="start"
              side="bottom"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>Tus sucursales</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {branches.map((branch) => (
                  <DropdownMenuItem
                    key={branch.id}
                    onClick={() => selectBranch(branch.id)}
                  >
                    <span className="flex size-7 items-center justify-center rounded-md border bg-background">
                      <MapPin className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">
                        {branch.name}
                      </span>
                    </span>
                    {branch.id === selectedBranchId &&
                      <Check className="size-4 text-primary" />
                    }
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <Link href={'/dashboard/branches/new'}>
                      <span className="flex size-7 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          Crear sucursal
                        </span>
                      </span>
                    </Link>
                  }
                />
                {!branches.length && (
                  <DropdownMenuItem disabled>No hay sucursales disponibles</DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarGroup>
    </SidebarMenu>
  )
}
