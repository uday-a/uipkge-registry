import { getContext, hasContext, setContext } from 'svelte'

const SHEET_CONTEXT_KEY = Symbol('uipkge-sheet')

export interface SheetContextValue {
  readonly open: boolean
  setOpen: (open: boolean) => void
  readonly titleId: string | undefined
  setTitleId: (id: string | undefined) => void
  readonly descriptionId: string | undefined
  setDescriptionId: (id: string | undefined) => void
  readonly modal: boolean
}

export function setSheetContext(value: SheetContextValue) {
  setContext(SHEET_CONTEXT_KEY, value)
}

export function getSheetContext(): SheetContextValue | undefined {
  if (!hasContext(SHEET_CONTEXT_KEY)) return undefined
  return getContext<SheetContextValue>(SHEET_CONTEXT_KEY)
}

let sheetIdCounter = 0

/** Cheap unique id for aria-labelledby wiring. Module-scoped counter is enough per document. */
export function nextSheetId(prefix: string) {
  sheetIdCounter += 1
  return `uipkge-${prefix}-${sheetIdCounter}`
}
