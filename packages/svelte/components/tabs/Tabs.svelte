<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TabsOrientation } from './context'

  export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled active value. Bind with `bind:value`. */
    value?: string
    /** Initial active value for uncontrolled usage. */
    defaultValue?: string
    orientation?: TabsOrientation
    ref?: HTMLDivElement | null
    onValueChange?: (value: string) => void
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { nextTabsId, setTabsContext } from './context'

  let {
    class: className,
    defaultValue,
    value = $bindable(defaultValue),
    orientation = 'horizontal',
    children,
    ref = $bindable(null),
    onValueChange,
    ...restProps
  }: TabsProps = $props()

  const baseId = nextTabsId()

  function select(next: string) {
    value = next
    onValueChange?.(next)
  }

  setTabsContext({
    current: () => value,
    orientation: () => orientation,
    select,
    triggerId: (v: string) => `${baseId}-trigger-${v}`,
    contentId: (v: string) => `${baseId}-content-${v}`,
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="tabs"
  data-orientation={orientation}
  class={cn('flex w-full', orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
