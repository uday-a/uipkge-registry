'use client'

// App sidebar with a bottom action bar. Workspace pill + search at the top,
// three grouped nav sections, user pill above an icon toolbar (Settings,
// Help, Notifications, Command palette, Log out) anchored at the very
// bottom. Every row is spelled out inline so you can edit in place.

import * as React from 'react'
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
} from 'lucide-react'
import { useTheme } from 'next-themes'
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

export function Sidebar07() {
  const { state } = useSidebar()
  const { theme, setTheme } = useTheme()

  // `mounted` stays false during SSR + the client's first synchronous
  // render, so isDark is also false on both sides -- no hydration
  // mismatch on the Sun/Moon icon. Once hydration settles the effect
  // flips the flag and the computed re-runs against the real
  // matchMedia/system signal. Mirrors the sidebar-05 pattern.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const isDark =
    mounted && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))

  return (
    <Sidebar data-slot="sidebar-07" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="uipkge" className="group-data-[collapsible=icon]:!justify-center">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-6">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 group-data-[collapsible=icon]:size-3.5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="9" height="9" rx="1.5" />
                  <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
                  <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
                  <rect x="13" y="13" width="9" height="9" rx="1.5" />
                </svg>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-display truncate font-semibold">uipkge</span>
                <span className="text-muted-foreground truncate text-xs">uipkge.dev</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-1 pt-1 group-data-[collapsible=icon]:hidden">
          <SidebarInput
            type="text"
            placeholder="Search..."
            allowClear
            prefix={<Search className="text-muted-foreground size-3.5" />}
            suffix={
              <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1 font-mono text-xs font-medium select-none">
                <span>&#8984;</span>K
              </kbd>
            }
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {/* Active row gets a subtle success-tinted gradient to mark it
                    without competing with the rest of the nav. */}
                <SidebarMenuButton
                  isActive
                  tooltip="Analytics"
                  className="data-[active=true]:!bg-success/20 data-[active=true]:!text-foreground"
                >
                  <ChartBar className="size-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Performance">
                  <LineChart className="size-4" />
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
                  <Package className="size-4" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Orders">
                  <ShoppingCart className="size-4" />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Subscribers">
                  <Users className="size-4" />
                  <span>Subscribers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Transactions">
                  <CreditCard className="size-4" />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add content">
            <Plus className="size-4" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Posts">
                  <FileText className="size-4" />
                  <span>Posts</span>
                </SidebarMenuButton>
                <SidebarMenuBadge className="bg-destructive text-white">10</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Pages">
                  <Mail className="size-4" />
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
            <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:!justify-center">
              <Avatar className="size-8 rounded-lg group-data-[collapsible=icon]:size-6">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-xs">
                  SW
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">Sarah Wilson</span>
                <span className="text-muted-foreground truncate text-xs">Admin Account</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {state === 'expanded' ? (
          <>
            <SidebarSeparator className="my-1" />

            {/* Action toolbar -- evenly spaced quick icons. Last button is the
                SidebarTrigger collapse toggle. Replace others with
                <Link> / <button onClick={...}> as needed. */}
            <div className="flex items-center justify-between px-1 pb-1">
              <button
                type="button"
                aria-label="Settings"
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
              >
                <SettingsIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Help"
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
              >
                <HelpCircle className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
              >
                <Bell className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Command palette"
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
              >
                <Command className="size-4" />
              </button>
              <button
                type="button"
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-colors"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <SidebarTrigger className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground size-8 rounded-md" />
            </div>
          </>
        ) : (
          /* Collapsed-state: surface the trigger on its own so the rail always
             has an expand affordance. */
          <div className="flex items-center justify-center pb-1">
            <SidebarTrigger className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground size-8 rounded-md" />
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
