<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BoardLaneBodyProps extends HTMLAttributes<HTMLDivElement> {
    /** Override the transition name. Defaults to the board-level motion preset. */
    motion?: string
    /** The body <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { BOARD_CONTEXT, type BoardContext } from './context'

  let { class: className, motion = undefined, children, ref = $bindable(null), ...restProps }: BoardLaneBodyProps =
    $props()

  const board = getContext<BoardContext | null>(BOARD_CONTEXT)
  const motionName = $derived(motion ?? board?.motion ?? 'motion-list')
</script>

<!-- Inner padding (py-1 / px-0.5) reserves breathing room for the
     per-card hover-lift (-translate-y-0.5), the focus / drag / moved
     rings (ring-2 + ring-offset-1 ≈ 3px outward), and the hover
     shadow halo. Without it, the first / last cards' hover state
     crops against the overflow-y-auto edge. pr-1 still wins on the
     right so the thin scrollbar has a gutter.
     NOTE: the Vue twin wraps the slot in a TransitionGroup for FLIP
     reorder animation. Slotted children can't carry Svelte's
     `animate:flip`, so reorder motion comes from the card-level CSS
     transitions only; `motion` is kept for API parity and exposed as
     a data attribute for consumer CSS hooks. -->
<div
  bind:this={ref}
  data-uipkge=""
  data-slot="board-lane-body"
  data-motion={motionName}
  class={cn('flex min-h-0 flex-1 [scrollbar-width:thin] flex-col gap-2 overflow-y-auto px-0.5 py-1 pr-1', className)}
  {...restProps}
>
  <div class="relative flex flex-col gap-2">
    {@render children?.()}
  </div>
</div>
