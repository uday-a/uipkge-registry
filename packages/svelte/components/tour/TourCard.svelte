<script lang="ts" module>
  import type { TargetRect } from './tour-target.svelte'

  export interface TourCardProps {
    title: string
    description?: string
    cover?: string
    rect: TargetRect | null
    total: number
    current: number
    prevText?: string
    nextText?: string
    finishText?: string
    type?: 'default' | 'primary'
    zIndex: number
    /** When true, move focus into the card (on open / step change). */
    autofocus?: boolean
    onprev?: () => void
    onnext?: () => void
    onfinish?: () => void
    onskip?: () => void
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { X } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import { cn } from '$lib/utils'

  let {
    title,
    description,
    cover,
    rect,
    total,
    current,
    prevText = 'Previous',
    nextText = 'Next',
    finishText = 'Finish',
    type = 'default',
    zIndex,
    autofocus = false,
    onprev,
    onnext,
    onfinish,
    onskip,
  }: TourCardProps = $props()

  const isLast = $derived(current === total - 1)
  const isFirst = $derived(current === 0)

  const uid = $props.id()
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`
  let cardRef = $state<HTMLElement | null>(null)
  /** Measured card height used for placement; falls back to estimate until laid out. */
  let measuredHeight = $state(0)

  const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function focusCard() {
    tick().then(() => {
      cardRef?.focus()
    })
  }

  $effect(() => {
    const el = cardRef
    if (!el || typeof ResizeObserver === 'undefined') {
      if (el) measuredHeight = el.getBoundingClientRect().height
      return
    }
    const ro = new ResizeObserver(() => {
      measuredHeight = el.getBoundingClientRect().height
    })
    ro.observe(el)
    measuredHeight = el.getBoundingClientRect().height
    return () => ro.disconnect()
  })

  $effect(() => {
    // Re-run (and refocus) after step content swaps (title/cover/description).
    void current
    void title
    void description
    void cover
    if (autofocus) focusCard()
  })

  /** Keep Tab cycling inside the dialog while aria-modal is asserted. */
  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !cardRef) return
    // Prefer getClientRects over offsetParent — fixed-position descendants report null offsetParent.
    const list = Array.from(cardRef.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    )
    if (list.length === 0) return
    const first = list[0]!
    const last = list[list.length - 1]!
    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === cardRef) {
        e.preventDefault()
        last.focus()
      }
    } else if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const cardStyle = $derived.by(() => {
    const cardWidth = 320
    const margin = 12
    const edgePadding = 8
    // Prefer measured height; estimate only before first layout (cover makes card taller).
    const cardHeight = measuredHeight || (cover ? 320 : 200)
    if (!rect) {
      return `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${cardWidth}px; z-index: ${zIndex + 1}`
    }
    const { x, y, height } = rect
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 768
    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1024
    const placeBelow = y + height + margin + cardHeight < viewportH
    const top = placeBelow ? y + height + margin : Math.max(edgePadding, y - margin - cardHeight)
    let left = x
    if (left + cardWidth > viewportW - edgePadding) {
      left = viewportW - cardWidth - edgePadding
    }
    if (left < edgePadding) left = edgePadding
    return `position: fixed; top: ${top}px; left: ${left}px; width: ${cardWidth}px; z-index: ${zIndex + 1}`
  })
</script>

<div
  bind:this={cardRef}
  data-uipkge
  data-slot="tour-card"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  aria-describedby={description ? descriptionId : undefined}
  tabindex="-1"
  class={cn(
    'relative space-y-3 rounded-lg border p-4 shadow-lg outline-none',
    type === 'primary' ? 'border-primary bg-primary text-primary-foreground' : 'bg-popover text-popover-foreground',
  )}
  style={cardStyle}
  onkeydown={onKeydown}
>
  <button
    type="button"
    class="absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    aria-label="Close tour"
    onclick={() => onskip?.()}
  >
    <X class="size-4" aria-hidden="true" />
  </button>

  {#if cover}
    <img src={cover} alt="" class="w-full rounded-md" />
  {/if}

  <div>
    <div id={titleId} class="pr-6 font-semibold">{title}</div>
    {#if description}
      <div id={descriptionId} class="mt-1 text-sm opacity-90">{description}</div>
    {/if}
  </div>

  <div class="flex items-center justify-between gap-2 pt-2">
    <div class="text-xs tabular-nums opacity-70" aria-live="polite" aria-atomic="true">
      {current + 1} / {total}
    </div>
    <div class="flex gap-2">
      {#if !isFirst}
        <Button size="sm" variant={type === 'primary' ? 'secondary' : 'outline'} onclick={() => onprev?.()}>
          {prevText}
        </Button>
      {/if}
      {#if !isLast}
        <Button size="sm" variant={type === 'primary' ? 'secondary' : 'default'} onclick={() => onnext?.()}>
          {nextText}
        </Button>
      {:else}
        <Button size="sm" variant={type === 'primary' ? 'secondary' : 'default'} onclick={() => onfinish?.()}>
          {finishText}
        </Button>
      {/if}
    </div>
  </div>
</div>
