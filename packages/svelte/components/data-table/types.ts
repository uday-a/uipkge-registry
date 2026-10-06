import type { Component } from 'svelte'

export interface FilterOption {
  value: string
  label: string
  icon?: Component<{ class?: string }>
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
