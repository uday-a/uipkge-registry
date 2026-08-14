'use client'

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
// e.g. <SidebarProvider style={{ '--sidebar-width': '19.5rem',
//                                '--sidebar-width-icon': '3.5rem' }}>
// The vars set on <Sidebar> itself are too deep -- the layout-allocating
// wrapper sits above it and reads the provider's vars.
//
// To wire to your router, replace the state-based switch with route matches
// (e.g. set active = 'projects' on /projects/*).

import * as React from 'react'
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
} from 'lucide-react'
import { useTheme } from 'next-themes'
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

type RailId = 'home' | 'projects' | 'inbox' | 'messages' | 'support' | 'settings'

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

const titles: Record<RailId, string> = {
  home: 'Workspace',
  projects: 'Projects',
  inbox: 'Inbox',
  messages: 'Messages',
  support: 'Support',
  settings: 'Settings',
}

export function Sidebar05() {
  const { isMobile, state, setOpen } = useSidebar()
  const { theme, setTheme } = useTheme()

  // `mounted` stays false during SSR + the client's first synchronous
  // render, so isDark is also false on both sides -- no hydration
  // mismatch on the Sun/Moon icon. Once hydration settles the effect
  // flips the flag and the computed re-runs against the real
  // matchMedia/system signal. The transition reads as a fast icon
  // swap instead of a React hydration warning.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const isDark =
    mounted && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))

  const [active, setActive] = React.useState<RailId>('home')

  // Slack-style rail click: expand the panel if collapsed, or collapse if
  // the user clicks the already-active icon while expanded. On mobile the
  // sheet open/close is owned by the inset trigger, so we just swap active.
  function selectRail(id: RailId) {
    if (isMobile) {
      setActive(id)
      return
    }
    if (state === 'expanded' && active === id) {
      setOpen(false)
      return
    }
    setActive(id)
    setOpen(true)
  }

  return (
    // Single Sidebar primitive containing BOTH rails inline. On desktop the
    // rail (56px) stays visible when the sidebar is collapsed thanks to
    // collapsible="icon" + --sidebar-width-icon: 3.5rem; the panel is
    // hidden only when state=collapsed. On mobile the kit's <Sheet>
    // renders the entire dual rail inside a single sheet pane.
    <Sidebar collapsible="icon">
      <div className="flex h-full w-full">
        {/* Thin icon rail -- 56px wide. Clicking an icon updates `active`
            which swaps the main panel content below. */}
        <aside className="border-sidebar-border flex w-14 shrink-0 flex-col items-center gap-0.5 border-r py-2">
          <button
            type="button"
            aria-label="uipkge"
            className="bg-sidebar-primary text-sidebar-primary-foreground mb-1 flex aspect-square size-9 items-center justify-center rounded-lg shadow-sm ring-1 ring-white/10 transition-transform ring-inset hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <rect x="2" y="2" width="9" height="9" rx="1.5" />
              <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
              <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
              <rect x="13" y="13" width="9" height="9" rx="1.5" />
            </svg>
          </button>

          {rail.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={active === item.id ? 'page' : undefined}
              className={[
                'relative flex aspect-square size-9 items-center justify-center rounded-lg transition-colors',
                active === item.id
                  ? 'bg-sidebar-accent text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
              ].join(' ')}
              onClick={() => selectRail(item.id)}
            >
              {active === item.id && (
                <span className="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full" />
              )}
              <item.icon className="size-4" />
            </button>
          ))}

          <div className="bg-sidebar-border/70 my-2 h-px w-7" />

          {railLower.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={active === item.id ? 'page' : undefined}
              className={[
                'relative flex aspect-square size-9 items-center justify-center rounded-lg transition-colors',
                active === item.id
                  ? 'bg-sidebar-accent text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
              ].join(' ')}
              onClick={() => selectRail(item.id)}
            >
              {active === item.id && (
                <span className="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full" />
              )}
              <item.icon className="size-4" />
            </button>
          ))}

          <div className="mt-auto flex flex-col items-center gap-1.5">
            <button
              type="button"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground flex aspect-square size-9 items-center justify-center rounded-lg transition-colors"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="James Carter"
                  className="ring-offset-sidebar focus-visible:ring-ring data-[state=open]:ring-ring rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none data-[state=open]:ring-2"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                      JC
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? 'top' : 'right'}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-xs">
                        JC
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 leading-tight">
                      <span className="truncate font-medium">James Carter</span>
                      <span className="text-muted-foreground truncate text-xs">Admin</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Send className="size-4" /> Invite teammates
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="size-4" /> Workspace settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main panel -- header is the same for every section; the content
            area swaps based on `active`. Each section's rows are spelled out
            inline so consumers can edit them in place.
            Hidden on desktop when state=collapsed (rail stays). The mobile
            <Sheet> branch in <Sidebar> has no data-collapsible group, so this
            rule never applies on mobile -- the sheet always shows rail + panel. */}
        <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg">
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="2" width="9" height="9" rx="1.5" />
                      <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
                      <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
                      <rect x="13" y="13" width="9" height="9" rx="1.5" />
                    </svg>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-display truncate font-bold">uipkge</span>
                    <span className="text-muted-foreground truncate text-xs">{titles[active]}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <div className="px-1 pt-1">
              <SidebarInput
                type="text"
                placeholder="Search..."
                allowClear
                prefix={<Search className="text-muted-foreground size-3.5" />}
                suffix={
                  <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1 font-mono text-xs font-medium select-none">
                    <span>&#8984;</span>F
                  </kbd>
                }
              />
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* HOME: full workspace nav */}
            {active === 'home' && (
              <>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive>
                          <LayoutDashboard className="size-4" />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Users className="size-4" />
                          <span>Employees</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Briefcase className="size-4" />
                          <span>Clients</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Folder className="size-4" />
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
                          <Calendar className="size-4" />
                          <span>Calendar</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <ClipboardList className="size-4" />
                          <span>Attendance</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Mail className="size-4" />
                          <span>Mail</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <ChartLine className="size-4" />
                          <span>Analytics</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}

            {/* PROJECTS: pinned and recent projects */}
            {active === 'projects' && (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel>Pinned</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <div className="bg-chart-1 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white">
                            <Folder className="size-3" />
                          </div>
                          <span>Shift Planner</span>
                          <Star className="text-warning ml-auto size-3.5 fill-current" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <div className="bg-chart-2 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white">
                            <Folder className="size-3" />
                          </div>
                          <span>Training Portal</span>
                          <Star className="text-warning ml-auto size-3.5 fill-current" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <div className="bg-chart-3 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white">
                            <Folder className="size-3" />
                          </div>
                          <span>Performance Hub</span>
                          <Star className="text-warning ml-auto size-3.5 fill-current" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <div className="bg-chart-4 flex aspect-square size-5 shrink-0 items-center justify-center rounded-md text-white">
                            <Folder className="size-3" />
                          </div>
                          <span>Expense Claims</span>
                          <Star className="text-warning ml-auto size-3.5 fill-current" />
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
                          <Folder className="size-4" />
                          <span>Onboarding 2026</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Folder className="size-4" />
                          <span>Q1 hiring plan</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Folder className="size-4" />
                          <span>Compliance refresh</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}

            {/* INBOX: notifications list */}
            {active === 'inbox' && (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel>Today</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Inbox className="size-4" />
                          <span>3 PTO requests pending</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Bell className="size-4" />
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
                          <FileText className="size-4" />
                          <span>5 contracts awaiting sign-off</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Users className="size-4" />
                          <span>2 new hires start Monday</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}

            {/* MESSAGES: conversations */}
            {active === 'messages' && (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel>Direct messages</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Avatar className="size-5">
                            <AvatarFallback className="bg-chart-1/15 text-foreground text-xs">OB</AvatarFallback>
                          </Avatar>
                          <span>Olivia Bennett</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Avatar className="size-5">
                            <AvatarFallback className="bg-chart-2/15 text-foreground text-xs">DM</AvatarFallback>
                          </Avatar>
                          <span>Daniel Morgan</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Avatar className="size-5">
                            <AvatarFallback className="bg-chart-3/15 text-foreground text-xs">ER</AvatarFallback>
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
                          <MessageSquare className="size-4" />
                          <span># announcements</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <MessageSquare className="size-4" />
                          <span># hiring</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}

            {/* SUPPORT: help links */}
            {active === 'support' && (
              <SidebarGroup>
                <SidebarGroupLabel>Help center</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <HelpCircle className="size-4" />
                        <span>Getting started</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <FileText className="size-4" />
                        <span>Onboarding guide</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Send className="size-4" />
                        <span>Contact support</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* SETTINGS: workspace settings */}
            {active === 'settings' && (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <SettingsIcon className="size-4" />
                          <span>General</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Users className="size-4" />
                          <span>Members</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <CreditCard className="size-4" />
                          <span>Billing</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Gauge className="size-4" />
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
                          <Lock className="size-4" />
                          <span>Security</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Bell className="size-4" />
                          <span>Notifications</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}
          </SidebarContent>
        </div>
      </div>
    </Sidebar>
  )
}
