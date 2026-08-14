'use client'

// Full dashboard shell — collapsible sidebar + sticky topbar (sidebar
// trigger, breadcrumb, theme switch, notifications) + main content
// children. Drop it around a page: `<DashboardLayout>{page}</DashboardLayout>`.
//
// NOTE (React port): the Vue original composes the `sidebar-02`,
// `command-palette`, and `notifications-popover` blocks, which don't yet
// exist in the React registry. Until they're ported, the sidebar body is a
// minimal inline nav and notifications is a plain Bell button. Swap them for
// the dedicated blocks once available — the topbar/inset structure here is
// the faithful 1:1 of the Vue shell.
import * as React from 'react'
import { Bell, LayoutDashboard, Users, Settings } from 'lucide-react'
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ThemeSwitch } from '@/components/ui/theme-switch'

interface Crumb {
  label: string
  href?: string
}

export interface DashboardLayoutProps {
  breadcrumbs?: Crumb[]
  user?: { name: string; email: string; avatar?: string }
  onProfileSelect?: (key: string) => void
  onCommandSelect?: (item: { label: string; hint?: string }) => void
  children?: React.ReactNode
}

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'People', icon: Users },
  { label: 'Settings', icon: Settings },
]

export function DashboardLayout({ breadcrumbs = [{ label: 'Dashboard' }], children }: DashboardLayoutProps) {
  return (
    <SidebarProvider data-slot="dashboard-layout">
      <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    <BreadcrumbItem className={i === 0 ? 'hidden md:block' : ''}>
                      {crumb.href && i < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="text-muted-foreground/70 hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {i < breadcrumbs.length - 1 && <BreadcrumbSeparator className={i === 0 ? 'hidden md:block' : ''} />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-1 px-2 sm:gap-3">
            <div className="flex items-center gap-0.5">
              <ThemeSwitch variant="icon-only" />
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative size-8 rounded-lg"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </Button>
              {/* ProfileMenu removed from header: the sidebar's NavUser
                  footer already owns the profile/account affordance. The
                  block still accepts a `user` prop + `onProfileSelect` so
                  consumers can wire those into the sidebar or a custom slot. */}
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 pt-4 pb-4 lg:px-6 lg:pt-6 lg:pb-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
