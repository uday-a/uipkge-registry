<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuRadioGroupProps extends HTMLAttributes<HTMLDivElement> {
    value?: string
    onValueChange?: (value: string) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContextMenuRadioContext } from './context'

  let {
    class: className,
    value = $bindable(''),
    onValueChange,
    children,
    ref = $bindable(null),
    ...restProps
  }: ContextMenuRadioGroupProps = $props()

  setContextMenuRadioContext({
    get value() {
      return value
    },
    setValue(v) {
      value = v
      onValueChange?.(v)
    },
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-radio-group"
  role="group"
  class={className}
  {...restProps}
>
  {@render children?.()}
</div>
