<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface LabeledValueProps extends HTMLAttributes<HTMLDivElement> {
    label: string
    value?: string
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, label, value, children, ...restProps }: LabeledValueProps = $props()
</script>

<div
  data-uipkge=""
  data-slot="labeled-value"
  class={cn('flex items-center justify-between gap-3 text-sm', className)}
  {...restProps}
>
  <span data-slot="labeled-value-label" class="text-muted-foreground shrink-0">{label}</span>
  {#if children}
    {@render children()}
  {:else}
    <span data-slot="labeled-value-value" class="min-w-0 text-right font-medium">{value}</span>
  {/if}
</div>
