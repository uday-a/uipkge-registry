import type { Component } from 'svelte'

export interface TreeViewItem {
  id: string
  label: string
  icon?: Component
  children?: TreeViewItem[]
  disabled?: boolean
  selected?: boolean
  expanded?: boolean
  [key: string]: unknown
}
