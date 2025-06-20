import * as React from "react"
import { Github } from "lucide-react"
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
                      width={120} 
                      height={40}
                      priority
                      className="h-10 w-auto"
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
         
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="https://github.com/assistant-ui/assistant-ui" target="_blank">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Github className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">GitHub</span>
                  <span className="">View Source</span>
                </div>
              </Link>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
