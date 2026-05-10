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
          className="hover:bg-sidebar-accent/50 flex items-center gap-2 rounded-md p-2"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
