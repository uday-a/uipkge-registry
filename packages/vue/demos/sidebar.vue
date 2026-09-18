<script setup lang="ts">
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
} from '@/components/ui/sidebar'
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
} from 'lucide-vue-next'

// Each Story wraps its SidebarProvider in `style="transform: translate(0)"` so
// the Sidebar component's internal `position: fixed` anchors to the demo
// container rather than the page viewport. Without this it leaks into the
// registry-site layout.
const containBlock = 'min-h-0 h-[400px] [transform:translate(0)] rounded-lg border overflow-hidden'
</script>

<template>
  <Story title="Default" description="Collapsible sidebar with header, group label, and menu items.">
    <SidebarProvider :class="containBlock">
      <Sidebar collapsible="none" class="border-r">
        <SidebarHeader>
          <div class="flex items-center gap-2 px-4 py-3">
            <span class="text-sm font-semibold">My App</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton> <Home class="size-4" /> <span>Home</span> </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Compass class="size-4" /> <span>Explore</span> </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Settings class="size-4" /> <span>Settings</span> </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main class="flex-1 p-4">
        <SidebarTrigger />
        <p class="text-muted-foreground mt-4 text-sm">Main content area.</p>
      </main>
    </SidebarProvider>
  </Story>

  <Story
    title="Collapsible icon"
    description="collapsible='icon' shrinks the sidebar to a 48px rail with icon-only buttons when toggled."
  >
    <SidebarProvider :class="containBlock">
      <Sidebar collapsible="icon" class="border-r">
        <SidebarHeader>
          <div class="flex items-center gap-2 px-4 py-3">
            <Star class="size-4" />
            <span class="text-sm font-semibold group-data-[collapsible=icon]:hidden">Workspace</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigate</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Inbox"> <Inbox class="size-4" /> <span>Inbox</span> </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Calendar">
                  <Calendar class="size-4" /> <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search"> <Search class="size-4" /> <span>Search</span> </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <main class="flex-1 p-4">
        <SidebarTrigger />
        <p class="text-muted-foreground mt-4 text-sm">Toggle the trigger to collapse the sidebar to icons.</p>
      </main>
    </SidebarProvider>
  </Story>

  <Story
    title="Floating variant"
    description="variant='floating' detaches the sidebar from the edge with rounded corners and a subtle shadow."
  >
    <SidebarProvider :class="`${containBlock} bg-muted/30`">
      <Sidebar variant="floating" collapsible="none">
        <SidebarHeader>
          <div class="flex items-center gap-2 px-2 py-2">
            <span class="text-sm font-semibold">Floating</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton> <Home class="size-4" /> <span>Home</span> </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Users class="size-4" /> <span>Team</span> </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main class="flex-1 p-4">
        <p class="text-muted-foreground text-sm">Floating sidebar with rounded corners.</p>
      </main>
    </SidebarProvider>
  </Story>

  <Story
    title="Inset variant"
    description="variant='inset' nests the main content inside a rounded card so the sidebar sits flush against the page edge."
  >
    <SidebarProvider :class="`${containBlock} bg-muted/40`">
      <Sidebar variant="inset" collapsible="none">
        <SidebarHeader>
          <div class="flex items-center gap-2 px-2 py-2">
            <span class="text-sm font-semibold">Inset</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton><Home class="size-4" /> <span>Dashboard</span></SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton><Bell class="size-4" /> <span>Notifications</span></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <p class="text-muted-foreground p-4 text-sm">Main content sits inside a rounded inset card.</p>
      </SidebarInset>
    </SidebarProvider>
  </Story>

  <Story
    title="Nested submenus"
    description="SidebarMenuSub + SidebarMenuSubItem render an indented child menu under a parent button."
  >
    <SidebarProvider :class="containBlock">
      <Sidebar collapsible="none" class="border-r">
        <SidebarHeader>
          <div class="px-4 py-3 text-sm font-semibold">Docs</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton> <Home class="size-4" /> <span>Getting started</span> </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <ChevronDown class="size-4" /> <span>Components</span> </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">Button</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#" is-active>Card</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">Dialog</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Settings class="size-4" /> <span>Settings</span> </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main class="flex-1 p-4">
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  </Story>

  <Story
    title="Badges and actions"
    description="SidebarMenuBadge for counts and SidebarMenuAction for hover-revealed icon buttons on each row."
  >
    <SidebarProvider :class="containBlock">
      <Sidebar collapsible="none" class="border-r">
        <SidebarHeader>
          <div class="px-4 py-3 text-sm font-semibold">Mail</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton> <Inbox class="size-4" /> <span>Inbox</span> </SidebarMenuButton>
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Star class="size-4" /> <span>Starred</span> </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Bell class="size-4" /> <span>Updates</span> </SidebarMenuButton>
                <SidebarMenuAction show-on-hover>
                  <MoreHorizontal class="size-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton> <Plus class="size-4" /> <span>New folder</span> </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main class="flex-1 p-4">
        <SidebarTrigger />
        <p class="text-muted-foreground mt-4 text-sm">Hover the Updates row to reveal its action.</p>
      </main>
    </SidebarProvider>
  </Story>
</template>
