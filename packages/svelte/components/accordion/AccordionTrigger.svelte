<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface AccordionTriggerProps extends HTMLButtonAttributes {
    /** Render your own trigger element with the trigger's props and styles. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements'
  import { ChevronDown } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { accordionTriggerVariants } from './accordion.variants'
  import { getAccordionItem, getAccordionRoot } from './context'

  let {
    class: className,
    child,
    children,
    ref = $bindable(null),
    disabled = false,
    onclick,
    onkeydown,
    ...restProps
  }: AccordionTriggerProps = $props()

  const root = getAccordionRoot()
  const item = getAccordionItem()

  const open = $derived(item?.open ?? true)
  const variant = $derived(root?.variant ?? 'default')
  const orientation = $derived(root?.orientation ?? 'vertical')
  const isDisabled = $derived(disabled || (item?.disabled ?? false))

  $effect(() => {
    const el = ref
    if (!el) return
    root?.registerTrigger(el)
    return () => root?.unregisterTrigger(el)
  })

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onclick?.(event)
    if (event.defaultPrevented || isDisabled || !item) return
    root?.toggle(item.value)
  }

  const handleKeydown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    onkeydown?.(event)
    if (event.defaultPrevented || !ref) return
    const vertical = orientation !== 'horizontal'
    let target: 1 | -1 | 'first' | 'last' | null = null
    if (event.key === 'Home') target = 'first'
    else if (event.key === 'End') target = 'last'
    else if (vertical && event.key === 'ArrowDown') target = 1
    else if (vertical && event.key === 'ArrowUp') target = -1
    else if (!vertical && event.key === 'ArrowRight') target = 1
    else if (!vertical && event.key === 'ArrowLeft') target = -1
    if (target !== null) {
      event.preventDefault()
      root?.focusSiblingTrigger(ref, target)
    }
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'accordion-trigger',
    'data-state': open ? ('open' as const) : ('closed' as const),
    'data-disabled': isDisabled ? '' : undefined,
    'data-orientation': orientation,
    id: item?.triggerId,
    'aria-expanded': open,
    'aria-controls': item?.contentId,
    disabled: isDisabled,
    type: 'button' as const,
    class: cn(accordionTriggerVariants({ variant }), className),
    onclick: handleClick,
    onkeydown: handleKeydown,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref} {...mergedProps}>
    {@render children?.()}
    <ChevronDown
      class="text-muted-foreground size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/accordion-trigger:rotate-180 motion-reduce:transition-none"
      aria-hidden="true"
    />
  </button>
{/if}
