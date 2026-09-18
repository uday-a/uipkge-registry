import { ref, shallowRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

export interface LoadingBarHandle {
  start: (from?: number) => void
  finish: () => void
  error: () => void
  inc: (amount?: number) => void
  set: (value: number) => void
}

/**
 * Composable that drives a <LoadingBar> instance via a template ref.
 *
 * Usage:
 *   const bar = useLoadingBar()
 *   <LoadingBar :ref="bar.setRef" />
 *   bar.start()
 *   await fetch(...)
 *   bar.finish()
 */
export function useLoadingBar() {
  const refEl = shallowRef<ComponentPublicInstance | null>(null)
  const loading = ref(false)
  const isError = ref(false)

  function setRef(el: Element | ComponentPublicInstance | null) {
    refEl.value = el as ComponentPublicInstance | null
  }

  function getHandle(): LoadingBarHandle | null {
    return (refEl.value as unknown as LoadingBarHandle) ?? null
  }

  function start(from = 20) {
    isError.value = false
    loading.value = true
    const h = getHandle()
    if (h && typeof h.start === 'function') h.start(from)
  }

  function finish() {
    loading.value = false
    const h = getHandle()
    if (h && typeof h.finish === 'function') h.finish()
  }

  function error() {
    isError.value = true
    loading.value = false
    const h = getHandle()
    if (h && typeof h.error === 'function') h.error()
  }

  function inc(amount = 10) {
    const h = getHandle()
    if (h && typeof h.inc === 'function') h.inc(amount)
  }

  function set(value: number) {
    const h = getHandle()
    if (h && typeof h.set === 'function') h.set(value)
  }

  return {
    setRef,
    loading,
    isError,
    start,
    finish,
    error,
    inc,
    set,
  }
}
