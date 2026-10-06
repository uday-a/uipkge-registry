<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ResizableDirection, ResizableGroupContext } from './ResizablePanelGroup.svelte'

  export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
    /** Render a grip indicator on the divider. */
    withHandle?: boolean
    /** When `true`, this handle cannot be dragged. */
    disabled?: boolean
    children?: Snippet
    ref?: HTMLDivElement | null
  }

  export type { ResizableDirection }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { GripVertical } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    withHandle = false,
    disabled = undefined,
    children,
    onkeydown: onkeydownProp,
    ref = $bindable(null),
    ...restProps
  }: ResizableHandleProps = $props()

  const group = getContext<ResizableGroupContext | undefined>('resizableGroup')

  let el: HTMLDivElement | null = null

  $effect(() => {
    ref = el
  })

  const effectiveDisabled = $derived(disabled ?? group?.disabled ?? false)
  const direction = $derived(group?.direction ?? 'horizontal')
  const vertical = $derived(direction === 'vertical')

  /** Panels adjacent to this handle, resolved through DOM order. */
  function adjacentPanels(): [string, string] | null {
    if (!el || !group) return null
    const panels = [...(el.parentElement?.querySelectorAll(':scope > [data-slot="resizable-panel"]') ?? [])]
    const handleIndex = [...(el.parentElement?.children ?? [])].indexOf(el)
    const before = [...panels].filter((p) => [...(el!.parentElement?.children ?? [])].indexOf(p) < handleIndex).pop()
    const after = [...panels].find((p) => [...(el!.parentElement?.children ?? [])].indexOf(p) > handleIndex)
    const beforeId = before?.getAttribute('data-panel-id')
    const afterId = after?.getAttribute('data-panel-id')
    if (!beforeId || !afterId) return null
    return [beforeId, afterId]
  }

  function groupSpan(): number {
    const parent = el?.parentElement
    if (!parent) return 0
    const rect = parent.getBoundingClientRect()
    return vertical ? rect.height : rect.width
  }

  function onPointerDown(event: PointerEvent) {
    if (effectiveDisabled || !group) return
    const pair = adjacentPanels()
    if (!pair) return
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    const span = groupSpan()
    const start = vertical ? event.clientY : event.clientX
    const [beforeId, afterId] = pair
    let last = start
    const move = (e: PointerEvent) => {
      const pos = vertical ? e.clientY : e.clientX
      if (span > 0) group.resize(beforeId, afterId, ((pos - last) / span) * 100)
      last = pos
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (effectiveDisabled || !group) return
    const pair = adjacentPanels()
    if (!pair) return
    const step = event.shiftKey ? 10 : 2
    let delta: number | null = null
    if (!vertical && event.key === 'ArrowRight') delta = step
    else if (!vertical && event.key === 'ArrowLeft') delta = -step
    else if (vertical && event.key === 'ArrowDown') delta = step
    else if (vertical && event.key === 'ArrowUp') delta = -step
    else if (event.key === 'Home') delta = -100
    else if (event.key === 'End') delta = 100
    else return
    event.preventDefault()
    group.resize(pair[0], pair[1], delta)
  }

  const ariaValue = $derived.by(() => {
    if (!group) return undefined
    const pair = adjacentPanels()
    if (!pair) return undefined
    return Math.round(group.sizeOf(pair[0]) * 10) / 10
  })
</script>

<!-- role="separator" owns keyboard + pointer resizing; the svelte a11y rule only whitelists a subset of interactive roles. -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={el}
  role="separator"
  tabindex={effectiveDisabled ? -1 : 0}
  aria-orientation={vertical ? 'vertical' : 'horizontal'}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={ariaValue}
  aria-disabled={effectiveDisabled || undefined}
  data-uipkge=""
  data-slot="resizable-handle"
  data-orientation={direction}
  data-disabled={effectiveDisabled || undefined}
  class={cn(
    'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2 [&[data-orientation=vertical]>div]:rotate-90',
    effectiveDisabled && 'pointer-events-none opacity-50',
    className,
  )}
  {...restProps}
  onpointerdown={onPointerDown}
  onkeydown={(e) => {
    handleKeydown(e)
    onkeydownProp?.(e)
  }}
>
  {#if withHandle}
    <div class="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
      {#if children}
        {@render children()}
      {:else}
        <GripVertical class="size-2.5" aria-hidden="true" />
      {/if}
    </div>
  {/if}
</div>
