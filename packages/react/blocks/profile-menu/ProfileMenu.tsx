'use client'

import * as React from 'react'
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  name: string
  email: string
  avatar?: string
}

type ProfileMenuKey = 'upgrade' | 'account' | 'billing' | 'notifications' | 'settings' | 'logout'

export interface ProfileMenuProps {
  user?: User
  /** Custom trigger. Receives the resolved user + computed initials. When
   *  omitted, a default avatar button is rendered. */
  trigger?: (ctx: { user: User; initials: string }) => React.ReactNode
  onSelect?: (key: ProfileMenuKey) => void
}

export function ProfileMenu({
  user = { name: 'Alex Morgan', email: 'alex@example.com', avatar: '' },
  trigger,
  onSelect,
}: ProfileMenuProps) {
  const initials = React.useMemo(() => {
    const parts = user.name.trim().split(/\s+/).slice(0, 2)
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U'
  }, [user.name])

  return (
    <DropdownMenu data-slot="profile-menu">
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger({ user, initials })
        ) : (
          <button
            type="button"
            className="hover:bg-accent focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-1 focus-visible:outline-none"
            aria-label="Open profile menu"
          >
            <Avatar className="size-7">
              {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 rounded-lg" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-9 rounded-lg">
              {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onSelect?.('upgrade')}>
            <Sparkles className="size-4" />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onSelect?.('account')}>
            <BadgeCheck className="size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect?.('billing')}>
            <CreditCard className="size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect?.('notifications')}>
            <Bell className="size-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect?.('settings')}>
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onSelect?.('logout')}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
