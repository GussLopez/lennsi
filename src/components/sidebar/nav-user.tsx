"use client";
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { logoutAction } from "@/app/dashboard/action";
export function NavUser() {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={nombres || 'avatar del usuario'} />
                <AvatarFallback className="rounded-lg">{nombres?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="truncate font-medium"
                >Gustavo</span>
                <span
                  className="truncate text-xs"
                >gustavolopez819@gmail.com</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          } />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={nombres || 'Avatar del usuario'} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar> */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Gustavo</span>
                  <span className="truncate text-xs">gustavolopez819@gmail.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'dark' ? (
                  <Moon />
                ) : (
                  <Sun />
                )}
                Cambiar tema
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutAction}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}