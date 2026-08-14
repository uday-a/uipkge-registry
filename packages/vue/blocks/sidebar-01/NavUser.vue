<script setup lang="ts">
// Edit this file to change the user dropdown content, avatar, and logout handler.
// The user details are inlined below -- wire them to your auth session in place.

import { BadgeCheck, ChevronsUpDown, LogOut, Monitor, Moon, Palette, Settings, Sun } from 'lucide-vue-next'
import { useTheme } from '~/composables/useTheme'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

const { isMobile } = useSidebar()
const { theme, setTheme } = useTheme()

// Replace these with your auth session.
const user = {
  name: 'Test User',
  email: 'you@example.com',
  initials: 'TU',
}

function handleLogout() {
  // TODO: call your /api/auth/logout endpoint, then redirect.
  console.warn('NavUser: wire handleLogout() to your auth backend')
}
</script>

<template>
  <SidebarMenu data-slot="sidebar-01">
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center"
          >
            <Avatar class="h-8 w-8 shrink-0 rounded-lg group-data-[collapsible=icon]:size-6">
              <AvatarFallback class="rounded-lg text-xs">{{ user.initials }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
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
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarFallback class="rounded-lg">{{ user.initials }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem> <BadgeCheck class="size-4" /> Profile </DropdownMenuItem>
            <DropdownMenuItem> <Settings class="size-4" /> Settings </DropdownMenuItem>
          </DropdownMenuGroup>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut class="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
