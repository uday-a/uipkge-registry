<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ChipVariants } from './chip.variants'

  export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: ChipVariants['variant']
    size?: ChipVariants['size']
    /** Allow the label to wrap onto multiple lines instead of clipping. */
    wrap?: boolean
    /** Show a dismiss button; `onclose` fires after the leave animation. */
    closable?: boolean
    children?: Snippet
    /** Fires when the chip requests removal (after the leave animation). */
    onclose?: () => void
  }
</script>

<script lang="ts">
  import { X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { chipVariants } from './chip.variants'

  let {
    class: className,
    variant = 'default',
    size = 'default',
    wrap,
    closable = false,
    children,
    onclose,
    ...restProps
  }: ChipProps = $props()

  let leaving = $state(false)

  function onClose() {
    if (leaving) return
    leaving = true
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => {
      onclose?.()
    }, reduce ? 0 : 160)
  }
</script>

<span
  data-uipkge
  data-slot="chip"
  data-variant={variant}
  data-leaving={leaving || undefined}
  class={cn(chipVariants({ variant, size, wrap }), 'chip-enter', leaving && 'chip-leave', className)}
  {...restProps}
>
  {@render children?.()}
  {#if closable}
    <button
      type="button"
      aria-label="Remove item"
      class="focus-visible:ring-ring hover:bg-foreground/10 ml-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full transition-transform duration-150 focus-visible:ring-1 focus-visible:outline-none active:scale-90"
      onclick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <X class="size-3" aria-hidden="true" />
    </button>
  {/if}
</span>

<style>
  @keyframes chip-enter {
    from {
      opacity: 0;
      transform: scale(0.88);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes chip-leave {
    to {
      opacity: 0;
      transform: scale(0.88);
    }
  }

  :global([data-slot='chip']).chip-enter {
    animation: chip-enter 180ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
  }

  :global([data-slot='chip']).chip-leave {
    animation: chip-leave 160ms ease-in both;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    :global([data-slot='chip']).chip-enter,
    :global([data-slot='chip']).chip-leave {
      animation: none !important;
    }
  }
</style>
