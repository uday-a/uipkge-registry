<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { accordionItemVariants } from './accordion.variants'
  import { ACCORDION_ITEM_KEY, getAccordionRoot, type AccordionItemContext } from './context'

  let { value, disabled = false, class: className, children, ref = $bindable(null), ...restProps }: AccordionItemProps =
    $props()

  const root = getAccordionRoot()

  const open = $derived(root?.isOpen(value) ?? true)
  const variant = $derived(root?.variant ?? 'default')
  const orientation = $derived(root?.orientation ?? 'vertical')
  const isDisabled = $derived(disabled || (root?.disabled ?? false))

  const itemId = $props.id()
  const triggerId = `${itemId}-trigger`
  const contentId = `${itemId}-content`

  setContext<AccordionItemContext>(ACCORDION_ITEM_KEY, {
    get value() {
      return value
    },
    get triggerId() {
      return triggerId
    },
    get contentId() {
      return contentId
    },
    get open() {
      return open
    },
    get disabled() {
      return isDisabled
    },
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="accordion-item"
  data-state={open ? 'open' : 'closed'}
  data-disabled={isDisabled ? '' : undefined}
  data-orientation={orientation}
  class={cn(accordionItemVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</div>
