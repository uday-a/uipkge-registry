<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { InputProps } from '$lib/components/ui/input'

  // Extends InputProps (not raw HTML attrs): the rest-spread below must match
  // Input exactly — Input redefines `size`/`prefix`, so raw attrs are not assignable.
  export interface SidebarInputProps extends InputProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarInputProps = $props()
</script>

<!-- Sidebar-tuned wrapper over the kit's <Input> with sidebar height + bg defaults. -->
<Input
  data-uipkge=""
  data-slot="sidebar-input"
  data-sidebar="input"
  bind:ref
  class={cn('bg-background h-8 w-full shadow-none', className)}
  {...restProps}
>
  {@render children?.()}
</Input>
