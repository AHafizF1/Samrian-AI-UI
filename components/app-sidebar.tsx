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
  SidebarMenu, // Keep SidebarMenu for structure if needed, but not for the logo button
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { SearchPopup } from "@/components/search-popup"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className={cn(
        "flex items-center p-2",
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
            // Show small logo if:
            // 1. Sidebar is collapsed
            // 2. Sidebar is expanded AND on mobile
            // Hide if expanded AND on desktop (full logo will show)
            className={cn(
              "h-8 w-auto transition-all duration-200",
              (state === 'expanded' && !isMobile) && "hidden" // Hidden, not scaled, to prevent layout shifts
            )}
          />
          {/* Show full logo (Logo 1.svg) only if expanded AND on desktop */}
          {state === 'expanded' && !isMobile && (
            <Image
              src="/Logo 1.svg"
              alt="Samrian AI"
              width={100} // Adjusted width for full logo text
              height={32}
              priority
              className="h-8 w-auto transition-all duration-200" // No complex opacity/scale, just conditional rendering
            />
          )}
        </Link>

        {/* Trigger button - always shown on desktop, adjusts position via justify-center/between on SidebarHeader */}
        {/* The PanelLeftIcon will rotate itself based on sidebar state via its own internal logic if using SidebarTrigger from ui */}
        {!isMobile && (
          <SidebarTrigger className={cn(
            state === 'expanded' ? "ml-2" : "" // Add some space if header is justify-between
          )} />
        )}
      </SidebarHeader>
      
      {/* SidebarRail is part of the ui/sidebar.tsx component and its visibility is handled there based on props.
          If collapsible="icon", it should provide the edge click/drag functionality.
          We don't need to add another SidebarRail here.
          If we want to explicitly disable the rail for "icon" mode, that change would be in ui/sidebar.tsx.
          For now, let's assume the default behavior of SidebarRail in "icon" mode is acceptable or non-interfering
          with the explicit SidebarTrigger button.
      */}

      <SidebarContent className="mt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-2 text-base font-medium">
              <Plus className="h-5 w-5" />
              <span className={cn("transition-opacity duration-200", state === 'collapsed' && "opacity-0")}>
                New chat
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="w-full justify-start gap-2 text-base font-medium"
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
      
      {/* SidebarRail is rendered by Sidebar component itself if needed. We don't need to add it here. */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Additional sidebar items can be added here in the future */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
