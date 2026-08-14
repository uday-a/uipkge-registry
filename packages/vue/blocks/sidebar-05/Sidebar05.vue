<script setup lang="ts">
// Dual-rail sidebar with master/detail behavior. The thin rail picks the
// section; the main panel renders the rows for the active section. One
// <Sidebar collapsible="icon"> contains rail + panel as inline flex siblings.
//
// Desktop: when collapsed (toggle clicked), the kit shrinks the sidebar to
// --sidebar-width-icon. We set that to 3.5rem so only the rail stays.
// The panel is hidden via group-data-[collapsible=icon] which only fires
// on the desktop branch of <Sidebar> (the mobile <Sheet> has no `group`
// ancestor with that attr, so mobile sheet always shows rail+panel).
//
// IMPORTANT: the parent <SidebarProvider> must set BOTH custom widths,
// e.g. <SidebarProvider :style="{ '--sidebar-width': '19.5rem',
//                                  '--sidebar-width-icon': '3.5rem' }">
// The vars set on <Sidebar> itself are too deep -- the layout-allocating
// wrapper sits above it and reads the provider's vars.
//
// To wire to your router, replace the ref-based switch with route matches
// (e.g. set active = 'projects' on /projects/*).

import { computed, onMounted, ref } from 'vue'
import { useTheme } from '~/composables/useTheme'
import {
  Bell,
  Briefcase,
  Calendar,
  ChartLine,
  ChevronsUpDown,
  ClipboardList,
  CreditCard,
  FileText,
  Folder,
  Gauge,
  Headphones,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Moon,
  Search,
  Send,
  Settings as SettingsIcon,
  Star,
  Sun,
  Users,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const { isMobile, state, setOpen } = useSidebar()
const { theme, setTheme } = useTheme()
// `mounted` stays false during SSR + the client's first synchronous
// render, so isDark is also false on both sides -- no hydration
// mismatch on the Sun/Moon icon. Once hydration settles `onMounted`
// flips the flag and the computed re-runs against the real
// matchMedia/system signal. The transition reads as a fast icon
// swap instead of a Vue hydration warning.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
const isDark = computed(
  () =>
    mounted.value &&
    (theme.value === 'dark' || (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)),
)

type RailId = 'home' | 'projects' | 'inbox' | 'messages' | 'support' | 'settings'

const active = ref<RailId>('home')

const rail = [
  { id: 'home' as const, icon: Home, label: 'Home' },
  { id: 'projects' as const, icon: Folder, label: 'Projects' },
  { id: 'inbox' as const, icon: Bell, label: 'Inbox' },
  { id: 'messages' as const, icon: MessageSquare, label: 'Messages' },
]
const railLower = [
  { id: 'support' as const, icon: Headphones, label: 'Support' },
  { id: 'settings' as const, icon: SettingsIcon, label: 'Settings' },
]

// Slack-style rail click: expand the panel if collapsed, or collapse if
// the user clicks the already-active icon while expanded. On mobile the
// sheet open/close is owned by the inset trigger, so we just swap active.
function selectRail(id: RailId) {
  if (isMobile.value) {
    active.value = id
    return
  }
  if (state.value === 'expanded' && active.value === id) {
    setOpen(false)
    return
  }
  active.value = id
  setOpen(true)
}

const titles: Record<RailId, string> = {
  home: 'Workspace',
  projects: 'Projects',
  inbox: 'Inbox',
  messages: 'Messages',
  support: 'Support',
  settings: 'Settings',
}
</script>

<template>
  <!-- Single Sidebar primitive containing BOTH rails inline. On desktop the
       rail (56px) stays visible when the sidebar is collapsed thanks to
       collapsible="icon" + --sidebar-width-icon: 3.5rem; the panel is
       hidden only when state=collapsed. On mobile the kit's <Sheet>
       renders the entire dual rail inside a single sheet pane. -->
  <Sidebar collapsible="icon">
    <div class="flex h-full w-full">
      <!-- Thin icon rail -- 56px wide. Clicking an icon updates `active`
           which swaps the main panel content below. -->
      <aside class="border-sidebar-border flex w-14 shrink-0 flex-col items-center gap-0.5 border-r py-2">
        <button
          type="button"
          aria-label="uipkge"
          class="bg-sidebar-primary text-sidebar-primary-foreground mb-1 flex aspect-square size-9 items-center justify-center rounded-lg shadow-sm ring-1 ring-white/10 transition-transform ring-inset hover:scale-105"
        >
          <svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true">
            <rect x="2" y="2" width="9" height="9" rx="1.5" />
            <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
            <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
            <rect x="13" y="13" width="9" height="9" rx="1.5" />
          </svg>
        </button>

        <button
          v-for="item in rail"
          :key="item.id"
          type="button"
          :aria-label="item.label"
          :aria-current="active === item.id ? 'page' : undefined"
          :class="[
            'relative flex aspect-square size-9 items-center justify-center rounded-lg transition-colors',
            active === item.id
              ? 'bg-sidebar-accent text-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
          ]"
          @click="selectRail(item.id)"
        >
          <span
            v-if="active === item.id"
            class="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
          />
          <component :is="item.icon" class="size-4" />
        </button>

        <div class="bg-sidebar-border/70 my-2 h-px w-7" />

        <button
          v-for="item in railLower"
          :key="item.id"
          type="button"
          :aria-label="item.label"
          :aria-current="active === item.id ? 'page' : undefined"
          :class="[
            'relative flex aspect-square size-9 items-center justify-center rounded-lg transition-colors',
            active === item.id
              ? 'bg-sidebar-accent text-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
          ]"
          @click="selectRail(item.id)"
        >
          <span
            v-if="active === item.id"
            class="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
          />
          <component :is="item.icon" class="size-4" />
        </button>

        <div class="mt-auto flex flex-col items-center gap-1.5">
          <button
            type="button"
            :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
            class="text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground flex aspect-square size-9 items-center justify-center rounded-lg transition-colors"
            @click="setTheme(isDark ? 'light' : 'dark')"
          >
            <Sun v-if="isDark" class="size-4" />
            <Moon v-else class="size-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                type="button"
                aria-label="James Carter"
                class="ring-offset-sidebar focus-visible:ring-ring data-[state=open]:ring-ring rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none data-[state=open]:ring-2"
              >
                <Avatar class="size-8">
                  <AvatarFallback class="bg-sidebar-accent text-sidebar-accent-foreground text-xs">JC</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="min-w-56 rounded-lg"
              :side="isMobile ? 'top' : 'right'"
              align="end"
              :side-offset="8"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar class="size-8 rounded-lg">
                    <AvatarFallback class="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-xs"
                      >JC</AvatarFallback
                    >
                  </Avatar>
                  <div class="grid flex-1 leading-tight">
                    <span class="truncate font-medium">James Carter</span>
                    <span class="text-muted-foreground truncate text-xs">Admin</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem> <Send class="size-4" /> Invite teammates </DropdownMenuItem>
              <DropdownMenuItem> <SettingsIcon class="size-4" /> Workspace settings </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <!-- Main panel -- header is the same for every section; the content
           area swaps based on `active`. Each section's rows are spelled out
           inline so consumers can edit them in place.
           Hidden on desktop when state=collapsed (rail stays). The mobile
           <Sheet> branch in <Sidebar> has no data-collapsible group, so this
           rule never applies on mobile -- the sheet always shows rail + panel. -->
      <div class="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg"
                >
                  <svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true">
                    <rect x="2" y="2" width="9" height="9" rx="1.5" />
                    <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
                    <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
                    <rect x="13" y="13" width="9" height="9" rx="1.5" />
                  </svg>
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="font-display truncate font-bold">uipkge</span>
                  <span class="text-muted-foreground truncate text-xs">{{ titles[active] }}</span>
                </div>
                <ChevronsUpDown class="ml-auto size-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div class="px-1 pt-1">
            <SidebarInput type="text" placeholder="Search..." :allow-clear="true">
              <template #prefix>
                <Search class="text-muted-foreground size-3.5" />
              </template>
              <template #suffix>
                <kbd
                  class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1 font-mono text-xs font-medium select-none"
                >
                  <span>&#8984;</span>F
                </kbd>
              </template>
            </SidebarInput>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <!-- HOME: full workspace nav -->
          <template v-if="active === 'home'">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton is-active>
                      <LayoutDashboard class="size-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users class="size-4" />
                      <span>Employees</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Briefcase class="size-4" />
                      <span>Clients</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Folder class="size-4" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Workforce</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Calendar class="size-4" />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ClipboardList class="size-4" />
                      <span>Attendance</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Mail class="size-4" />
                      <span>Mail</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ChartLine class="size-4" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </template>

          <!-- PROJECTS: pinned and recent projects -->
          <template v-else-if="active === 'projects'">
            <SidebarGroup>
              <SidebarGroupLabel>Pinned</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <div
                        class="bg-chart-1 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                      >
                        <Folder class="size-3" />
                      </div>
                      <span>Shift Planner</span>
                      <Star class="text-warning ml-auto size-3.5 fill-current" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <div
                        class="bg-chart-2 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                      >
                        <Folder class="size-3" />
                      </div>
                      <span>Training Portal</span>
                      <Star class="text-warning ml-auto size-3.5 fill-current" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <div
                        class="bg-chart-3 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                      >
                        <Folder class="size-3" />
                      </div>
                      <span>Performance Hub</span>
                      <Star class="text-warning ml-auto size-3.5 fill-current" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <div
                        class="bg-chart-4 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                      >
                        <Folder class="size-3" />
                      </div>
                      <span>Expense Claims</span>
                      <Star class="text-warning ml-auto size-3.5 fill-current" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Recent</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Folder class="size-4" />
                      <span>Onboarding 2026</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Folder class="size-4" />
                      <span>Q1 hiring plan</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Folder class="size-4" />
                      <span>Compliance refresh</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </template>

          <!-- INBOX: notifications list -->
          <template v-else-if="active === 'inbox'">
            <SidebarGroup>
              <SidebarGroupLabel>Today</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Inbox class="size-4" />
                      <span>3 PTO requests pending</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Bell class="size-4" />
                      <span>Payroll cycle closes today</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>This week</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText class="size-4" />
                      <span>5 contracts awaiting sign-off</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users class="size-4" />
                      <span>2 new hires start Monday</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </template>

          <!-- MESSAGES: conversations -->
          <template v-else-if="active === 'messages'">
            <SidebarGroup>
              <SidebarGroupLabel>Direct messages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Avatar class="size-5">
                        <AvatarFallback class="bg-chart-1/15 text-foreground text-xs">OB</AvatarFallback>
                      </Avatar>
                      <span>Olivia Bennett</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Avatar class="size-5">
                        <AvatarFallback class="bg-chart-2/15 text-foreground text-xs">DM</AvatarFallback>
                      </Avatar>
                      <span>Daniel Morgan</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Avatar class="size-5">
                        <AvatarFallback class="bg-chart-3/15 text-foreground text-xs">ER</AvatarFallback>
                      </Avatar>
                      <span>Ethan Reynolds</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Channels</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MessageSquare class="size-4" />
                      <span># announcements</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MessageSquare class="size-4" />
                      <span># hiring</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </template>

          <!-- SUPPORT: help links -->
          <template v-else-if="active === 'support'">
            <SidebarGroup>
              <SidebarGroupLabel>Help center</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HelpCircle class="size-4" />
                      <span>Getting started</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText class="size-4" />
                      <span>Onboarding guide</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Send class="size-4" />
                      <span>Contact support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </template>

          <!-- SETTINGS: workspace settings -->
          <template v-else-if="active === 'settings'">
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SettingsIcon class="size-4" />
                      <span>General</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users class="size-4" />
                      <span>Members</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <CreditCard class="size-4" />
                      <span>Billing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Gauge class="size-4" />
                      <span>Limits</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Lock class="size-4" />
                      <span>Security</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Bell class="size-4" />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </template>
        </SidebarContent>
      </div>
    </div>
  </Sidebar>
</template>
