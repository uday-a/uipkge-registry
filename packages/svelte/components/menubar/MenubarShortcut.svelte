<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarShortcutProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: MenubarShortcutProps = $props()
</script>

<span
  bind:this={ref}
  data-uipkge=""
  data-slot="menubar-shortcut"
  class={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
  {...restProps}
>
  {@render children?.()}
</span>
