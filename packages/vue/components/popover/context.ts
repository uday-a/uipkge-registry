import type { InjectionKey, Ref } from 'vue'

export type PopoverCloseBehavior = 'auto' | 'click-outside' | 'esc' | 'manual' | 'none'

export interface PopoverContext {
  closeBehavior: Ref<PopoverCloseBehavior>
}

export const POPOVER_INJECTION_KEY: InjectionKey<PopoverContext> = Symbol('uipkge-popover')
