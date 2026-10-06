<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectScrollUpButtonProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { ChevronUp } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: SelectScrollUpButtonProps = $props()

  let btnEl: HTMLDivElement | null = $state(null)
  let timer: ReturnType<typeof setInterval> | null = null

  function viewport(): HTMLElement | null {
    return btnEl?.closest('[data-slot="select-content"]')?.querySelector('[data-slot="select-viewport"]') ?? null
  }

  function step() {
    const vp = viewport()
    if (vp) vp.scrollTop -= 24
  }

  function start(e: PointerEvent) {
    e.preventDefault()
    step()
    timer = setInterval(step, 50)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
</script>

<div
  bind:this={btnEl}
  data-uipkge
  data-slot="select-scroll-up-button"
  aria-hidden="true"
  class={cn('flex cursor-default items-center justify-center py-1', className)}
  onpointerdown={start}
  onpointerup={stop}
  onpointerleave={stop}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronUp class="size-4" aria-hidden="true" />
  {/if}
</div>
