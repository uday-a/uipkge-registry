<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface SelectTriggerProps extends HTMLButtonAttributes {
    size?: 'sm' | 'default' | 'lg'
    state?: 'default' | 'error' | 'success'
    loading?: boolean
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { ChevronDown, Loader } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getSelectContext } from './select-context'

  let {
    class: className,
    size = 'default',
    state = 'default',
    loading = false,
    children,
    ref = $bindable(null),
    disabled,
    ...restProps
  }: SelectTriggerProps = $props()

  const ctx = getSelectContext('SelectTrigger')
  const isDisabled = $derived(disabled || loading || ctx.disabled)

  const sizeClasses = {
    sm: 'h-8 text-sm px-2.5 py-1.5',
    default: 'h-9 text-sm px-3 py-2',
    lg: 'h-11 text-base px-4 py-2.5',
  }

  const stateClasses = {
    default: 'border-input dark:hover:bg-input/50',
    error:
      'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    success: 'border-success focus-visible:border-success',
  }

  $effect(() => {
    ctx.registerTrigger(ref)
    return () => ctx.registerTrigger(null)
  })

  function onClick() {
    if (isDisabled) return
    ctx.setOpen(!ctx.open)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (isDisabled) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      ctx.setOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      ctx.setOpen(true)
      ctx.highlightLast()
    } else if (e.key === 'Escape' && ctx.open) {
      e.preventDefault()
      ctx.setOpen(false)
    }
  }
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge
  data-slot="select-trigger"
  data-size={size}
  data-state-value={state}
  data-state={ctx.open ? 'open' : 'closed'}
  aria-haspopup="listbox"
  aria-expanded={ctx.open}
  aria-controls={ctx.contentId}
  aria-busy={loading}
  id={ctx.triggerId}
  disabled={isDisabled}
  class={cn(
    'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[size],
    stateClasses[state],
    className,
  )}
  onclick={onClick}
  onkeydown={onKeyDown}
  {...restProps}
>
  {@render children?.()}
  {#if !loading}
    <ChevronDown class="size-4 opacity-50" aria-hidden="true" />
  {:else}
    <Loader class="size-4 animate-spin opacity-50" aria-hidden="true" />
  {/if}
</button>
