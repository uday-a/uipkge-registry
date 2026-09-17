'use client'

import * as React from 'react'
import { SectionCard } from '@/components/ui/section-card'

export interface SettingRow {
  key: string
  label: string
  desc?: string
}

export interface ToggleSettingListProps {
  title?: string
  description?: string
  /** Rendered top-right of the header (e.g. an icon node). */
  headerIcon?: React.ReactNode
  items: SettingRow[]
  value: Record<string, boolean>
  onValueChange?: (value: Record<string, boolean>) => void
  className?: string
}

export function ToggleSettingList({
  title,
  description,
  headerIcon,
  items,
  value,
  onValueChange,
  className,
}: ToggleSettingListProps) {
  function toggle(key: string) {
    onValueChange?.({ ...value, [key]: !value[key] })
  }

  return (
    <SectionCard
      data-slot="toggle-setting-list"
      title={title ?? 'Notifications'}
      description={description}
      className={className}
      headerAction={headerIcon}
    >
      <ul className="-my-4 divide-y">
        {items.map((row, i) => (
          <li
            key={row.key}
            className={['flex items-center justify-between gap-4 py-4', i === 0 ? 'pt-0' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <div>
              <p className="text-sm font-medium">{row.label}</p>
              {row.desc && <p className="text-muted-foreground text-xs">{row.desc}</p>}
            </div>
            <button
              type="button"
              role="switch"
              aria-label={row.label}
              aria-checked={value[row.key]}
              className={[
                'focus-visible:ring-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2',
                value[row.key] ? 'bg-primary' : 'bg-muted-foreground/30',
              ].join(' ')}
              onClick={() => toggle(row.key)}
            >
              <span
                className={[
                  'bg-background inline-block size-4 translate-y-0.5 rounded-full shadow transition-transform',
                  value[row.key] ? 'translate-x-[18px]' : 'translate-x-0.5',
                ].join(' ')}
              />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
