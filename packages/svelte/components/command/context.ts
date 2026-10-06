import { getContext, setContext } from 'svelte'

/**
 * Custom filter — mirrors cmdk `filter`. Return a positive number (or `true`)
 * to keep the item, `0` (or `false`) to hide it. Receives the item value, the
 * current search string, and the item's keywords.
 */
export type CommandFilter = (value: string, search: string, keywords?: string[]) => number | boolean

export interface CommandItemRegistration {
  value: string
  text: string
  disabled: boolean
  groupId: string | undefined
  keywords: string[] | undefined
  onSelect: (value: string) => void
}

export interface CommandContextValue {
  readonly search: string
  setSearch: (search: string) => void
  readonly count: number
  readonly listId: string
  readonly activeDescendant: string | undefined
  isItemVisible: (id: string) => boolean
  isGroupVisible: (groupId: string) => boolean
  isHighlighted: (id: string) => boolean
  setHighlighted: (id: string | null) => void
  registerItem: (id: string, entry: CommandItemRegistration) => void
  unregisterItem: (id: string) => void
  registerGroup: (id: string) => void
  unregisterGroup: (id: string) => void
  moveHighlight: (direction: 1 | -1) => void
  selectHighlighted: () => void
  selectItem: (id: string) => void
  setListElement: (el: HTMLElement | null) => void
}

const COMMAND_CONTEXT_KEY = Symbol('uipkge-command')
const COMMAND_GROUP_CONTEXT_KEY = Symbol('uipkge-command-group')

export function setCommandContext(value: CommandContextValue): void {
  setContext(COMMAND_CONTEXT_KEY, value)
}

export function getCommandContext(): CommandContextValue {
  const value = getContext<CommandContextValue | undefined>(COMMAND_CONTEXT_KEY)
  if (!value) throw new Error('Command parts must be used inside <Command>')
  return value
}

export function setCommandGroupContext(groupId: string): void {
  setContext(COMMAND_GROUP_CONTEXT_KEY, groupId)
}

export function getCommandGroupContext(): string | undefined {
  return getContext<string | undefined>(COMMAND_GROUP_CONTEXT_KEY)
}

export function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
