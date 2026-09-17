import type * as React from 'react'

export interface FilterOption {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface FilterDefinition {
  column: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date'
  options?: (string | FilterOption)[]
}

export function resolveOption(opt: string | FilterOption): FilterOption {
  if (typeof opt === 'string') return { value: opt, label: opt }
  return opt
}
