<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface WatermarkProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    /** Text content for the watermark. Ignored when `image` is set. */
    content?: string
    /** Image URL. When set, repeats the image instead of text. */
    image?: string
    /** Rotation angle in degrees. */
    rotate?: number
    /** Gap between repeats in pixels (both x and y). */
    gap?: number
    /** Opacity 0-1. */
    opacity?: number
    /** Font size in pixels (text only). */
    fontSize?: number
    /** Font color (text only). */
    color?: string
    /** Font family (text only). */
    fontFamily?: string
    /** Font weight (text only). */
    fontWeight?: number | string
    /** z-index of the overlay. */
    zIndex?: number
    /** When true, the overlay captures pointer events (blocks interaction). Default false (pointer-events-none). */
    interactive?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    children,
    content = '',
    image,
    rotate = -22,
    gap = 100,
    opacity = 0.08,
    fontSize = 16,
    color = 'currentColor',
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    zIndex = 9,
    interactive = false,
    class: className,
    ...restProps
  }: WatermarkProps = $props()

  let containerRef: HTMLDivElement | null = $state(null)
  let width = $state(0)
  let height = $state(0)

  $effect(() => {
    const el = containerRef
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      width = rect.width
      height = rect.height
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => ro.disconnect()
  })

  // Build a tiled SVG data URL that repeats the text/image across a tile of
  // size (gap + contentSize). The SVG is then used as a background-image on
  // the overlay div, rotated to the requested angle.
  const watermarkUrl = $derived.by(() => {
    if (!width || !height) return ''
    const text = content || ''

    if (image) {
      // For images we tile the image at its natural size within the gap.
      const tile = gap + 100
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">
  <image href="${image}" x="${gap / 2}" y="${gap / 2}" width="100" height="100" opacity="${opacity}" transform="rotate(${rotate} ${tile / 2} ${tile / 2})"/>
</svg>`
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
    }

    if (!text) return ''

    // Estimate text width — rough heuristic, good enough for tiling.
    const textWidth = text.length * fontSize * 0.6
    const tileW = gap + textWidth
    const tileH = gap + fontSize * 1.5

    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 ${tileW} ${tileH}">
  <text x="${gap / 2}" y="${gap / 2 + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" fill="${color}" opacity="${opacity}" transform="rotate(${rotate} ${gap / 2} ${gap / 2 + fontSize / 2})">${escapedText}</text>
</svg>`
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  })
</script>

<div bind:this={containerRef} data-uipkge data-slot="watermark" class={cn('relative', className)} {...restProps}>
  {@render children?.()}
  <div
    data-uipkge
    data-slot="watermark-overlay"
    class="absolute inset-0 overflow-hidden"
    style:background-image={watermarkUrl ? `url("${watermarkUrl}")` : undefined}
    style:background-repeat="repeat"
    style:z-index={zIndex}
    style:pointer-events={interactive ? 'auto' : 'none'}
    aria-hidden="true"
  ></div>
</div>
