"use client"

import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar"

export function NavHeader() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="text-sm font-semibold">
          <span>NFC</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}