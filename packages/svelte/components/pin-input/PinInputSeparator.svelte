<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PinInputSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Minus } from '@lucide/svelte'

  let { class: className, children, ref = $bindable(null), ...restProps }: PinInputSeparatorProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="pin-input-separator" role="separator" class={className} {...restProps}>
  {#if children}
    {@render children()}
  {:else}
    <Minus aria-hidden="true" />
  {/if}
</div>
