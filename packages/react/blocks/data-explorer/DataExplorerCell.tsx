'use client'

// One typed cell. The `type` picks a renderer; a `renderCell[key]` render prop
// on the block replaces it entirely. Text-like types share the two-line
// pattern: primary value, optional sub line, hover-revealed copy control.
import * as React from 'react'
import { Check, Copy, ExternalLink, Minus, MoreHorizontal, Pencil } from './data-explorer-icons'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { fmtDateTime, fmtValue, formatCell, getSub, initials, sparklinePath } from './data-explorer-core'
import {
  TONE_DOT_CLASSES,
  type ExplorerColumn,
  type ExplorerRow,
  type ExplorerRowAction,
  type StatusTone,
} from './data-explorer-types'

export interface DataExplorerCellProps<T extends ExplorerRow = ExplorerRow> {
  column: ExplorerColumn<T>
  row: T
  value: unknown
  actions?: ExplorerRowAction<T>[]
  editable?: boolean
  onEdit?: (value: unknown) => void
}

const SPARK_W = 96
const SPARK_H = 24

const NUMERIC_TYPES = ['number', 'currency', 'percent', 'bytes', 'duration']
const DATE_TYPES = ['date', 'datetime', 'relative']

type ActionIcon = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>

export function DataExplorerCell<T extends ExplorerRow = ExplorerRow>({
  column,
  row,
  value,
  actions = [],
  editable = false,
  onEdit,
}: DataExplorerCellProps<T>) {
  const type = column.type ?? 'text'
  const text = formatCell(column, value, row)
  const sub = getSub(row, column)
  const isEmpty = value === null || value === undefined || value === '' || text === '—'

  const badge = column.badgeMap?.[String(value)] ?? {
    label: fmtValue(value),
    tone: (isEmpty ? 'muted' : 'info') as StatusTone,
  }

  const avatar =
    value && typeof value === 'object'
      ? { name: String((value as { name?: string }).name ?? ''), src: (value as { src?: string }).src }
      : { name: String(value ?? ''), src: undefined }

  const series = Array.isArray(value) ? (value as number[]).map(Number) : []
  const sparkPath = sparklinePath(series, SPARK_W, SPARK_H)
  const sparkLast = (() => {
    if (series.length < 2) return null
    const min = Math.min(...series)
    const max = Math.max(...series)
    const span = max - min || 1
    const last = series[series.length - 1]!
    return { x: SPARK_W, y: SPARK_H - ((last - min) / span) * (SPARK_H - 2) - 1 }
  })()

  const tags = Array.isArray(value) ? value.map(String) : []
  const maxTags = column.maxTags ?? 3

  const deltaClass = (() => {
    if (!column.delta || isEmpty) return 'text-muted-foreground'
    const n = Number(value)
    if (n > 0) return 'text-destructive'
    if (n < 0) return 'text-success'
    return 'text-muted-foreground'
  })()

  // ── Copy ────────────────────────────────────────────────────────────────

  const [copied, setCopied] = React.useState(false)
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )
  async function copy(e: React.MouseEvent) {
    e.stopPropagation()
    const v = type === 'text' ? text : String(value ?? '')
    if (!v || v === '—') return
    try {
      await navigator.clipboard.writeText(v)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked (insecure context / permissions) -- fail quietly.
    }
  }

  // ── Inline edit ─────────────────────────────────────────────────────────

  const [editing, setEditing] = React.useState(false)
  // Mirrors `editing` synchronously so a blur that lands right after Enter
  // committed cannot commit a second time.
  const editingRef = React.useRef(false)
  const [draft, setDraft] = React.useState('')
  const editInput = React.useRef<HTMLInputElement | null>(null)
  const editKind = column.editable === 'number' || ['number', 'currency', 'percent'].includes(type) ? 'number' : 'text'

  // An editable cell owns its clicks: a single click must not open the row's
  // detail, or the double-click that starts editing lands behind a sheet.
  function stopIfEditable(e: React.SyntheticEvent) {
    if (editable) e.stopPropagation()
  }

  function startEdit(e: React.SyntheticEvent) {
    if (!editable) return
    e.stopPropagation()
    setDraft(isEmpty ? '' : String(value))
    editingRef.current = true
    setEditing(true)
  }

  React.useEffect(() => {
    if (!editing) return
    const input = editInput.current
    input?.focus()
    input?.select()
  }, [editing])

  function commitEdit() {
    if (!editingRef.current) return
    const next = editKind === 'number' ? (draft.trim() === '' ? null : Number(draft)) : draft
    editingRef.current = false
    setEditing(false)
    if (editKind === 'number' && next !== null && Number.isNaN(next as number)) return
    if (next !== value) onEdit?.(next)
  }

  function cancelEdit() {
    editingRef.current = false
    setEditing(false)
  }

  // Editing: the cell becomes the input; Enter commits, Escape cancels.
  if (editing) {
    return (
      <div className="-my-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={editInput}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          size="small"
          className="h-7"
          type={editKind === 'number' ? 'number' : 'text'}
          aria-label={`Edit ${column.label}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commitEdit()
            } else if (e.key === 'Escape') {
              e.preventDefault()
              cancelEdit()
            }
          }}
          onBlur={commitEdit}
        />
      </div>
    )
  }

  // Badge: a dot from the semantic tone plus the word -- colour alone is
  // never the only signal.
  if (type === 'badge') {
    return (
      <Badge variant="outline" className="gap-1.5">
        <span className={cn('size-1.5 shrink-0 rounded-full', TONE_DOT_CLASSES[badge.tone])} aria-hidden="true" />
        <span className="truncate">{badge.label}</span>
      </Badge>
    )
  }

  if (type === 'dot') {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <span className={cn('size-1.5 shrink-0 rounded-full', TONE_DOT_CLASSES[badge.tone])} aria-hidden="true" />
        <span className="truncate">{badge.label}</span>
      </span>
    )
  }

  if (type === 'progress') {
    return (
      <div className="flex items-center gap-2" onClick={stopIfEditable} onDoubleClick={startEdit}>
        <Progress value={Number(value) || 0} className="h-1.5" aria-label={`${column.label} ${text}`} />
        <span className="text-muted-foreground w-9 shrink-0 text-right tabular-nums">
          {isEmpty ? '—' : `${Math.round(Number(value))}%`}
        </span>
      </div>
    )
  }

  if (type === 'sparkline') {
    return (
      <svg
        viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
        width={SPARK_W}
        height={SPARK_H}
        className="text-muted-foreground block overflow-visible"
        role="img"
        aria-label={`${column.label}: ${series.join(', ')}`}
      >
        <title>{series.join(', ')}</title>
        {sparkPath ? (
          <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        ) : null}
        {sparkLast ? <circle cx={sparkLast.x} cy={sparkLast.y} r="2" className="fill-foreground" /> : null}
        {!sparkPath ? (
          <line x1="0" y1={SPARK_H / 2} x2={SPARK_W} y2={SPARK_H / 2} stroke="currentColor" strokeDasharray="2 3" />
        ) : null}
      </svg>
    )
  }

  if (type === 'avatar') {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <Avatar size="sm" className="shrink-0">
          {avatar.src ? <AvatarImage src={avatar.src} alt={avatar.name} /> : null}
          <AvatarFallback className="text-[10px]">{initials(avatar.name) || '?'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <span className="block truncate" title={avatar.name}>
            {avatar.name || '—'}
          </span>
          {sub ? (
            <span className="text-muted-foreground block truncate text-xs" title={sub}>
              {sub}
            </span>
          ) : null}
        </div>
      </div>
    )
  }

  if (type === 'link' && !isEmpty) {
    return (
      <a
        href={column.href ? column.href(row) : String(value)}
        target="_blank"
        rel="noreferrer"
        className="text-foreground inline-flex max-w-full items-center gap-1 underline-offset-4 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="truncate">{text}</span>
        <ExternalLink className="text-muted-foreground size-3 shrink-0" aria-hidden="true" />
      </a>
    )
  }

  if (type === 'tags') {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        {tags.slice(0, maxTags).map((t) => (
          <Badge key={t} variant="secondary" className="max-w-32">
            <span className="truncate">{t}</span>
          </Badge>
        ))}
        {tags.length > maxTags ? (
          <span className="text-muted-foreground text-xs tabular-nums">+{tags.length - maxTags}</span>
        ) : null}
        {!tags.length ? <span className="text-muted-foreground">—</span> : null}
      </div>
    )
  }

  if (type === 'boolean') {
    return (
      <span className="inline-flex items-center">
        {value === true ? (
          <Check className="text-success size-3.5" aria-hidden="true" />
        ) : (
          <Minus className="text-muted-foreground size-3.5" aria-hidden="true" />
        )}
        <span className="sr-only">{value === true ? 'Yes' : 'No'}</span>
      </span>
    )
  }

  if (type === 'actions') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground -my-1"
            aria-label="Row actions"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
          {actions.map((a) => {
            const Icon = a.icon as ActionIcon | undefined
            return (
              <DropdownMenuItem
                key={a.label}
                variant={a.variant}
                disabled={a.disabled}
                className="text-xs"
                onSelect={() => a.onSelect(row)}
              >
                {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
                {a.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Numbers and dates: tabular so columns of them line up.
  if (NUMERIC_TYPES.includes(type)) {
    return (
      <span
        className={cn(
          'group/cell inline-flex max-w-full items-center gap-1 tabular-nums',
          column.delta ? `font-medium ${deltaClass}` : '',
          isEmpty && !column.delta ? 'text-muted-foreground' : '',
        )}
        onClick={stopIfEditable}
        onDoubleClick={startEdit}
      >
        <span className="truncate">{text}</span>
        {editable ? (
          <Button
            variant="ghost"
            size="icon-2xs"
            className="-my-1 shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100 focus-visible:opacity-100"
            aria-label={`Edit ${column.label}`}
            onClick={startEdit}
          >
            <Pencil className="text-muted-foreground size-2.5" aria-hidden="true" />
          </Button>
        ) : null}
      </span>
    )
  }

  if (DATE_TYPES.includes(type)) {
    return (
      <div className="tabular-nums" onClick={stopIfEditable} onDoubleClick={startEdit}>
        <span className="block" title={type === 'relative' ? fmtDateTime(value) : undefined}>
          {text}
        </span>
        {sub ? <span className="text-muted-foreground block text-xs">{sub}</span> : null}
      </div>
    )
  }

  // Text: primary + optional sub line, each with a hover-revealed copy.
  return (
    <div className="min-w-0" onClick={stopIfEditable} onDoubleClick={startEdit}>
      <div className={cn('group/cell flex min-w-0 items-center justify-between gap-1.5', sub ? 'font-medium' : '')}>
        <span
          className={cn(
            'block min-w-0 flex-1',
            column.wrap ? 'break-words whitespace-normal' : 'truncate',
            column.mono ? 'font-mono' : '',
            isEmpty ? 'text-muted-foreground font-normal' : '',
          )}
          title={text}
        >
          {text}
        </span>
        {editable ? (
          <Button
            variant="ghost"
            size="icon-2xs"
            className="-mr-1 shrink-0 opacity-0 transition-opacity group-focus-within/cell:opacity-100 group-hover/cell:opacity-100 focus-visible:opacity-100"
            aria-label={`Edit ${column.label}`}
            onClick={startEdit}
          >
            <Pencil className="text-muted-foreground size-2.5" aria-hidden="true" />
          </Button>
        ) : null}
        {column.copyable && !isEmpty ? (
          <Button
            variant="ghost"
            size="icon-2xs"
            className="-mr-1 shrink-0 opacity-0 transition-opacity group-focus-within/cell:opacity-100 group-hover/cell:opacity-100 focus-visible:opacity-100"
            aria-label={copied ? 'Copied' : `Copy ${column.label}`}
            onClick={copy}
          >
            {copied ? (
              <Check className="text-success size-2.5" aria-hidden="true" />
            ) : (
              <Copy className="text-muted-foreground size-2.5" aria-hidden="true" />
            )}
          </Button>
        ) : null}
      </div>
      {sub ? (
        <span
          className={cn(
            'text-muted-foreground block min-w-0 truncate text-xs font-normal',
            column.subMono ? 'font-mono' : '',
          )}
          title={sub}
        >
          {sub}
        </span>
      ) : null}
    </div>
  )
}
