<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { StepperStatus } from './context'
  import type { IconComponent } from './types'

  export interface StepperStepProps extends HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    icon?: IconComponent
    completed?: boolean
    active?: boolean
    error?: boolean
    disabled?: boolean
    status?: StepperStatus
    index?: number
    /** Render overrides for the indicator icon, title, and description. */
    iconSnippet?: Snippet
    titleSnippet?: Snippet
    descriptionSnippet?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Check } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { stepperIndicatorVariants } from './stepper.variants'

  let {
    class: className,
    title,
    description,
    icon,
    completed = false,
    active = false,
    error = false,
    disabled = false,
    status,
    index,
    iconSnippet,
    titleSnippet,
    descriptionSnippet,
    children,
    ref = $bindable(null),
    ...restProps
  }: StepperStepProps = $props()

  const computedStatus = $derived.by(() => {
    if (status) return status
    if (error) return 'error'
    if (active) return 'active'
    if (completed) return 'completed'
    return 'pending'
  })

  const Icon = $derived(icon ?? (computedStatus === 'completed' ? Check : null))
</script>

<div bind:this={ref} class={cn('stepper-step flex gap-3', className)} role="tab" aria-selected={active} aria-disabled={disabled} {...restProps}>
  <div data-slot="stepper-indicator" data-status={computedStatus} class={cn(stepperIndicatorVariants({ status: computedStatus, size: 'default' }))}>
    {#if iconSnippet}
      {@render iconSnippet()}
    {:else if Icon}
      <Icon class="size-4" data-slot="stepper-indicator-icon" aria-hidden="true" />
    {:else if index}
      <span data-slot="stepper-indicator-label">{index}</span>
    {/if}
  </div>

  <div class="flex flex-col gap-0.5 pt-1">
    {#if titleSnippet}
      {@render titleSnippet()}
    {:else}
      <span class="text-sm font-medium">{title}</span>
    {/if}
    {#if descriptionSnippet}
      {@render descriptionSnippet()}
    {:else if description}
      <span class="text-muted-foreground text-xs">{description}</span>
    {/if}
    {@render children?.()}
  </div>
</div>
