import { CircleAlert, ArrowUp, ArrowDown, Minus, FileText, FileSpreadsheet, FileImage, File } from 'lucide-vue-next'

export interface CommentItem {
  id: string
  author: string
  authorColor: string
  text: string
  time: string
}

export interface FileItem {
  id: string
  name: string
  size: string
  type: 'pdf' | 'spreadsheet' | 'image' | 'other'
}

export interface KanbanTask {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: { name: string; color: string }
  tags: { label: string; color: string }[]
  dueDate?: string
  parentId?: string
  subtaskIds: string[]
  commentItems: CommentItem[]
  fileItems: FileItem[]
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  dotColor: string
  tasks: KanbanTask[]
}

export const priorityConfig: Record<string, { icon: any; class: string; label: string; bg: string }> = {
  urgent: { icon: CircleAlert, class: 'text-red-500', label: 'Urgent', bg: 'bg-red-500' },
  high: { icon: ArrowUp, class: 'text-orange-500', label: 'High', bg: 'bg-orange-500' },
  medium: { icon: Minus, class: 'text-yellow-500 dark:text-yellow-400', label: 'Medium', bg: 'bg-yellow-500' },
  low: { icon: ArrowDown, class: 'text-blue-400', label: 'Low', bg: 'bg-blue-400' },
}

export const assignees = {
  alice: { name: 'Alice Chen', color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  bob: { name: 'Bob Martinez', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  carol: { name: 'Carol White', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  david: { name: 'David Kim', color: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  eva: { name: 'Eva Johnson', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
  frank: { name: 'Frank Lee', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' },
}

export const tagPresets = {
  onboarding: { label: 'Onboarding', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20' },
  compliance: { label: 'Compliance', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20' },
  recruitment: {
    label: 'Recruitment',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20',
  },
  payroll: { label: 'Payroll', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' },
  training: { label: 'Training', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20' },
  benefits: { label: 'Benefits', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20' },
  policy: { label: 'Policy', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20' },
}

export const fileIconMap: Record<string, any> = {
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  image: FileImage,
  other: File,
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getDueStatus(dueDate?: string): 'overdue' | 'soon' | 'normal' | null {
  if (!dueDate) return null
  const now = new Date()
  const due = new Date(dueDate + 'T00:00:00')
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 3) return 'soon'
  return 'normal'
}

export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getAssigneeKey(name: string): keyof typeof assignees {
  for (const [key, val] of Object.entries(assignees)) {
    if (val.name === name) return key as keyof typeof assignees
  }
  return 'alice'
}

export function findTaskById(columns: KanbanColumn[], taskId: string): KanbanTask | undefined {
  for (const col of columns) {
    const task = col.tasks.find((t) => t.id === taskId)
    if (task) return task
  }
  return undefined
}

export function getTaskColumn(columns: KanbanColumn[], taskId: string): KanbanColumn | undefined {
  return columns.find((col) => col.tasks.some((t) => t.id === taskId))
}
