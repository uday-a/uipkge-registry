import Story from '../../components/story/Story'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@react-registry/sidebar'
import {
  Bell,
  Calendar,
  ChevronDown,
  Compass,
  Home,
  Inbox,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
  Users,
} from 'lucide-react'

// Each Story wraps its SidebarProvider in `[transform:translate(0)]` so the
// Sidebar component's internal `position: fixed` anchors to the demo container
// rather than the page viewport. Without this it leaks into the registry-site
// layout.
const containBlock = 'min-h-0 h-[400px] [transform:translate(0)] rounded-lg border overflow-hidden'

export default function SidebarDemo() {
  return (
    <>
      <Story title="Default" description="Collapsible sidebar with header, group label, and menu items.">
        <SidebarProvider className={containBlock}>
          <Sidebar collapsible="none" className="border-r">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-sm font-semibold">My App</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Home className="size-4" /> <span>Home</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Compass className="size-4" /> <span>Explore</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Settings className="size-4" /> <span>Settings</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4">
            <SidebarTrigger />
            <p className="text-muted-foreground mt-4 text-sm">Main content area.</p>
          </main>
        </SidebarProvider>
      </Story>

      <Story
        title="Collapsible icon"
        description="collapsible='icon' shrinks the sidebar to a 48px rail with icon-only buttons when toggled."
      >
        <SidebarProvider className={containBlock}>
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-3">
                <Star className="size-4" />
                <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">Workspace</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigate</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Inbox">
                      {' '}
                      <Inbox className="size-4" /> <span>Inbox</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Calendar">
                      <Calendar className="size-4" /> <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Search">
                      <Search className="size-4" /> <span>Search</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <main className="flex-1 p-4">
            <SidebarTrigger />
            <p className="text-muted-foreground mt-4 text-sm">Toggle the trigger to collapse the sidebar to icons.</p>
          </main>
        </SidebarProvider>
      </Story>

      <Story
        title="Floating variant"
        description="variant='floating' detaches the sidebar from the edge with rounded corners and a subtle shadow."
      >
        <SidebarProvider className={`${containBlock} bg-muted/30`}>
          <Sidebar variant="floating" collapsible="none">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="text-sm font-semibold">Floating</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Home className="size-4" /> <span>Home</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Users className="size-4" /> <span>Team</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4">
            <p className="text-muted-foreground text-sm">Floating sidebar with rounded corners.</p>
          </main>
        </SidebarProvider>
      </Story>

      <Story
        title="Inset variant"
        description="variant='inset' nests the main content inside a rounded card so the sidebar sits flush against the page edge."
      >
        <SidebarProvider className={`${containBlock} bg-muted/40`}>
          <Sidebar variant="inset" collapsible="none">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="text-sm font-semibold">Inset</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Home className="size-4" /> <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Bell className="size-4" /> <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <p className="text-muted-foreground p-4 text-sm">Main content sits inside a rounded inset card.</p>
          </SidebarInset>
        </SidebarProvider>
      </Story>

      <Story
        title="Nested submenus"
        description="SidebarMenuSub + SidebarMenuSubItem render an indented child menu under a parent button."
      >
        <SidebarProvider className={containBlock}>
          <Sidebar collapsible="none" className="border-r">
            <SidebarHeader>
              <div className="px-4 py-3 text-sm font-semibold">Docs</div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Library</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Home className="size-4" /> <span>Getting started</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <ChevronDown className="size-4" /> <span>Components</span>{' '}
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">Button</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#" isActive>
                          Card
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">Dialog</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Settings className="size-4" /> <span>Settings</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4">
            <SidebarTrigger />
          </main>
        </SidebarProvider>
      </Story>

      <Story
        title="Badges and actions"
        description="SidebarMenuBadge for counts and SidebarMenuAction for hover-revealed icon buttons on each row."
      >
        <SidebarProvider className={containBlock}>
          <Sidebar collapsible="none" className="border-r">
            <SidebarHeader>
              <div className="px-4 py-3 text-sm font-semibold">Mail</div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Folders</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Inbox className="size-4" /> <span>Inbox</span>{' '}
                    </SidebarMenuButton>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Star className="size-4" /> <span>Starred</span>{' '}
                    </SidebarMenuButton>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Bell className="size-4" /> <span>Updates</span>{' '}
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal className="size-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      {' '}
                      <Plus className="size-4" /> <span>New folder</span>{' '}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4">
            <SidebarTrigger />
            <p className="text-muted-foreground mt-4 text-sm">Hover the Updates row to reveal its action.</p>
          </main>
        </SidebarProvider>
      </Story>
    </>
  )
}
