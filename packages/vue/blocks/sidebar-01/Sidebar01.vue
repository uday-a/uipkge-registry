<script setup lang="ts">
// Edit this file to change brand, navigation, and the user dropdown.
// Every menu item is spelled out below -- copy, remove, or rename rows directly.

import { BarChart3, BookOpen, FileText, Files, History, LayoutDashboard, Table as TableIcon } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import NavUser from './NavUser.vue'
</script>

<template>
  <Sidebar data-slot="sidebar-01" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="uipkge" class="group-data-[collapsible=icon]:!justify-center">
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-6"
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
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <!-- TODO: wrap in NuxtLink / RouterLink and bind :is-active to your route -->
              <SidebarMenuButton is-active tooltip="Dashboard">
                <LayoutDashboard class="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Data tables">
                <TableIcon class="size-4" />
                <span>Data tables</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Forms">
                <FileText class="size-4" />
                <span>Forms</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Charts">
                <BarChart3 class="size-4" />
                <span>Charts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pages">
                <Files class="size-4" />
                <span>Pages</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Resources</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Docs">
                <BookOpen class="size-4" />
                <span>Docs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Changelog">
                <History class="size-4" />
                <span>Changelog</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <NavUser />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
