import type { InjectionKey, Ref } from 'vue'

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
  disabled: Ref<boolean>
  showSearch: Ref<boolean>
  height: Ref<number | string>
  pageSize: Ref<number | null>
  filterFn: (query: string, item: TransferItem) => boolean
  draggable: Ref<boolean>
  selectable: Ref<boolean>
  oneWay: Ref<boolean>
  dragPayload: Ref<TransferDragPayload | null>
  startDrag: (payload: TransferDragPayload) => void
  endDrag: () => void
  drop: (toSide: TransferSide, beforeKey: string | null) => void
  /** Move left→right. Optional keys override the current left selection. */
  moveRight: (keys?: string[]) => void
  /** Move right→left. Optional keys override the current right selection. */
  moveLeft: (keys?: string[]) => void
}

export const TRANSFER_INJECTION_KEY: InjectionKey<TransferContext> = Symbol('uipkge-transfer')
