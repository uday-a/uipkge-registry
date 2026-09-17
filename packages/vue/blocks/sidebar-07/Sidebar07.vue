<script setup lang="ts">
// App sidebar with a bottom action bar. Workspace pill + search at the top,
// three grouped nav sections, user pill above an icon toolbar (Settings,
// Help, Notifications, Command palette, Log out) anchored at the very
// bottom. Every row is spelled out inline so you can edit in place.

import { computed, ref, onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
import {
  Bell,
  ChartBar,
  ChevronsUpDown,
  Command,
  CreditCard,
  FileText,
  HelpCircle,
  LineChart,
  Mail,
  Moon,
  Package,
  Plus,
  Search,
  Settings as SettingsIcon,
  ShoppingCart,
  Sun,
  Users,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

const { state } = useSidebar()
const { theme, setTheme } = useTheme()
// `mounted` stays false during SSR + the client's first synchronous
// render, so isDark is also false on both sides -- no hydration
// mismatch on the Sun/Moon icon. Once hydration settles `onMounted`
// flips the flag and the computed re-runs against the real
// matchMedia/system signal. Mirrors the sidebar-05 pattern.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
const isDark = computed(
  () =>
    mounted.value &&
    (theme.value === 'dark' || (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)),
)
</script>

<template>
  <Sidebar data-slot="sidebar-07" collapsible="icon">
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
              <span class="font-display truncate font-semibold">uipkge</span>
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
              <span>&#8984;</span>K
            </kbd>
          </template>
        </SidebarInput>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <!-- Active row gets a subtle success-tinted gradient to mark it
                   without competing with the rest of the nav. -->
              <SidebarMenuButton
                is-active
                tooltip="Analytics"
                class="data-[active=true]:!bg-success/20 data-[active=true]:!text-foreground"
              >
                <ChartBar class="size-4" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Performance">
                <LineChart class="size-4" />
                <span>Performance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Products">
                <Package class="size-4" />
                <span>Products</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Orders">
                <ShoppingCart class="size-4" />
                <span>Orders</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Subscribers">
                <Users class="size-4" />
                <span>Subscribers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Transactions">
                <CreditCard class="size-4" />
                <span>Transactions</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Content</SidebarGroupLabel>
        <SidebarGroupAction aria-label="Add content">
          <Plus class="size-4" />
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Posts">
                <FileText class="size-4" />
                <span>Posts</span>
              </SidebarMenuButton>
              <SidebarMenuBadge class="bg-destructive text-white">10</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pages">
                <Mail class="size-4" />
                <span>Pages</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="group-data-[collapsible=icon]:!justify-center">
            <Avatar class="size-8 rounded-lg group-data-[collapsible=icon]:size-6">
              <AvatarFallback class="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-xs"
                >SW</AvatarFallback
              >
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-medium">Sarah Wilson</span>
              <span class="text-muted-foreground truncate text-xs">Admin Account</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <template v-if="state === 'expanded'">
        <SidebarSeparator class="my-1" />

        <!-- Action toolbar -- evenly spaced quick icons. Last button is the
             SidebarTrigger collapse toggle. Replace others with
             <NuxtLink> / <button @click="..."> as needed. -->
        <div class="flex items-center justify-between px-1 pb-1">
          <button
            type="button"
            aria-label="Settings"
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
          >
            <SettingsIcon class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Help"
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
          >
            <HelpCircle class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
          >
            <Bell class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Command palette"
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
          >
            <Command class="size-4" />
          </button>
          <button
            type="button"
            :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
            @click="setTheme(isDark ? 'light' : 'dark')"
          >
            <Sun v-if="isDark" class="size-4" />
            <Moon v-else class="size-4" />
          </button>
          <SidebarTrigger
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground size-8 rounded-md"
          />
        </div>
      </template>

      <!-- Collapsed-state: surface the trigger on its own so the rail always
           has an expand affordance. -->
      <template v-else>
        <div class="flex items-center justify-center pb-1">
          <SidebarTrigger
            class="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground size-8 rounded-md"
          />
        </div>
      </template>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
