<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { FormStatus } from './types'

  export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
    label?: string
    required?: boolean
    description?: string
    status?: FormStatus
    help?: string
    layout?: 'vertical' | 'horizontal'
    labelWidth?: string
    /** Extra content beside the label (replaces the Vue `label` slot). */
    labelContent?: Snippet
    ref?: HTMLDivElement | null
  }

  // Client-only counter for generated item ids. Assigned in onMount (never
  // during SSR) so server and client markup stay identical.
  let nextItemId = 0
</script>

<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { FORM_ITEM_CONTEXT_KEY } from './context'
  import FormLabel from './FormLabel.svelte'

  let {
    class: className,
    label,
    required = false,
    description,
    status,
    help,
    layout = 'vertical',
    labelWidth,
    labelContent,
    children,
    ref = $bindable(null),
    ...restProps
  }: FormItemProps = $props()

  let id = $state<string | undefined>(undefined)

  // Getter (not the raw string): children initialize before onMount assigns
  // the id, and `useFormField` resolves ids lazily through this.
  setContext(FORM_ITEM_CONTEXT_KEY, () => id)

  onMount(() => {
    if (id === undefined) {
      nextItemId += 1
      id = `form-item-${nextItemId}`
    }
  })

  const statusBorderClass = $derived.by(() => {
    switch (status) {
      case 'error':
        return '[&_input]:border-destructive [&_textarea]:border-destructive [&_button]:border-destructive'
      case 'warning':
        return '[&_input]:border-warning [&_textarea]:border-warning [&_button]:border-warning'
      case 'success':
        return '[&_input]:border-success [&_textarea]:border-success [&_button]:border-success'
      default:
        return ''
    }
  })

  const isHorizontal = $derived(layout === 'horizontal')
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="form-item"
  class={cn(
    'grid gap-1.5',
    isHorizontal && 'grid-cols-[var(--label-width,140px)_1fr] items-start gap-x-4 gap-y-0',
    className,
  )}
  style:--label-width={labelWidth}
  {...restProps}
>
  {#if label || labelContent}
    <div class="flex items-center gap-1">
      {#if label}
        <FormLabel for={`${id}-form-item`} class={status === 'error' ? 'text-destructive' : undefined}>
          {label}
        </FormLabel>
      {/if}
      {@render labelContent?.()}
      {#if required}
        <span class="text-destructive text-sm" aria-hidden="true">*</span>
      {/if}
    </div>
  {/if}

  <div class={cn('space-y-1', statusBorderClass)}>
    {@render children?.()}
    {#if description}
      <p class="text-muted-foreground text-xs">{description}</p>
    {/if}
    {#if help}
      <p
        class={cn('text-xs', {
          'text-destructive': status === 'error',
          'text-warning': status === 'warning',
          'text-success': status === 'success',
          'text-muted-foreground': !status,
        })}
        role={status === 'error' ? 'alert' : undefined}
      >
        {help}
      </p>
    {/if}
  </div>
</div>
