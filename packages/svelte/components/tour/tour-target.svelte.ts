import { onDestroy } from 'svelte'

export type TourTarget = string | (() => HTMLElement | null) | HTMLElement | null

export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

export function createTourTarget(getTarget: () => TourTarget | undefined) {
  let rect = $state<TargetRect | null>(null)
  let element: HTMLElement | null = null

  let resizeObs: ResizeObserver | null = null
  let raf = 0

  function resolve(): HTMLElement | null {
    const t = getTarget()
    if (!t || typeof document === 'undefined') return null
    if (typeof t === 'string') return document.querySelector(t) as HTMLElement | null
    if (typeof t === 'function') return t()
    return t
  }

  function measure() {
    if (typeof requestAnimationFrame === 'undefined') return
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      if (!element) {
        rect = null
        return
      }
      const r = element.getBoundingClientRect()
      rect = { x: r.left, y: r.top, width: r.width, height: r.height }
    })
  }

  function attach() {
    detach()
    element = resolve()
    if (!element) {
      rect = null
      return
    }
    measure()
    if (typeof ResizeObserver !== 'undefined' && typeof document !== 'undefined') {
      resizeObs = new ResizeObserver(measure)
      resizeObs.observe(element)
      resizeObs.observe(document.documentElement)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', measure, { passive: true, capture: true })
      window.addEventListener('resize', measure, { passive: true })
    }
  }

  function detach() {
    resizeObs?.disconnect()
    resizeObs = null
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf)
  }

  onDestroy(detach)

  return {
    get rect() {
      return rect
    },
    get element() {
      return element
    },
    attach,
    detach,
    measure,
  }
}
