<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  /** Imperative handle — grab it with `bind:this` (React `ImageCropperHandle` parity). */
  export interface ImageCropperHandle {
    getCroppedCanvas: () => HTMLCanvasElement | null
    getCroppedBlob: (type?: string, quality?: number) => Promise<Blob | null>
  }

  export interface ImageCropperProps extends HTMLAttributes<HTMLDivElement> {
    src: string
    alt?: string
    aspectRatio?: number
    /** Two-way bound zoom (`bind:zoom`). */
    zoom?: number
    /** Fired with the clamped zoom whenever it changes (React parity — `bind:zoom` still works). */
    onZoomChange?: (zoom: number) => void
    minZoom?: number
    maxZoom?: number
    disabled?: boolean
    showZoom?: boolean
    rounded?: 'lg' | 'full'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    src,
    alt = '',
    aspectRatio,
    zoom = $bindable(1),
    onZoomChange,
    minZoom = 1,
    maxZoom = 4,
    disabled = false,
    showZoom = false,
    rounded = 'lg',
    ref = $bindable(null),
    ...restProps
  }: ImageCropperProps = $props()

  let viewport: HTMLElement | null = $state(null)
  let img: HTMLImageElement | null = $state(null)
  let pan = $state({ x: 0, y: 0 })
  let natural = $state({ w: 0, h: 0 })
  let dragging = $state(false)
  let lastPointer = $state({ x: 0, y: 0 })

  function coverScale(vw: number, vh: number, nw: number, nh: number) {
    if (!nw || !nh) return 1
    return Math.max(vw / nw, vh / nh)
  }

  function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
  }

  function setZoom(value: number) {
    zoom = clamp(value, minZoom, maxZoom)
    onZoomChange?.(zoom)
    tick().then(clampPan)
  }

  function onZoomInput(e: Event & { currentTarget: HTMLInputElement }) {
    setZoom(Number(e.currentTarget.value))
  }

  function clampPan() {
    const el = viewport
    if (!el || !natural.w) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    const scale = coverScale(vw, vh, natural.w, natural.h) * zoom
    const dw = natural.w * scale
    const dh = natural.h * scale
    const maxX = Math.abs(vw - dw) / 2
    const maxY = Math.abs(vh - dh) / 2
    pan = {
      x: clamp(pan.x, -maxX, maxX),
      y: clamp(pan.y, -maxY, maxY),
    }
  }

  const imgStyle = $derived.by(() => {
    const el = viewport
    const nw = natural.w
    const nh = natural.h
    if (!el || !nw) return 'transform: translate(-50%, -50%)'
    const vw = el.clientWidth
    const vh = el.clientHeight
    const scale = coverScale(vw, vh, nw, nh) * zoom
    return (
      `width: ${nw * scale}px; height: ${nh * scale}px; ` +
      `transform: translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`
    )
  })

  function onLoad() {
    if (!img) return
    natural = { w: img.naturalWidth, h: img.naturalHeight }
    pan = { x: 0, y: 0 }
    tick().then(clampPan)
  }

  function onPointerDown(e: PointerEvent & { currentTarget: HTMLElement }) {
    if (disabled) return
    dragging = true
    lastPointer = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return
    pan = {
      x: pan.x + (e.clientX - lastPointer.x),
      y: pan.y + (e.clientY - lastPointer.y),
    }
    lastPointer = { x: e.clientX, y: e.clientY }
    clampPan()
  }

  function onPointerUp(e: PointerEvent & { currentTarget: HTMLElement }) {
    dragging = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  function onWheel(e: WheelEvent) {
    if (disabled) return
    e.preventDefault()
    setZoom(zoom + (e.deltaY > 0 ? -0.12 : 0.12))
  }

  $effect(() => {
    void zoom
    tick().then(clampPan)
  })

  function onKeydown(e: KeyboardEvent) {
    if (disabled) return
    const step = 8
    if (e.key === 'ArrowLeft') pan = { ...pan, x: pan.x - step }
    if (e.key === 'ArrowRight') pan = { ...pan, x: pan.x + step }
    if (e.key === 'ArrowUp') pan = { ...pan, y: pan.y - step }
    if (e.key === 'ArrowDown') pan = { ...pan, y: pan.y + step }
    if (e.key === '+' || e.key === '=') setZoom(zoom + 0.2)
    if (e.key === '-' || e.key === '_') setZoom(zoom - 0.2)
    clampPan()
  }

  /** Render the current viewport to a canvas. Reachable via `bind:this`. */
  export function getCroppedCanvas() {
    const el = viewport
    if (!el || !img || !natural.w) return null
    const vw = el.clientWidth
    const vh = el.clientHeight
    const scale = coverScale(vw, vh, natural.w, natural.h) * zoom
    const dw = natural.w * scale
    const dh = natural.h * scale
    const left = (vw - dw) / 2 + pan.x
    const top = (vh - dh) / 2 + pan.y
    const sx = -left / scale
    const sy = -top / scale
    const sw = vw / scale
    const sh = vh / scale
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sw))
    canvas.height = Math.max(1, Math.round(sh))
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  /** Render the current viewport to a Blob. Reachable via `bind:this`. */
  export function getCroppedBlob(type = 'image/png', quality?: number) {
    return new Promise<Blob | null>((resolve) => {
      const canvas = getCroppedCanvas()
      if (!canvas) {
        resolve(null)
        return
      }
      canvas.toBlob((blob) => resolve(blob), type, quality)
    })
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="image-cropper"
  class={cn('flex w-full max-w-md flex-col gap-3', className)}
  {...restProps}
>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions: keyboard-operated crop viewport (arrows pan, + / − zoom) -->
  <div
    bind:this={viewport}
    data-slot="image-cropper-viewport"
    role="application"
    aria-label="Image crop viewport"
    tabindex="0"
    data-disabled={disabled ? '' : undefined}
    class={cn(
      'bg-muted relative w-full overflow-hidden select-none',
      rounded === 'full' ? 'rounded-full' : 'rounded-lg',
      disabled ? 'pointer-events-none opacity-60' : 'cursor-grab active:cursor-grabbing',
    )}
    style={aspectRatio ? `aspect-ratio: ${aspectRatio}` : 'aspect-ratio: 1'}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onwheel={onWheel}
    onkeydown={onKeydown}
  >
    <img
      bind:this={img}
      data-slot="image-cropper-image"
      {src}
      {alt}
      draggable="false"
      class="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
      style={imgStyle}
      onload={onLoad}
    />
  </div>
  {#if showZoom}
    <label data-slot="image-cropper-zoom" class="text-muted-foreground flex items-center gap-3 text-xs">
      <span class="w-10">Zoom</span>
      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step="0.05"
        value={zoom}
        class="accent-primary h-1.5 w-full cursor-pointer"
        aria-label="Zoom"
        oninput={onZoomInput}
      />
      <span class="w-10 tabular-nums">{zoom.toFixed(1)}×</span>
    </label>
  {/if}
</div>
