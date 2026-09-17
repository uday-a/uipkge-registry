'use client'

// One key/value row inside the record-detail <dl>. `select-all` is the point
// of the value side: these are IDs and timestamps people copy out, and one
// click should take the whole value rather than a word of it.
import * as React from 'react'
import { Check, Copy } from './data-explorer-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { fmtValue } from './data-explorer-core'

export interface DataExplorerDetailRowProps {
  label: string
  value: unknown
  /** Off inside a plain (non-scrolling) list where row hover means nothing. */
  hover?: boolean
  copyable?: boolean
  children?: React.ReactNode
}

export function DataExplorerDetailRow({
  label,
  value,
  hover = true,
  copyable = true,
  children,
}: DataExplorerDetailRowProps) {
  const [copied, setCopied] = React.useState(false)
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )

  const isEmpty = value === null || value === undefined || value === ''

  const copyText = React.useMemo(() => {
    if (isEmpty) return ''
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }, [isEmpty, value])

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    if (!copyText) return
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked (insecure context / permissions) -- fail quietly.
    }
  }

  return (
    <div
      className={cn(
        'group relative flex items-baseline justify-between gap-4 text-sm transition-colors',
        hover ? 'hover:bg-muted/40 -mx-1.5 rounded px-1.5 py-0.5' : '',
      )}
    >
      <dt className="text-muted-foreground shrink-0 font-mono text-xs">{label}</dt>
      <dd className="min-w-0 pr-6 text-right font-mono text-xs break-all tabular-nums select-all">
        {children ?? fmtValue(value)}
      </dd>
      {copyable && !isEmpty ? (
        <Button
          variant="ghost"
          size="icon-2xs"
          className={cn(
            'absolute top-1/2 right-0 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
            copied ? 'text-success opacity-100' : '',
          )}
          aria-label={copied ? 'Copied' : `Copy ${label}`}
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-2.5" aria-hidden="true" />
          ) : (
            <Copy className="text-muted-foreground size-2.5" aria-hidden="true" />
          )}
        </Button>
      ) : null}
    </div>
  )
}
