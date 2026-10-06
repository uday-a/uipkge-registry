<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
  } from '@svelte-registry/sidebar'
  import { Bell, Calendar, Compass, Home, Inbox, MoreHorizontal, Plus, Search, Settings, Star, Users } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  // Each story wraps its SidebarProvider in `[transform:translate(0)]` so
  // the Sidebar's internal `position: fixed` anchors to the demo container
  // rather than the page viewport. Without this it leaks into the site layout.
  const containBlock = 'min-h-0 h-[400px] [transform:translate(0)] rounded-lg border overflow-hidden'
</script>

{#if story === 'Default'}
  <SidebarProvider class={containBlock}>
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
              <SidebarMenuButton><Home class="size-4" /> <span>Home</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton><Compass class="size-4" /> <span>Explore</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton><Settings class="size-4" /> <span>Settings</span></SidebarMenuButton>
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
{/if}

{#if story === 'Collapsible icon'}
  <SidebarProvider class={containBlock}>
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
              <SidebarMenuButton tooltip="Home"><Home class="size-4" /> <span>Home</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Inbox"><Inbox class="size-4" /> <span>Inbox</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calendar"><Calendar class="size-4" /> <span>Calendar</span></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings"><Settings class="size-4" /> <span>Settings</span></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <main class="flex-1 p-4">
      <SidebarTrigger />
      <p class="text-muted-foreground mt-4 text-sm">Toggle the trigger (or press Ctrl/⌘+B) to collapse to icons.</p>
    </main>
  </SidebarProvider>
{/if}

{#if story === 'Floating variant'}
  <SidebarProvider class={containBlock}>
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div class="flex items-center gap-2 px-4 py-3">
          <span class="text-sm font-semibold group-data-[collapsible=icon]:hidden">Floating</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton><Home class="size-4" /> <span>Home</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton><Users class="size-4" /> <span>Team</span></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main class="flex-1 p-4">
      <SidebarTrigger />
      <p class="text-muted-foreground mt-4 text-sm">Detached card-style sidebar.</p>
    </main>
  </SidebarProvider>
{/if}

{#if story === 'Inset variant'}
  <SidebarProvider class={containBlock}>
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div class="flex items-center gap-2 px-4 py-3">
          <span class="text-sm font-semibold group-data-[collapsible=icon]:hidden">Inset</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton><Home class="size-4" /> <span>Home</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton><Search class="size-4" /> <span>Search</span></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <div class="flex items-center gap-2 p-4">
        <SidebarTrigger />
        <span class="text-sm font-medium">Dashboard</span>
      </div>
      <p class="text-muted-foreground px-4 text-sm">Content sits inside a rounded card.</p>
    </SidebarInset>
  </SidebarProvider>
{/if}

{#if story === 'Nested submenus'}
  <SidebarProvider class={containBlock}>
    <Sidebar collapsible="none" class="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton><Home class="size-4" /> <span>Overview</span></SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton isActive><span>Active sprint</span></SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton><span>Backlog</span></SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton><span>Archive</span></SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton><Bell class="size-4" /> <span>Notifications</span></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main class="flex-1 p-4">
      <p class="text-muted-foreground text-sm">Main content area.</p>
    </main>
  </SidebarProvider>
{/if}

{#if story === 'Badges and actions'}
  <SidebarProvider class={containBlock}>
    <Sidebar collapsible="none" class="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mailbox</SidebarGroupLabel>
          <SidebarGroupAction><Plus class="size-4" /></SidebarGroupAction>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive><Inbox class="size-4" /> <span>Inbox</span></SidebarMenuButton>
              <SidebarMenuBadge>12</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton><Star class="size-4" /> <span>Starred</span></SidebarMenuButton>
              <SidebarMenuAction showOnHover><MoreHorizontal class="size-4" /></SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main class="flex-1 p-4">
      <p class="text-muted-foreground text-sm">Hover “Starred” to reveal its row action.</p>
    </main>
  </SidebarProvider>
{/if}
