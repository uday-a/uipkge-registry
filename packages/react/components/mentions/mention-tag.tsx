'use client'

import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

export interface MentionTagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'popover'> {
  trigger?: string
  name?: string
  handle?: string
  email?: string
  avatar?: string
  bio?: string
  joined?: string
  location?: string
  following?: number | string
  followers?: number | string
  verified?: boolean
  href?: string
  popover?: boolean
  openDelay?: number
  closeDelay?: number
  popupContent?: React.ReactNode
}

export function MentionTag({
  trigger = '@',
  name,
  handle,
  email,
  avatar,
  bio,
  joined,
  location,
  following,
  followers,
  verified,
  href,
  popover = true,
  openDelay = 150,
  closeDelay = 100,
  popupContent,
  className,
  children,
  ...props
}: MentionTagProps) {
  const [isFollowing, setIsFollowing] = React.useState(false)

  const formattedHandle = React.useMemo(() => {
    if (!handle && !name) return ''
    const h = handle || name || ''
    return h.startsWith(trigger) ? h : `${trigger}${h}`
  }, [handle, name, trigger])

  const initials = React.useMemo(() => {
    const source = name || handle || 'U'
    return source.slice(0, 2).toUpperCase()
  }, [name, handle])

  const TagElement = href ? 'a' : 'span'

  const triggerEl = (
    <TagElement
      href={href}
      data-uipkge
      data-slot="mention-tag"
      className={cn(
        'inline-flex cursor-pointer items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors select-none',
        'bg-muted/70 text-foreground hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...(props as any)}
    >
      {children || (
        <>
          <span className="text-primary font-semibold">{trigger}</span>
          <span>{name || handle || email}</span>
        </>
      )}
    </TagElement>
  )

  if (!popover) return triggerEl

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{triggerEl}</HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={6} className="border-border/80 w-80 rounded-xl p-4 shadow-lg">
        {popupContent || (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <Avatar className="ring-border/50 size-12 ring-2">
                {avatar && <AvatarImage src={avatar} alt={name || handle || ''} />}
                <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                className={cn(
                  'h-8 rounded-full px-3.5 text-xs font-semibold transition-[transform,background-color] duration-150 active:scale-95',
                  isFollowing
                    ? 'border-border text-foreground hover:bg-muted border bg-transparent'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFollowing((prev) => !prev)
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-foreground text-sm font-bold tracking-tight">{name || handle}</span>
                {verified && (
                  <span className="text-primary inline-flex" title="Verified">
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-muted-foreground font-mono text-xs">{formattedHandle}</p>
              {email && <p className="text-muted-foreground mt-0.5 text-xs">{email}</p>}
            </div>

            {bio && <p className="text-foreground/90 text-xs leading-relaxed">{bio}</p>}

            {(joined || location) && (
              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                {joined && (
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3.5 opacity-70" />
                    <span>Joined {joined}</span>
                  </div>
                )}
              </div>
            )}

            {(following !== undefined || followers !== undefined) && (
              <div className="border-border/50 flex items-center gap-4 border-t pt-1 text-xs">
                {following !== undefined && (
                  <div>
                    <span className="text-foreground font-bold">{following}</span>
                    <span className="text-muted-foreground ml-1">Following</span>
                  </div>
                )}
                {followers !== undefined && (
                  <div>
                    <span className="text-foreground font-bold">{followers}</span>
                    <span className="text-muted-foreground ml-1">Followers</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
