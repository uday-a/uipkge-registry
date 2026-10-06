import { getContext, setContext } from 'svelte'

export interface DialogContextValue {
  readonly open: boolean
  setOpen: (open: boolean) => void
  readonly titleId: string
  readonly descriptionId: string
  /** False renders non-modal: no focus trap, body scroll-lock, or autofocus
   *  (Radix `modal` parity). The overlay still renders unless the consumer
   *  hides it — like Radix, non-modal panels typically omit the overlay. */
  readonly modal: boolean
}

const DIALOG_CONTEXT_KEY = Symbol('uipkge-dialog')

export function setDialogContext(value: DialogContextValue): void {
  setContext(DIALOG_CONTEXT_KEY, value)
}

export function getDialogContext(): DialogContextValue {
  const value = getContext<DialogContextValue | undefined>(DIALOG_CONTEXT_KEY)
  if (!value) throw new Error('Dialog parts must be used inside <Dialog>')
  return value
}

export function getDialogContextOrNull(): DialogContextValue | null {
  return getContext<DialogContextValue | null>(DIALOG_CONTEXT_KEY) ?? null
}
