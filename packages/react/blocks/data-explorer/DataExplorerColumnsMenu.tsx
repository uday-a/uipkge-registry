'use client'

// The columns popover: show/hide, pin and reorder every column from one list,
// with a reset back to the configured defaults. Per-column versions of these
// live in the header menu; this is the overview.
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp, Columns3, Pin, PinOff, RotateCcw } from './data-explorer-icons'
import type { ExplorerColumn, ExplorerRow } from './data-explorer-types'

export interface DataExplorerColumnsMenuProps<T extends ExplorerRow = ExplorerRow> {
  columns: ExplorerColumn<T>[]
  order: string[]
  hidden: Set<string>
  pins: Record<string, 'left' | 'right'>
  onToggle: (key: string) => void
  onPin: (key: string, side: 'left' | 'right' | null) => void
  onMove: (key: string, dir: 'left' | 'right') => void
  onReset: () => void
}

export function DataExplorerColumnsMenu<T extends ExplorerRow = ExplorerRow>({
  columns,
  order,
  hidden,
  pins,
  onToggle,
  onPin,
  onMove,
  onReset,
}: DataExplorerColumnsMenuProps<T>) {
  const ordered = React.useMemo(() => {
    const byKey = new Map(columns.map((c) => [c.key, c]))
    const listed = order.map((k) => byKey.get(k)).filter((c): c is ExplorerColumn<T> => !!c)
    return [...listed, ...columns.filter((c) => !order.includes(c.key))].filter((c) => c.type !== 'actions')
  }, [columns, order])

  const hiddenCount = ordered.filter((c) => hidden.has(c.key)).length

  const pinOf = (c: ExplorerColumn<T>) => pins[c.key] ?? c.pin ?? null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="xs" aria-label="Columns">
          <Columns3 className="text-muted-foreground size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Columns</span>
          {hiddenCount ? <span className="text-muted-foreground tabular-nums">−{hiddenCount}</span> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-1">
        <div role="group" aria-label="Columns" className="max-h-80 space-y-0.5 overflow-y-auto">
          {ordered.map((c, i) => (
            <div key={c.key} className="hover:bg-accent/60 flex items-center gap-2 rounded-sm py-1 pr-1 pl-2">
              <Checkbox
                id={`explorer-col-${c.key}`}
                checked={!hidden.has(c.key)}
                disabled={c.hideable === false}
                size="sm"
                onCheckedChange={() => onToggle(c.key)}
              />
              <label htmlFor={`explorer-col-${c.key}`} className="min-w-0 flex-1 cursor-pointer truncate text-xs">
                {c.label}
              </label>
              {pinOf(c) ? <span className="text-muted-foreground text-xs">{pinOf(c)}</span> : null}
              <Button
                variant="ghost"
                size="icon-2xs"
                aria-label={pinOf(c) ? `Unpin ${c.label}` : `Pin ${c.label} left`}
                onClick={() => onPin(c.key, pinOf(c) ? null : 'left')}
              >
                {pinOf(c) ? (
                  <PinOff className="size-3" aria-hidden="true" />
                ) : (
                  <Pin className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-2xs"
                aria-label={`Move ${c.label} up`}
                disabled={i === 0}
                onClick={() => onMove(c.key, 'left')}
              >
                <ChevronUp className="text-muted-foreground size-3" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon-2xs"
                aria-label={`Move ${c.label} down`}
                disabled={i === ordered.length - 1}
                onClick={() => onMove(c.key, 'right')}
              >
                <ChevronDown className="text-muted-foreground size-3" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <Separator className="my-1" />
        <Button variant="ghost" size="xs" className="text-muted-foreground w-full justify-start" onClick={onReset}>
          <RotateCcw className="size-3" aria-hidden="true" />
          Reset columns
        </Button>
      </PopoverContent>
    </Popover>
  )
}
