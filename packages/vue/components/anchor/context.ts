import type { InjectionKey, Ref } from 'vue'

export interface AnchorContext {
  activeHref: Ref<string | null>
  setActive: (href: string) => void
  register: (href: string) => void
  unregister: (href: string) => void
  scrollContainer: Ref<HTMLElement | Window>
  offsetTop: Ref<number>
}

export const ANCHOR_INJECTION_KEY: InjectionKey<AnchorContext> = Symbol('uipkge-anchor')
