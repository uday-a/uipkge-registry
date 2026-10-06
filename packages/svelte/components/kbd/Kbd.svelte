<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KbdProps extends HTMLAttributes<HTMLElement> {
    children?: Snippet
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KbdProps = $props()
</script>

<kbd
  bind:this={ref}
  data-uipkge=""
  data-slot="kbd"
  class={cn(
    'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</kbd>
