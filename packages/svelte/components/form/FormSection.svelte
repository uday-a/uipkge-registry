<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
    title?: string
    subtitle?: string
    description?: string
    divider?: boolean
    headingLevel?: 'h2' | 'h3' | 'h4' | 'h5'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    title,
    subtitle,
    description,
    divider = false,
    headingLevel = 'h4',
    children,
    ref = $bindable(null),
    ...restProps
  }: FormSectionProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="form-section" class={cn('space-y-3', className)} {...restProps}>
  {#if divider || title || subtitle}
    <div class={divider ? 'border-t pt-4' : undefined}>
      {#if title || subtitle}
        <div class="space-y-1">
          {#if title}
            <svelte:element this={headingLevel} class="text-sm font-semibold">{title}</svelte:element>
          {/if}
          {#if subtitle}
            <p class="text-muted-foreground text-xs">{subtitle}</p>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
  {#if description}
    <p class="text-muted-foreground text-xs">{description}</p>
  {/if}
  {@render children?.()}
</div>
