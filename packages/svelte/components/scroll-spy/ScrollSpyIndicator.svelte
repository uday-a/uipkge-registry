<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ScrollSpyColor } from './context'

  export interface ScrollSpyIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    color?: ScrollSpyColor
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getScrollSpyContext, resolveScrollSpyColor } from './context'

  let { class: className, color, ...restProps }: ScrollSpyIndicatorProps = $props()

  const ctx = getScrollSpyContext('ScrollSpyIndicator')

  const resolvedColor = $derived(color ?? ctx.color ?? 'primary')
  const handleColor = $derived(resolveScrollSpyColor(resolvedColor))

  interface Marker {
    value: string
    depth: number
    x: number
    y: number
    top: number
    bottom: number
  }

  let measurePathEl: SVGPathElement | null = $state(null)
  let trackPath = $state('')
  let pathLength = $state(0)
  let activeStart = $state(0)
  let activeEnd = $state(0)
  let straightHighlight = $state({ top: 0, height: 0, visible: false })
  let canAnimate = $state(false)
  let activeMarker = $state<Marker | null>(null)

  function depthX(relDepth: number, isRightRail: boolean, listWidth: number): number {
    if (!isRightRail) {
      if (relDepth <= 1) return 1
      if (relDepth === 2) return 13
      if (relDepth === 3) return 21
      return 21 + (relDepth - 3) * 8
    }
    // Right side rail
    const base = listWidth - 1
    if (relDepth <= 1) return base
    if (relDepth === 2) return base - 12
    if (relDepth === 3) return base - 20
    return base - 20 - (relDepth - 3) * 8
  }

  function collectMarkers(): Marker[] {
    const list = ctx.getListEl()
    if (!list) return []
    const listRect = list.getBoundingClientRect()
    const validItems = ctx.items.filter((i) => i.el && i.el.isConnected)
    if (validItems.length === 0) return []

    const isRightRail = ctx.position === 'left' && ctx.railPosition === 'right'
    const listWidth = listRect.width || 180

    const minDepth = Math.min(...validItems.map((i) => i.depth))
    const markers: Marker[] = []

    for (const item of validItems) {
      if (!item.el) continue
      const rect = item.el.getBoundingClientRect()
      const relDepth = Math.max(1, item.depth - minDepth + 1)
      const top = rect.top - listRect.top
      const bottom = rect.bottom - listRect.top
      markers.push({
        value: item.value,
        depth: item.depth,
        x: depthX(relDepth, isRightRail, listWidth),
        y: top + rect.height / 2,
        top,
        bottom,
      })
    }

    return markers.sort((a, b) => a.y - b.y)
  }

  function buildCircuitPath(markers: Marker[], endIndex: number, rounded: boolean, edge: 'top' | 'bottom'): string {
    if (markers.length === 0 || endIndex < 0) return ''

    const end = Math.min(endIndex, markers.length - 1)
    const first = markers[0]!
    const parts: string[] = [`M ${first.x} ${first.top}`]

    for (let i = 0; i <= end; i++) {
      const curr = markers[i]!

      if (i === end) {
        const targetY = edge === 'top' ? curr.top : curr.bottom
        parts.push(`L ${curr.x} ${targetY}`)
        break
      }

      const next = markers[i + 1]
      if (!next) {
        parts.push(`L ${curr.x} ${curr.bottom}`)
        break
      }

      // Always draw down the full height of curr at curr.x first
      parts.push(`L ${curr.x} ${curr.bottom}`)

      if (curr.x === next.x) {
        parts.push(`L ${curr.x} ${next.top}`)
        continue
      }

      // Smooth monotonic depth transition strictly bounded within [curr.bottom, next.top]
      const gap = Math.max(0, next.top - curr.bottom)
      const absDx = Math.abs(next.x - curr.x)
      const transitionH = Math.min(gap, absDx)

      if (transitionH <= 1) {
        parts.push(`L ${next.x} ${next.top}`)
        continue
      }

      const y1 = curr.bottom + (gap - transitionH) / 2
      let y2 = y1 + transitionH
      if (next.top - y2 <= 0.5) {
        y2 = next.top
      }

      // 1. Straight rail down to y1 at curr.x
      if (y1 - curr.bottom > 0.5) {
        parts.push(`L ${curr.x} ${y1}`)
      }

      // 2. Transition from (curr.x, y1) to (next.x, y2)
      if (rounded) {
        const midY = (y1 + y2) / 2
        parts.push(`C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${y2}`)
      } else {
        parts.push(`L ${next.x} ${y2}`)
      }

      // 3. Connect to next.top if next.top > y2
      if (next.top - y2 > 0.5) {
        parts.push(`L ${next.x} ${next.top}`)
      }
    }

    return parts.join(' ')
  }

  function measurePathLength(pathD: string): number {
    const el = measurePathEl
    if (!el || !pathD) return 0
    el.setAttribute('d', pathD)
    if (typeof el.getTotalLength === 'function') {
      try {
        return el.getTotalLength()
      } catch {
        // ignore
      }
    }
    return 100
  }

  async function updateGeometry() {
    const markers = collectMarkers()
    const activeValue = ctx.activeValue
    const activeIndex = markers.findIndex(
      (m) => m.value === activeValue || m.value.replace(/^#/, '') === activeValue.replace(/^#/, ''),
    )
    const turn = ctx.turn
    const indicator = ctx.indicator
    const isRightRail = ctx.position === 'left' && ctx.railPosition === 'right'

    if (markers.length === 0) {
      trackPath = ''
      pathLength = 0
      activeStart = 0
      activeEnd = 0
      activeMarker = null
      straightHighlight = { top: 0, height: 0, visible: false }
      return
    }

    const first = markers[0]!
    const last = markers[markers.length - 1]!

    if (turn === 'straight') {
      const railX = isRightRail ? first.x : 1
      trackPath = `M ${railX} ${first.top} L ${railX} ${last.bottom}`
      pathLength = 0
      activeStart = 0
      activeEnd = 0

      if (indicator === 'progress') {
        const list = ctx.getListEl()
        const totalHeight = list ? list.clientHeight : last.bottom - first.top
        straightHighlight = {
          top: first.top,
          height: Math.max(0, totalHeight * ctx.scrollProgress),
          visible: true,
        }
        activeMarker = null
        enableAnimation()
        return
      }

      if (activeIndex < 0) {
        straightHighlight = { top: 0, height: 0, visible: false }
        activeMarker = null
        return
      }

      const active = markers[activeIndex]!
      activeMarker = active

      const isFillMode = indicator === 'fill' || ctx.keepScrolled

      if (isFillMode) {
        straightHighlight = {
          top: first.top,
          height: Math.max(active.bottom - first.top, 14),
          visible: true,
        }
      } else {
        straightHighlight = {
          top: active.top,
          height: Math.max(active.bottom - active.top, 14),
          visible: true,
        }
      }
      enableAnimation()
      return
    }

    // Circuit Mode: sharp 45° angle or rounded curves
    const rounded = turn === 'rounded'
    const fullPath = buildCircuitPath(markers, markers.length - 1, rounded, 'bottom')
    trackPath = fullPath
    straightHighlight = { top: 0, height: 0, visible: false }

    await tick()

    const total = measurePathLength(fullPath)
    pathLength = total

    if (total === 0) {
      activeStart = 0
      activeEnd = 0
      activeMarker = null
      return
    }

    if (indicator === 'progress') {
      activeStart = 0
      activeEnd = total * ctx.scrollProgress
      activeMarker = null
      enableAnimation()
      return
    }

    if (activeIndex < 0) {
      activeStart = 0
      activeEnd = 0
      activeMarker = null
      return
    }

    const active = markers[activeIndex]!
    activeMarker = active

    const isFillMode = indicator === 'fill' || ctx.keepScrolled
    const startLength = isFillMode ? 0 : measurePathLength(buildCircuitPath(markers, activeIndex, rounded, 'top'))
    const endLength = measurePathLength(buildCircuitPath(markers, activeIndex, rounded, 'bottom'))

    activeStart = startLength
    activeEnd = endLength
    enableAnimation()
  }

  function enableAnimation() {
    if (!canAnimate) {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          canAnimate = true
        })
      } else {
        canAnimate = true
      }
    }
  }

  let rafId = 0
  function scheduleUpdate() {
    if (typeof window === 'undefined') return
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId)
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(() => {
        updateGeometry()
      })
    } else {
      updateGeometry()
    }
  }

  $effect(() => {
    scheduleUpdate()
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(rafId)
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', scheduleUpdate)
      }
    }
  })

  // Re-measure whenever anything the geometry depends on changes.
  $effect(() => {
    void ctx.activeValue
    void ctx.items
    void ctx.turn
    void ctx.indicator
    void ctx.keepScrolled
    void ctx.resolvedLineWidth
    void ctx.position
    void ctx.railPosition
    void ctx.scrollProgress
    scheduleUpdate()
  })

  const turn = $derived(ctx.turn)
  const indicator = $derived(ctx.indicator)
  const keepScrolled = $derived(ctx.keepScrolled)
  const lineWidth = $derived(ctx.resolvedLineWidth)
  const isRightRail = $derived(ctx.position === 'left' && ctx.railPosition === 'right')
</script>

<div data-slot="scroll-spy-indicator" class={cn('pointer-events-none absolute inset-0 overflow-visible', className)} aria-hidden="true" {...restProps}>
  {#if turn !== 'straight'}
    <svg class="absolute inset-0 size-full overflow-visible" fill="none">
      <path bind:this={measurePathEl} class="invisible" fill="none" />
      <path
        d={trackPath}
        class="stroke-border"
        stroke-width={lineWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      {#if trackPath && activeEnd > 0}
        <path
          d={trackPath}
          class={handleColor.strokeClass}
          stroke-width={lineWidth}
          stroke-linecap="butt"
          stroke-linejoin="round"
          style="stroke: {handleColor.customColor}; stroke-dasharray: {Math.max(
            activeEnd - activeStart,
            0,
          )} {Math.max(pathLength, 1)}; stroke-dashoffset: {-activeStart}; transition: {canAnimate &&
          indicator !== 'progress'
            ? 'stroke-dashoffset 260ms cubic-bezier(0.16, 1, 0.3, 1), stroke-dasharray 260ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none'};"
        />
      {/if}
    </svg>
  {/if}

  {#if turn === 'straight' && straightHighlight.visible && (indicator !== 'segment' || keepScrolled)}
    <div
      class={cn('absolute z-10 rounded-none', handleColor.bgClass)}
      style="top: {straightHighlight.top}px; height: {straightHighlight.height}px; width: {lineWidth}px; background-color: {handleColor.customColor}; {isRightRail
        ? `right: -${lineWidth}px;`
        : `left: -${lineWidth}px;`} transition: {canAnimate && indicator !== 'progress'
        ? 'top 260ms cubic-bezier(0.16, 1, 0.3, 1), height 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease-out'
        : 'none'};"
    ></div>
  {/if}
</div>
