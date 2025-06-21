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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { SearchPopup } from "@/components/search-popup"
import { ThemeSwitcher } from "@/components/theme-switcher" // Added import

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center transition-all duration-200">
                  <Image 
                    src="/logo 2.svg" 
                    alt="Samrian AI" 
                    width={32}
                    height={32}
                    priority
                    className={cn(
                      "h-8 w-auto transition-all duration-200 logo-image",
                      state === 'expanded' && "scale-0 absolute"
                    )}
                  />
                  <Image 
                    src="/Logo 1.svg" 
                    alt="Samrian AI" 
                    width={0}
                    height={0}
                    priority
                    className={cn(
                      "h-8 w-auto transition-all duration-200 opacity-0 absolute logo-image",
                      state === 'expanded' && "opacity-100 relative"
                    )}
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          

        </SidebarMenu>
      </SidebarHeader>
      
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
      
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mt-auto">
            <ThemeSwitcher />
          </SidebarMenuItem>
          {/* Additional sidebar items can be added here in the future */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
