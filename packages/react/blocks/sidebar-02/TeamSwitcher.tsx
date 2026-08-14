'use client'

// Edit teams + activeTeam below to match your tenant model. The dropdown
// is the full team switcher pattern -- avatar tile, label, kbd shortcut,
// and a "Add team" footer row. Wire setActive() to your tenant API.

import * as React from 'react'
import { AudioWaveform, Check, ChevronsUpDown, Command, Plus, type LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

// 4-quadrant uipkge logo. Inline component so it can sit next to Lucide
// icons in the teams array without an extra file.
const UipkgeMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <rect x="2" y="2" width="9" height="9" rx="1.5" />
    <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
    <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
    <rect x="13" y="13" width="9" height="9" rx="1.5" />
  </svg>
)

type Team = {
  name: string
  logo: LucideIcon | ((props: { className?: string }) => React.ReactElement)
  plan: string
}

const teams: Team[] = [
  { name: 'uipkge', logo: UipkgeMark, plan: 'UI registry' },
  { name: 'uipkge HRMS', logo: AudioWaveform, plan: 'Vertical' },
  { name: 'uipkge Hospital', logo: Command, plan: 'Vertical' },
]

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState<Team>(teams[0]!)
  const ActiveLogo = activeTeam.logo

  return (
    <SidebarMenu data-slot="sidebar-02">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-6">
                <ActiveLogo className="size-4 group-data-[collapsible=icon]:size-3.5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-display truncate font-bold">{activeTeam.name}</span>
                <span className="text-muted-foreground truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
            {teams.map((team, i) => {
              const Logo = team.logo
              return (
                <DropdownMenuItem key={team.name} className="gap-2 p-2" onSelect={() => setActiveTeam(team)}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                  {activeTeam === team ? (
                    <Check className="ml-auto size-4" />
                  ) : (
                    <DropdownMenuShortcut>⌘{i + 1}</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
