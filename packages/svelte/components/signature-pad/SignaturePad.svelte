<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SignaturePadActions {
    clear: () => void
    exportSignature: () => void
    empty: boolean
  }

  /** Imperative handle — grab it with `bind:this`. React's `SignaturePadRef`
   *  exposes `pointCount` / `isEmpty` as render-time snapshot properties;
   *  Svelte's `bind:this` publishes functions instead, so the live values are
   *  read via `getPointCount()` / `isEmpty()`. `toDataURL()` additionally
   *  returns the exported value (React's is a void alias of `exportSignature`). */
  export interface SignaturePadRef {
    clear: () => void
    exportSignature: () => void
    toDataURL: () => string | null
    getPointCount: () => number
    isEmpty: () => boolean
  }

  export interface SignaturePadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /** PNG data URL of the signature. Binds two-way; null when empty. */
    value?: string | null
    /** Reactive empty flag. `bind:empty` to observe — the component writes it
     *  as ink is added/cleared; writing it from the outside does not repaint
     *  the canvas (same one-way caveat as `value`). */
    empty?: boolean
    width?: number
    height?: number
    penColor?: string
    penThickness?: number
    backgroundColor?: string
    exportFormat?: string
    disabled?: boolean
    readonly?: boolean
    showClearButton?: boolean
    clearLabel?: string
    onbegin?: () => void
    onend?: () => void
    onchange?: (value: string | null) => void
    /** Custom action row. Receives clear / exportSignature / empty. */
    actions?: Snippet<[SignaturePadActions]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Eraser } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { signaturePadVariants } from './signature-pad.variants'

  let {
    class: className,
    value = $bindable(null),
    empty = $bindable(true),
    width = 400,
    height = 200,
    // Theme tokens are OKLCH (`--foreground` / `--background`). Resolve via
    // getComputedStyle — canvas cannot parse `hsl(var(--…))` or bare `var(--…)`.
    penColor = '',
    penThickness = 2,
    backgroundColor = '',
    exportFormat = 'image/png',
    disabled = false,
    readonly = false,
    showClearButton = true,
    clearLabel = 'Clear',
    onbegin,
    onend,
    onchange,
    actions,
    ref = $bindable(null),
    ...restProps
  }: SignaturePadProps = $props()

  let canvasRef: HTMLCanvasElement | null = $state(null)
  let isDrawing = $state(false)
  let pointCount = $state(0)
  let hasInk = $state(false)
  let ctx: CanvasRenderingContext2D | null = $state(null)
  let lastX = 0
  let lastY = 0

  const isInteractive = $derived(!disabled && !readonly)

  /** Resolve theme CSS variables (and legacy `hsl(var(--x))`) to a paint color canvas accepts. */
  function resolveColor(input: string | undefined, cssVar: string): string {
    let candidate = (input || '').trim()
    if (!candidate) candidate = `var(${cssVar})`
    // Legacy shadcn hsl() wrapper around a CSS variable — unwrap.
    const hslWrapped = candidate.match(/^hsl\(\s*(var\(--[^)]+\))\s*\)$/i)
    if (hslWrapped) candidate = hslWrapped[1]!
    if (candidate.startsWith('var(')) {
      const name = candidate.match(/var\((--[^),]+)/)?.[1]
      if (name && typeof document !== 'undefined') {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        if (v) return v
      }
    }
    return candidate
  }

  function setupCanvas() {
    const canvas = canvasRef
    if (!canvas || typeof window === 'undefined') return
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = resolveColor(penColor, '--foreground')
    context.lineWidth = penThickness
    context.fillStyle = resolveColor(backgroundColor, '--background')
    context.fillRect(0, 0, width, height)
    ctx = context
    pointCount = 0
    hasInk = false
    empty = true
  }

  // Runs on mount and re-runs when pen/size options change (same trigger set
  // as the Vue twin's watcher). Reads of width/height/colors subscribe the effect.
  $effect(() => {
    setupCanvas()
    return () => {
      ctx = null
    }
  })

  function getPointerPos(e: PointerEvent): { x: number; y: number } {
    const canvas = canvasRef
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    // Map CSS pixels → logical canvas coords if the element is CSS-scaled.
    const scaleX = width / (rect.width || width)
    const scaleY = height / (rect.height || height)
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function startDraw(e: PointerEvent) {
    if (!isInteractive || !ctx) return
    e.preventDefault()
    isDrawing = true
    const { x, y } = getPointerPos(e)
    lastX = x
    lastY = y
    ctx.beginPath()
    ctx.moveTo(x, y)
    pointCount += 1
    hasInk = true
    empty = false
    onbegin?.()
    canvasRef?.setPointerCapture(e.pointerId)
  }

  function draw(e: PointerEvent) {
    if (!isDrawing || !ctx) return
    e.preventDefault()
    const { x, y } = getPointerPos(e)
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastX = x
    lastY = y
    pointCount += 1
  }

  function endDraw(e: PointerEvent) {
    if (!isDrawing) return
    isDrawing = false
    ctx?.closePath()
    canvasRef?.releasePointerCapture(e.pointerId)
    exportSignature()
    onend?.()
  }

  export function exportSignature() {
    const canvas = canvasRef
    if (!canvas) return
    if (!hasInk) {
      value = null
      onchange?.(null)
      return
    }
    const dataUrl = canvas.toDataURL(exportFormat)
    value = dataUrl
    onchange?.(dataUrl)
  }

  export function toDataURL() {
    exportSignature()
    return value
  }

  export function clear() {
    const canvas = canvasRef
    const context = ctx
    if (!canvas || !context) return
    context.fillStyle = resolveColor(backgroundColor, '--background')
    context.fillRect(0, 0, width, height)
    pointCount = 0
    hasInk = false
    empty = true
    value = null
    onchange?.(null)
  }

  export function isEmpty() {
    return !hasInk
  }

  export function getPointCount() {
    return pointCount
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="signature-pad"
  data-disabled={disabled ? '' : undefined}
  data-readonly={readonly ? '' : undefined}
  class={cn(signaturePadVariants(), className)}
  {...restProps}
>
  <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role, a11y_role_supports_aria_props -- canvas-as-img + aria-disabled mirror the Vue twin: a labeled drawing surface, announced state for disabled/readonly. -->
  <canvas
    bind:this={canvasRef}
    class={cn('block touch-none rounded-md', !isInteractive && 'pointer-events-none')}
    style="touch-action:none"
    aria-label={'Signature pad' + (disabled ? ' (disabled)' : readonly ? ' (readonly)' : '')}
    aria-disabled={disabled || undefined}
    role="img"
    onpointerdown={startDraw}
    onpointermove={draw}
    onpointerup={endDraw}
    onpointercancel={endDraw}
    onpointerleave={endDraw}
  ></canvas>
  {#if showClearButton && isInteractive}
    <div class="flex items-center justify-between gap-2 pt-2">
      <span class="text-muted-foreground text-xs tabular-nums">{pointCount} points</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        disabled={!hasInk}
        onclick={clear}
      >
        <Eraser class="size-4" />
        {clearLabel}
      </button>
    </div>
  {/if}
  {@render actions?.({ clear, exportSignature, empty: !hasInk })}
</div>

