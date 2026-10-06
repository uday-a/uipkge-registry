<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled selected value. Use `bind:value` for two-way binding. */
    value?: string
    /** Called with the next value. Selecting keeps the menu open. */
    onValueChange?: (value: string) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setRadioContext } from './dropdown-menu-context'

  let {
    value = $bindable(''),
    onValueChange,
    children,
    ref = $bindable(null),
    ...restProps
  }: DropdownMenuRadioGroupProps = $props()

  setRadioContext({
    getValue: () => value,
    setValue: (next: string) => {
      if (value === next) return
      value = next
      onValueChange?.(next)
    },
  })
</script>

<div bind:this={ref} role="group" data-uipkge data-slot="dropdown-menu-radio-group" {...restProps}>
  {@render children?.()}
</div>
