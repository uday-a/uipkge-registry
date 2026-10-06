import { getContext, setContext } from 'svelte'

/**
 * Tags-input state shared from <TagsInput> to its descendants. Exposed as
 * functions so reads inside child templates/`$derived` track the root's
 * runes state.
 */
export interface TagsInputContextValue {
  values: () => string[]
  disabled: () => boolean
  addValue: (raw: string) => void
  removeValue: (value: string) => void
  removeLast: () => void
  addOnPaste: () => boolean
  addOnBlur: () => boolean
  delimiter: () => string | undefined
  /** Resolved commit keys (React `addOnKeys` parity; `delimiter` folds in as an alias). */
  commitKeys: () => string[]
  /** Root-level placeholder (React parity); the input falls back to it. */
  placeholder: () => string | undefined
}

const KEY = Symbol.for('uipkge:tags-input')

export function setTagsInputContext(value: TagsInputContextValue): TagsInputContextValue {
  setContext(KEY, value)
  return value
}

export function getTagsInputContext(): TagsInputContextValue | null {
  return getContext<TagsInputContextValue | null>(KEY) ?? null
}

const ITEM_KEY = Symbol.for('uipkge:tags-input-item')

export function setTagsInputItem(getter: () => string): void {
  setContext(ITEM_KEY, getter)
}

export function getTagsInputItem(): (() => string) | null {
  return getContext<(() => string) | null>(ITEM_KEY) ?? null
}
