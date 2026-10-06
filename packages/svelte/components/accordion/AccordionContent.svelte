<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getAccordionItem, getAccordionRoot } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: AccordionContentProps = $props()

  const root = getAccordionRoot()
  const item = getAccordionItem()

  const open = $derived(item?.open ?? true)
  const orientation = $derived(root?.orientation ?? 'vertical')
</script>

<div
  bind:this={ref}
  role="region"
  id={item?.contentId}
  aria-labelledby={item?.triggerId}
  data-uipkge=""
  data-slot="accordion-content"
  data-state={open ? 'open' : 'closed'}
  data-orientation={orientation}
  hidden={!open}
  class={cn(
    'text-muted-foreground overflow-hidden text-sm',
    // Height via CSS vars + tw-animate-css (not height:auto).
    // duration/ease set --tw-duration/--tw-ease consumed by the utility.
    'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    'duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
    'motion-reduce:animate-none',
    className,
  )}
  {...restProps}
>
  <div class="pt-0 pb-4">
    {@render children?.()}
  </div>
</div>
