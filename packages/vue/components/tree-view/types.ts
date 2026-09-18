import type { File } from 'lucide-vue-next'

export interface TreeViewItem {
  id: string
  label: string
  icon?: typeof File
  children?: TreeViewItem[]
  disabled?: boolean
  selected?: boolean
  expanded?: boolean
  [key: string]: unknown
}
