import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DockItem {
  /** Unique id for the item. */
  id: string
  /** Lucide icon component to render. */
  icon: LucideIcon
  /** Label shown in the tooltip on hover. */
  label: string
  /** Click handler. */
  handler?: () => void
  /** Whether this item is the active one. */
  active?: boolean
}

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dock items. */
  items: DockItem[]
  /** Base icon size in pixels. Default 48. */
  baseSize?: number
  /** Peak magnification scale as the cursor hovers directly over an item. Default 1.6. */
  magnification?: number
  /** Pixel radius within which items magnify. Default 120. */
  distance?: number
  /** Orientation. Only 'horizontal' (bottom dock) is supported. */
  orientation?: 'horizontal'
  /** Show the tooltip label on hover. Default true. */
  showTooltips?: boolean
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      items,
      baseSize = 48,
      magnification = 1.6,
      distance = 120,
      orientation = 'horizontal',
      showTooltips = true,
      className,
      ...props
    },
    ref,
  ) => {
    const mouseXRef = React.useRef<number | null>(null)
    const [mouseX, setMouseX] = React.useState<number | null>(null)
    const [hoveredId, setHoveredId] = React.useState<string | null>(null)
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])

    function onMove(e: React.MouseEvent<HTMLDivElement>) {
      mouseXRef.current = e.clientX
      setMouseX(e.clientX)
    }

    function onLeave() {
      mouseXRef.current = null
      setMouseX(null)
      setHoveredId(null)
    }

    function sizeFor(index: number): number {
      if (mouseXRef.current === null) return baseSize
      const el = itemRefs.current[index]
      if (!el) return baseSize
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(mouseXRef.current - center)
      if (dist > distance) return baseSize
      // Cosine bell curve so magnification falls off smoothly.
      const t = 1 - dist / distance
      const scale = 1 + (magnification - 1) * t
      return baseSize * scale
    }

    const sizes = items.map((_, i) => sizeFor(i))

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="dock"
        data-orientation={orientation}
        className={cn(
          'border-border/60 bg-background/60 flex items-end justify-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-md',
          className,
        )}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        {...props}
      >
        {items.map((item, index) => {
          const Icon = item.icon
          const size = sizes[index] ?? baseSize
          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              data-slot="dock-item"
              data-active={item.active ? '' : undefined}
              role="button"
              tabIndex={0}
              aria-label={item.label}
              aria-current={item.active ? 'true' : undefined}
              className="group focus-visible:ring-ring/50 relative flex shrink-0 cursor-pointer items-end justify-center rounded-xl outline-none focus-visible:ring-[3px]"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => item.handler?.()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  item.handler?.()
                } else if (e.key === ' ') {
                  e.preventDefault()
                  item.handler?.()
                }
              }}
            >
              {/* Tooltip */}
              {showTooltips && hoveredId === item.id ? (
                <span className="border-border bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md">
                  {item.label}
                </span>
              ) : null}

              {/* Icon tile */}
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl border transition-[width,height] duration-100 ease-out will-change-[width,height]',
                  item.active
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border/50 bg-muted/40 text-foreground hover:bg-muted',
                )}
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                <Icon style={{ width: `${size * 0.5}px`, height: `${size * 0.5}px` }} />
              </span>

              {/* Active indicator dot */}
              {item.active ? (
                <span className="bg-primary absolute -bottom-2 size-1 rounded-full" aria-hidden="true" />
              ) : null}
            </div>
          )
        })}
      </div>
    )
  },
)
Dock.displayName = 'Dock'

export { Dock }
