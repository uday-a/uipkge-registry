<script setup lang="ts">
// Colorful, customised HRMS-style sidebar -- branded project tiles, badges,
// status dots, and a user pill footer. Every row is spelled out inline so
// you can swap colors and labels in place.

import {
  Briefcase,
  Calendar,
  ChartLine,
  ChevronsUpDown,
  ClipboardList,
  Folder,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Monitor,
  Moon,
  Palette,
  Search,
  Send,
  Settings as SettingsIcon,
  Star,
  Sun,
  Users,
} from 'lucide-vue-next'
import { useTheme } from '~/composables/useTheme'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'

const { isMobile } = useSidebar()
const { theme, setTheme } = useTheme()
</script>

<template>
  <Sidebar data-slot="sidebar-06" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="uipkge" class="group-data-[collapsible=icon]:!justify-center">
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg shadow-sm group-data-[collapsible=icon]:size-6"
            >
              <svg
                viewBox="0 0 24 24"
                class="size-4 group-data-[collapsible=icon]:size-3.5"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="9" height="9" rx="1.5" />
                <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
                <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
                <rect x="13" y="13" width="9" height="9" rx="1.5" />
              </svg>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="font-display truncate font-bold">uipkge</span>
              <span class="text-muted-foreground truncate text-xs">uipkge.dev</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <div class="px-1 pt-1 group-data-[collapsible=icon]:hidden">
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
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton is-active tooltip="Dashboard">
                <LayoutDashboard class="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Employees">
                <Users class="size-4" />
                <span>Employees</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Clients">
                <Briefcase class="size-4" />
                <span>Clients</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Projects">
                <Folder class="size-4" />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Workforce</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calendar">
                <Calendar class="size-4" />
                <span>Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Attendance">
                <ClipboardList class="size-4" />
                <span>Attendance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Inbox">
                <Inbox class="size-4" />
                <span>Inbox</span>
              </SidebarMenuButton>
              <SidebarMenuBadge class="bg-destructive text-white">6</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Analytics">
                <ChartLine class="size-4" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Shift Planner">
                <div
                  class="bg-chart-1 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                >
                  <Folder class="size-3" />
                </div>
                <span>Shift Planner</span>
              </SidebarMenuButton>
              <SidebarMenuBadge class="text-warning">
                <Star class="size-3.5 fill-current" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Training Portal">
                <div
                  class="bg-chart-2 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                >
                  <GraduationCap class="size-3" />
                </div>
                <span>Training Portal</span>
              </SidebarMenuButton>
              <SidebarMenuBadge class="text-warning">
                <Star class="size-3.5 fill-current" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Performance Hub">
                <div
                  class="bg-chart-3 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                >
                  <HeartPulse class="size-3" />
                </div>
                <span>Performance Hub</span>
              </SidebarMenuButton>
              <SidebarMenuBadge class="text-warning">
                <Star class="size-3.5 fill-current" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Expense Claims">
                <div
                  class="bg-chart-4 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white"
                >
                  <ChartLine class="size-3" />
                </div>
                <span>Expense Claims</span>
              </SidebarMenuButton>
              <SidebarMenuBadge class="text-warning">
                <Star class="size-3.5 fill-current" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>My team</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Olivia Bennett">
                <Avatar class="size-5">
                  <AvatarFallback class="bg-chart-1/15 text-foreground text-xs">OB</AvatarFallback>
                </Avatar>
                <span>Olivia Bennett</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                <span class="bg-destructive size-1.5 rounded-full" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Daniel Morgan">
                <Avatar class="size-5">
                  <AvatarFallback class="bg-chart-2/15 text-foreground text-xs">DM</AvatarFallback>
                </Avatar>
                <span>Daniel Morgan</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                <span class="bg-warning size-1.5 rounded-full" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Ethan Reynolds">
                <Avatar class="size-5">
                  <AvatarFallback class="bg-chart-3/15 text-foreground text-xs">ER</AvatarFallback>
                </Avatar>
                <span>Ethan Reynolds</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                <span class="bg-success size-1.5 rounded-full" />
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Administration</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon class="size-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Help center">
                <HelpCircle class="size-4" />
                <span>Help center</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center"
              >
                <div class="relative shrink-0">
                  <Avatar class="h-8 w-8 rounded-lg group-data-[collapsible=icon]:size-6">
                    <AvatarFallback class="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-xs"
                      >JC</AvatarFallback
                    >
                  </Avatar>
                  <span
                    class="bg-destructive ring-sidebar absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2"
                  />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span class="truncate font-medium">James Carter</span>
                  <span class="text-muted-foreground truncate text-xs">Admin</span>
                </div>
                <ChevronsUpDown class="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              :side="isMobile ? 'bottom' : 'right'"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel>James Carter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem> <Send class="size-4" /> Invite teammates </DropdownMenuItem>
              <DropdownMenuItem> <SettingsIcon class="size-4" /> Workspace settings </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette class="size-4" />
                  Theme
                  <span class="text-muted-foreground ml-auto text-xs capitalize">{{ theme }}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent class="min-w-36">
                  <DropdownMenuRadioGroup
                    :model-value="theme"
                    @update:model-value="(v) => setTheme(v as 'light' | 'dark' | 'system')"
                  >
                    <DropdownMenuRadioItem value="light"> <Sun class="size-4" /> Light </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark"> <Moon class="size-4" /> Dark </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system"> <Monitor class="size-4" /> System </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
