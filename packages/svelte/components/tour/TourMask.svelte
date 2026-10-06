<script lang="ts" module>
  import type { TargetRect } from './tour-target.svelte'

  export interface TourMaskProps {
    rect: TargetRect | null
    zIndex: number
    opacity?: number
    padding?: number
    radius?: number
  }
</script>

<script lang="ts">
  let { rect, zIndex, opacity = 0.5, padding = 4, radius = 6 }: TourMaskProps = $props()

  // Unique mask id so multiple open tours (or other SVG masks on the page) never collide.
  const uid = $props.id()
  const maskId = `uipkge-tour-mask-${uid}`

  const cutout = $derived.by(() => {
    const r = rect
    if (!r) return null
    return { x: r.x - padding, y: r.y - padding, w: r.width + padding * 2, h: r.height + padding * 2 }
  })

  /**
   * Clip-path leaves a hole over the target so pointer events pass through to the
   * highlighted element. SVG mask alone does not punch a hit-test hole.
   */
  const hitClipPath = $derived.by(() => {
    const c = cutout
    if (!c) return undefined
    const { x, y, w, h } = c
    return `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${x}px ${y}px, ${x}px ${y + h}px, ${x + w}px ${y + h}px, ${x + w}px ${y}px, ${x}px ${y}px)`
  })

  const reduceMotion = $derived(
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
</script>

<!-- Visual dim with rounded cutout (decorative only — no hit testing). -->
<svg
  class="pointer-events-none fixed inset-0"
  style="z-index: {zIndex}; --tour-padding: {padding}px; --tour-radius: {radius}px"
  width="100%"
  height="100%"
  aria-hidden="true"
>
  <defs>
    <mask id={maskId}>
      <rect width="100%" height="100%" fill="white" />
      {#if cutout}
        <rect x={cutout.x} y={cutout.y} width={cutout.w} height={cutout.h} rx={radius} fill="black" />
      {/if}
    </mask>
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="rgba(0, 0, 0, {opacity})"
    mask="url(#{maskId})"
    style={reduceMotion ? undefined : 'transition: all 200ms ease'}
  />
</svg>
<!-- Hit layer: blocks clicks outside the cutout; hole is click-through. -->
<div
  class="fixed inset-0"
  aria-hidden="true"
  style="z-index: {zIndex}; clip-path: {hitClipPath ?? 'none'}; background: transparent"
></div>
