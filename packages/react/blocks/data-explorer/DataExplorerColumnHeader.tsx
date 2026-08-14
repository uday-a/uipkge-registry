'use client'

// A table header cell that carries its own controls: sort, filter, pin, move,
// group and hide -- the control sits on the column it acts on, so there is no
// separate bar to keep in sync with the columns beneath it.
//
// The cell always shows where it stands -- an arrow (and its rank, under
// multi-sort) when it is sorted, a solid funnel when a filter is on it --
// because a table that is quietly filtered is a table people misread.
import * as React from 'react'
import {
  ArrowDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  EyeOff,
  Filter,
  Layers,
  PinOff,
  X,
} from './data-explorer-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  OPERATOR_LABELS,
  OPERATORS_BY_KIND,
  VALUE_PLACEHOLDERS,
  type ColumnKind,
  type ExplorerColumn,
  type ExplorerFilter,
  type ExplorerOperator,
  type ExplorerRow,
  type ExplorerSort,
} from './data-explorer-types'

export interface DataExplorerColumnHeaderProps<T extends ExplorerRow = ExplorerRow> {
  column: ExplorerColumn<T>
  kind: ColumnKind
  align: 'left' | 'right' | 'center'
  sorts: ExplorerSort[]
  filter?: ExplorerFilter
  sortable?: boolean
  filterable?: boolean
  pin?: 'left' | 'right' | null
  pinnable?: boolean
  hideable?: boolean
  groupable?: boolean
  grouped?: boolean
  onSort: (dir: 'asc' | 'desc' | null) => void
  onFilter: (filter: ExplorerFilter | null) => void
  onPin: (side: 'left' | 'right' | null) => void
  onGroup: () => void
  onHide: () => void
  /** The label; defaults to `column.label`. */
  children?: React.ReactNode
}

export function DataExplorerColumnHeader<T extends ExplorerRow = ExplorerRow>({
  column,
  kind,
  align,
  sorts,
  filter,
  sortable = true,
  filterable = true,
  pin = null,
  pinnable = true,
  hideable = true,
  groupable = false,
  grouped = false,
  onSort,
  onFilter,
  onPin,
  onGroup,
  onHide,
  children,
}: DataExplorerColumnHeaderProps<T>) {
  const [open, setOpen] = React.useState(false)
  const operators = OPERATORS_BY_KIND[kind]
  // Draft state so a half-typed filter never fires a query per keystroke.
  const [draftOperator, setDraftOperator] = React.useState<ExplorerOperator>(
    filter?.operator ?? operators[0] ?? 'contains',
  )
  const [draftValue, setDraftValue] = React.useState(filter?.value ?? '')

  // Reopening shows what is actually applied, not the last abandoned draft.
  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) return
    setDraftOperator(filter?.operator ?? operators[0] ?? 'contains')
    setDraftValue(filter?.value ?? '')
  }

  const sortIndex = sorts.findIndex((s) => s.key === column.key)
  const activeSort = sortIndex >= 0 ? sorts[sortIndex] : null
  const needsValue = draftOperator !== 'empty'
  const canApply = !needsValue || draftValue.trim().length > 0
  const hasMenu = sortable || filterable || pinnable || hideable || groupable

  function applySort(dir: 'asc' | 'desc' | null) {
    onSort(dir)
    setOpen(false)
  }

  function applyFilter() {
    if (!canApply) return
    onFilter({
      column: column.key,
      operator: draftOperator,
      value: needsValue ? draftValue.trim() : '',
    })
    setOpen(false)
  }

  function clearFilter() {
    onFilter(null)
    setOpen(false)
  }

  function act(fn: () => void) {
    fn()
    setOpen(false)
  }

  const label = children ?? column.label

  // A column with nothing to configure is a plain label -- no popover,
  // no affordance, no dead click target.
  if (!hasMenu) {
    return (
      <span className="text-muted-foreground inline-flex items-center px-0 text-xs font-medium whitespace-nowrap">
        {label}
      </span>
    )
  }

  const trigger = (
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="xs"
        className={cn(
          'text-muted-foreground hover:text-foreground -mx-2 gap-1 px-2 font-medium',
          align === 'right' ? 'ml-auto' : '',
          activeSort || filter || grouped ? 'text-foreground' : '',
        )}
        aria-label={`${column.label} — column options`}
      >
        {/* Never truncate the label: the column sizes to fit its header
            rather than the header shrinking to fit four-character data. */}
        <span className="whitespace-nowrap">{label}</span>
        {activeSort ? (
          <>
            {activeSort.dir === 'asc' ? (
              <ArrowUp className="text-foreground size-3 shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown className="text-foreground size-3 shrink-0" aria-hidden="true" />
            )}
            {sorts.length > 1 ? (
              <span className="text-muted-foreground -ml-0.5 text-xs tabular-nums">{sortIndex + 1}</span>
            ) : null}
          </>
        ) : null}
        {grouped ? <Layers className="text-foreground size-3 shrink-0" aria-hidden="true" /> : null}
        {/* Always rendered on a filterable column: the funnel is how a
            column says it can be filtered at all, and it turns solid when
            a filter is applied. Sort-only columns show nothing. */}
        {filterable ? (
          <Filter
            className={cn('size-3 shrink-0', filter ? 'text-foreground' : 'text-muted-foreground/50')}
            aria-hidden="true"
          />
        ) : null}
      </Button>
    </PopoverTrigger>
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {column.description ? (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="top">{column.description}</TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}

      <PopoverContent align="start" className="w-64 p-1">
        {sortable ? (
          <>
            <Button
              size="xs"
              variant="ghost"
              role="menuitemradio"
              aria-checked={activeSort?.dir === 'asc'}
              className={cn('w-full justify-start', activeSort?.dir === 'asc' ? 'bg-accent' : '')}
              onClick={() => applySort('asc')}
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
              Sort ascending
            </Button>
            <Button
              size="xs"
              variant="ghost"
              role="menuitemradio"
              aria-checked={activeSort?.dir === 'desc'}
              className={cn('w-full justify-start', activeSort?.dir === 'desc' ? 'bg-accent' : '')}
              onClick={() => applySort('desc')}
            >
              <ArrowDown className="size-3.5" aria-hidden="true" />
              Sort descending
            </Button>
            {activeSort ? (
              <Button
                size="xs"
                variant="ghost"
                className="text-muted-foreground w-full justify-start"
                onClick={() => applySort(null)}
              >
                <X className="size-3.5" aria-hidden="true" />
                Clear sort
              </Button>
            ) : null}
          </>
        ) : null}

        {filterable ? (
          <>
            {sortable ? <Separator className="my-1" /> : null}
            <div className="space-y-1.5 p-1">
              <Select value={draftOperator} onValueChange={(v) => setDraftOperator(v as ExplorerOperator)}>
                <SelectTrigger size="sm" className="w-full" aria-label={`Filter ${column.label} by`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op} value={op} className="text-xs">
                      {OPERATOR_LABELS[op]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {needsValue ? (
                <Input
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  maxLength={64}
                  size="small"
                  placeholder={VALUE_PLACEHOLDERS[kind]}
                  aria-label={`Filter ${column.label} value`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      applyFilter()
                    }
                  }}
                />
              ) : null}

              <div className="flex items-center gap-1.5">
                <Button size="xs" className="flex-1" disabled={!canApply} onClick={applyFilter}>
                  Apply
                </Button>
                {filter ? (
                  <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={clearFilter}>
                    <X className="size-3" aria-hidden="true" />
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}

        {pinnable || groupable || hideable ? (
          <>
            {sortable || filterable ? <Separator className="my-1" /> : null}
            {pinnable ? (
              pin ? (
                <Button
                  size="xs"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => act(() => onPin(null))}
                >
                  <PinOff className="size-3.5" aria-hidden="true" />
                  Unpin
                </Button>
              ) : (
                <>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => act(() => onPin('left'))}
                  >
                    <ArrowLeftToLine className="size-3.5" aria-hidden="true" />
                    Pin left
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => act(() => onPin('right'))}
                  >
                    <ArrowRightToLine className="size-3.5" aria-hidden="true" />
                    Pin right
                  </Button>
                </>
              )
            ) : null}
            {groupable ? (
              <Button size="xs" variant="ghost" className="w-full justify-start" onClick={() => act(onGroup)}>
                <Layers className="size-3.5" aria-hidden="true" />
                {grouped ? 'Ungroup' : `Group by ${column.label}`}
              </Button>
            ) : null}
            {hideable ? (
              <Button
                size="xs"
                variant="ghost"
                className="text-muted-foreground w-full justify-start"
                onClick={() => act(onHide)}
              >
                <EyeOff className="size-3.5" aria-hidden="true" />
                Hide column
              </Button>
            ) : null}
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
