'use client'

import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Fab } from '@/components/ui/fab'
import { cn } from '@/lib/utils'

export interface SpeedDialAction {
  icon: LucideIcon
  label: string
  handler?: () => void
  disabled?: boolean
  className?: string
}

type Direction = 'up' | 'down' | 'left' | 'right'
type Trigger = 'click' | 'hover'

export interface SpeedDialProps {
  actions: SpeedDialAction[]
  /** Main FAB icon. */
  icon?: LucideIcon
  /** Accessible label for the main FAB. */
  label?: string
  direction?: Direction
  trigger?: Trigger
  /** Close the dial after an action is triggered. */
  closeOnAction?: boolean
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'inline'
  absolute?: boolean
  disabled?: boolean
  className?: string
}

const sideMap: Record<Direction, 'top' | 'bottom' | 'left' | 'right'> = {
  up: 'top',
  down: 'bottom',
  left: 'left',
  right: 'right',
}

const SpeedDial = React.forwardRef<HTMLButtonElement, SpeedDialProps>(
  (
    {
      actions,
      icon: Icon,
      label,
      direction = 'up',
      trigger = 'click',
      closeOnAction = true,
      variant = 'default',
      position = 'bottom-right',
      absolute = false,
      disabled = false,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)
    const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearHoverTimer = React.useCallback(() => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }
    }, [])

    const onTriggerEnter = React.useCallback(() => {
      if (disabled || trigger !== 'hover') return
      clearHoverTimer()
      setOpen(true)
    }, [disabled, trigger, clearHoverTimer])

    const onTriggerLeave = React.useCallback(() => {
      if (trigger !== 'hover') return
      clearHoverTimer()
      hoverTimerRef.current = setTimeout(() => setOpen(false), 150)
    }, [trigger, clearHoverTimer])

    const onContentEnter = React.useCallback(() => {
      if (trigger !== 'hover') return
      clearHoverTimer()
    }, [trigger, clearHoverTimer])

    const onContentLeave = React.useCallback(() => {
      if (trigger !== 'hover') return
      clearHoverTimer()
      hoverTimerRef.current = setTimeout(() => setOpen(false), 150)
    }, [trigger, clearHoverTimer])

    React.useEffect(() => clearHoverTimer, [clearHoverTimer])

    // Trigger is a wrapper div (asChild); Fab disabled alone does not block Popover.
    function handleOpenChange(next: boolean) {
      if (disabled) {
        setOpen(false)
        return
      }
      setOpen(next)
    }

    function runAction(action: SpeedDialAction) {
      if (action.disabled) return
      action.handler?.()
      if (closeOnAction) setOpen(false)
    }

    const side = sideMap[direction]
    const listClass =
      direction === 'up' || direction === 'down'
        ? 'flex flex-col items-center gap-3'
        : 'flex flex-row items-center gap-3'

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div
            data-uipkge=""
            data-slot="speed-dial"
            className={cn(className)}
            onMouseEnter={onTriggerEnter}
            onMouseLeave={onTriggerLeave}
          >
            <Fab
              ref={ref}
              variant={variant}
              position={position}
              absolute={absolute}
              disabled={disabled}
              aria-label={label || 'Quick actions'}
              aria-expanded={open}
              aria-haspopup="menu"
              className={cn(
                'transition-[color,background-color,box-shadow,transform,scale,translate,rotate] duration-200',
                open && 'rotate-45',
              )}
              onClick={trigger === 'hover' ? (e) => e.stopPropagation() : undefined}
            >
              {Icon ? <Icon /> : <Plus />}
            </Fab>
          </div>
        </PopoverTrigger>

        <PopoverContent
          side={side}
          align="center"
          sideOffset={12}
          className={cn('w-auto border-0 bg-transparent p-0 shadow-none', trigger === 'hover' && 'pointer-events-auto')}
          onMouseEnter={onContentEnter}
          onMouseLeave={onContentLeave}
        >
          <div className={listClass}>
            {actions.map((action, i) => {
              const ActionIcon = action.icon
              return (
                <button
                  key={i}
                  type="button"
                  data-slot="speed-dial-action"
                  disabled={action.disabled}
                  aria-label={action.label}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={cn(
                    "group/speed-dial-item bg-background text-foreground hover:bg-accent hover:text-accent-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 focus-visible:ring-ring/50 inline-flex size-12 items-center justify-center rounded-full border shadow-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
                    action.className,
                  )}
                  onClick={() => runAction(action)}
                >
                  <ActionIcon />
                  <span className="sr-only">{action.label}</span>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    )
  },
)
SpeedDial.displayName = 'SpeedDial'

export { SpeedDial }
