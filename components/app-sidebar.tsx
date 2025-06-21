import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
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
          <Image
            src="/logo 2.svg"
            alt="Samrian AI"
            width={32}
            height={32}
            priority
            className={cn(
              "h-8 w-auto transition-all duration-200",
              (state === 'expanded' && !isMobile) && "hidden"
            )}
          />
          {state === 'expanded' && !isMobile && (
            <Image
              src="/Logo 1.svg"
              alt="Samrian AI"
              width={100}
              height={32}
              priority
              className="h-8 w-auto transition-all duration-200"
            />
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
          {/* Additional sidebar items can be added here in the future */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
