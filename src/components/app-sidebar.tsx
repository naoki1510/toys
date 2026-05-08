import { Link } from '@tanstack/react-router'
import { Blocks } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { toys } from '@/lib/toys'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent/50"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Blocks className="size-4" />
          </div>
          <span className="font-bold tracking-tight">Toys</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Apps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toys.map((toy) => (
                <SidebarMenuItem key={toy.name}>
                  <SidebarMenuButton
                    render={
                      <Link to={toy.path} activeOptions={{ exact: false }} />
                    }
                  >
                    {toy.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
