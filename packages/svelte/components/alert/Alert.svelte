<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive'
    icon?: 'info' | 'warning' | 'error' | 'success'
    title?: string
    text?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { alertVariants } from './alert.variants'

  let {
    class: className,
    variant = 'default',
    icon,
    title,
    text,
    children,
    ref = $bindable(null),
    ...restProps
  }: AlertProps = $props()
</script>

<div bind:this={ref} role="alert" data-uipkge="" data-slot="alert" class={cn(alertVariants({ variant }), className)} {...restProps}>
  <!--
    Icons and composition children must be direct root descendants so the
    `[&>svg]` absolute layout in alertVariants can position and pad correctly.
  -->
  {#if icon === 'error'}
    <CircleAlert class="size-4" aria-hidden="true" />
  {:else if icon === 'success'}
    <CircleCheck class="size-4" aria-hidden="true" />
  {:else if icon === 'warning'}
    <TriangleAlert class="size-4" aria-hidden="true" />
  {:else if icon === 'info'}
    <Info class="size-4" aria-hidden="true" />
  {/if}

  {#if title}
    <p data-uipkge="" data-slot="alert-title" class="mb-1 text-sm leading-none font-medium tracking-tight">
      {title}
    </p>
  {/if}
  {#if text}
    <div
      data-uipkge=""
      data-slot="alert-description"
      class="text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed"
    >
      {text}
    </div>
  {/if}
  {@render children?.()}
</div>
