import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarRail, // Re-adding SidebarRail import
} from "@/components/ui/sidebar"
import { SearchPopup } from "@/components/search-popup"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className={cn(
        "flex items-center p-2",
        // When expanded (and not mobile), space between logo and (now removed) trigger.
        // When collapsed (or mobile), center the logo.
        state === 'expanded' && !isMobile ? "justify-between" : "justify-center"
      )}>
        {/* Logo Link - it will show small logo (icon) when collapsed or on mobile, full logo when expanded on desktop */}
        <Link href="/" className={cn("flex items-center", state === 'expanded' && !isMobile ? "gap-2" : "")}>
          <div className={cn(
            "relative h-8 w-8 flex items-center justify-center",
            (state === 'expanded' && !isMobile) && "hidden"
          )}>
            <Image
              src="/logo 2.svg"
              alt="Samrian AI"
              width={32}
              height={32}
              priority
              className="h-8 w-auto transition-all duration-200 dark:invert"
            />
          </div>
          {state === 'expanded' && !isMobile && (
            <div className="relative h-8 w-auto">
              <Image
                src="/Logo 1.svg"
                alt="Samrian AI"
                width={100}
                height={32}
                priority
                className="h-8 w-auto transition-all duration-200 dark:invert"
              />
            </div>
          )}
        </Link>

        {/* SidebarTrigger removed from here */}
      </SidebarHeader>
      
      <SidebarContent className="mt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn(
              "w-full gap-2 text-base font-medium",
              state === 'collapsed' ? "justify-center" : "justify-start"
            )}>
              <Plus className="h-5 w-5" />
              <span className={cn("transition-opacity duration-200", state === 'collapsed' && "opacity-0")}>
                New chat
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className={cn(
                "w-full gap-2 text-base font-medium",
                state === 'collapsed' ? "justify-center" : "justify-start"
              )}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className={cn("transition-opacity duration-200", state === 'collapsed' && "opacity-0")}>
                Search chats
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SearchPopup 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarRail /> {/* Re-adding SidebarRail component here */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={cn(
              "flex items-center justify-center w-full py-2",
              state === 'expanded' && !isMobile ? "justify-start px-3" : ""
            )}>
              <ThemeToggle />
              {state === 'expanded' && !isMobile && (
                <span className="ml-2 text-sm">Theme</span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
