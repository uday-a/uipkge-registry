import type { LoadingBarHandle } from './LoadingBar.svelte'

export interface LoadingBarController {
  /** Bind the bar instance: `<LoadingBar bind:this={bar.current} />`. */
  current: LoadingBarHandle | null
  /** React-parity ref callback — `<LoadingBar ref={...} />` equivalent for
   *  programmatic wiring. Prefer `bind:this={bar.current}` in templates. */
  setRef: (handle: LoadingBarHandle | null) => void
  readonly loading: boolean
  readonly isError: boolean
  start: (from?: number) => void
  finish: () => void
  error: () => void
  inc: (amount?: number) => void
  set: (value: number) => void
}

/**
 * Controller that drives a <LoadingBar> instance via `bind:this`.
 *
 * Usage:
 *   const bar = createLoadingBar()
 *   <LoadingBar bind:this={bar.current} />
 *   bar.start()
 *   await fetch(...)
 *   bar.finish()
 */
export function createLoadingBar(): LoadingBarController {
  let handle = $state<LoadingBarHandle | null>(null)
  let loading = $state(false)
  let isError = $state(false)

  function start(from = 20) {
    isError = false
    loading = true
    handle?.start(from)
  }

  function finish() {
    loading = false
    handle?.finish()
  }

  function error() {
    isError = true
    loading = false
    handle?.error()
  }

  function inc(amount = 10) {
    handle?.inc(amount)
  }

  function set(value: number) {
    handle?.set(value)
  }

  function setRef(h: LoadingBarHandle | null) {
    handle = h
  }

  return {
    get current() {
      return handle
    },
    set current(h: LoadingBarHandle | null) {
      handle = h
    },
    setRef,
    get loading() {
      return loading
    },
    get isError() {
      return isError
    },
    start,
    finish,
    error,
    inc,
    set,
  }
}

/** React's `useLoadingBar` name — identical to `createLoadingBar`
 *  (Svelte has no hooks; both are plain factory functions). */
export const useLoadingBar = createLoadingBar
