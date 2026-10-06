<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface MenubarRadioGroupProps {
    value?: string
    defaultValue?: string
    children?: Snippet
  }
</script>

<script lang="ts">
  import { setMenubarRadioContext } from './MenubarContext'

  let { value = $bindable(), defaultValue, children }: MenubarRadioGroupProps = $props()

  let seeded = false
  $effect.pre(() => {
    if (!seeded && value === undefined && defaultValue !== undefined) value = defaultValue
    seeded = true
  })

  setMenubarRadioContext({
    getValue: () => value,
    setValue: (v) => {
      value = v
    },
  })
</script>

<div role="group" data-uipkge="" data-slot="menubar-radio-group">
  {@render children?.()}
</div>
