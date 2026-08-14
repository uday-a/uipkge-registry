<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import Sidebar02 from '@/components/blocks/sidebar-02/Sidebar02.vue'
import CommandPalette from '@/components/blocks/CommandPalette.vue'
import NotificationsPopover from '@/components/blocks/NotificationsPopover.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { useTheme } from '@/composables/useTheme'

interface Crumb {
  label: string
  href?: string
}

withDefaults(
  defineProps<{
    breadcrumbs?: Crumb[]
    user?: { name: string; email: string; avatar?: string }
  }>(),
  {
    breadcrumbs: () => [{ label: 'Dashboard' }],
    user: () => ({ name: 'Alex Morgan', email: 'alex@example.com' }),
  },
)

const emit = defineEmits<{
  (e: 'profile-select', key: string): void
  (e: 'command-select', item: { label: string; hint?: string }): void
}>()

const { theme, setTheme } = useTheme()

// ThemeSwitch can emit 'black' but useTheme only models light/dark/system;
// fall back to dark so the control still works in this block.
const onThemeChange = (t: 'light' | 'dark' | 'system' | 'black') => setTheme(t === 'black' ? 'dark' : t)
</script>

<template>
  <SidebarProvider data-slot="dashboard-layout">
    <Sidebar02 />
    <SidebarInset>
      <header
        class="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(crumb, i) in breadcrumbs" :key="i">
                <BreadcrumbItem :class="i === 0 ? 'hidden md:block' : ''">
                  <BreadcrumbLink
                    v-if="crumb.href && i < breadcrumbs.length - 1"
                    :href="crumb.href"
                    class="text-muted-foreground/70 hover:text-foreground transition-colors"
                  >
                    {{ crumb.label }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else class="font-medium">{{ crumb.label }}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="i < breadcrumbs.length - 1" :class="i === 0 ? 'hidden md:block' : ''" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="flex items-center gap-1 px-2 sm:gap-3">
          <CommandPalette @select="(item) => emit('command-select', item)" />
          <div class="flex items-center gap-0.5">
            <ThemeSwitch :model-value="theme" variant="icon-only" @update:model-value="onThemeChange" />
            <NotificationsPopover>
              <template #default="{ unreadCount }">
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground relative size-8 rounded-lg"
                  aria-label="Notifications"
                >
                  <Bell class="size-4" />
                  <span
                    v-if="unreadCount > 0"
                    class="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2"
                  />
                </Button>
              </template>
            </NotificationsPopover>
            <!-- ProfileMenu removed from header: the sidebar's NavUser
                 (sidebar-02 footer) already owns the profile/account
                 affordance. Two avatars in the same screen pulled the
                 eye in conflicting directions. The block still accepts
                 a `user` prop + emits `profile-select` so consumers can
                 wire those into NavUser or a custom header slot. -->
          </div>
        </div>
      </header>
      <main class="flex flex-1 flex-col px-4 pt-4 pb-4 lg:px-6 lg:pt-6 lg:pb-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
