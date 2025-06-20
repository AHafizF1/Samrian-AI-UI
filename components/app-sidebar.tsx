import * as React from "react"
import Link from "next/link"
import Image from "next/image"
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
import { ThreadList } from "./assistant-ui/thread-list"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center">
                  {state === 'expanded' ? (
                    <Image 
                      src="/Logo 1.svg" 
                      alt="Samrian AI Logo" 
                      width={0}
                      height={0}
                      priority
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image 
                      src="/logo 2.svg" 
                      alt="Samrian AI Icon" 
                      width={32} 
                      height={32}
                      priority
                      className="h-8 w-auto"
                    />
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ThreadList />
      </SidebarContent>
      
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          {/* Additional sidebar items can be added here in the future */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
