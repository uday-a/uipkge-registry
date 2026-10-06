import { getContext, setContext } from 'svelte'

export interface TransferItem {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

export type TransferSide = 'left' | 'right'

export interface TransferDragPayload {
  keys: string[]
  fromSide: TransferSide
}

export interface TransferContext {
  readonly disabled: boolean
  readonly showSearch: boolean
  readonly height: number | string
  readonly pageSize: number | null
  readonly filterFn: (query: string, item: TransferItem) => boolean
  readonly draggable: boolean
  readonly selectable: boolean
  readonly oneWay: boolean
  readonly dragPayload: TransferDragPayload | null
  startDrag: (payload: TransferDragPayload) => void
  endDrag: () => void
  drop: (toSide: TransferSide, beforeKey: string | null) => void
  /** Move left→right. Optional keys override the current left selection. */
  moveRight: (keys?: string[]) => void
  /** Move right→left. Optional keys override the current right selection. */
  moveLeft: (keys?: string[]) => void
}

const TRANSFER_CONTEXT_KEY = Symbol('uipkge-transfer')

export function setTransferContext(ctx: TransferContext): void {
  setContext(TRANSFER_CONTEXT_KEY, ctx)
}

export function getTransferContext(): TransferContext {
  const ctx = getContext<TransferContext | undefined>(TRANSFER_CONTEXT_KEY)
  if (!ctx) throw new Error('TransferList must be used inside <Transfer>.')
  return ctx
}
