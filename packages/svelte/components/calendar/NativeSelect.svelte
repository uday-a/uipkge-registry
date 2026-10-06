<script lang="ts" module>
  import type { HTMLSelectAttributes } from 'svelte/elements'

  export interface NativeSelectProps extends Omit<HTMLSelectAttributes, 'onchange'> {
    value?: string | number | string[]
    label?: string
    placeholder?: string
    readonly?: boolean
    error?: boolean
    errorMessages?: string | string[]
    successMessages?: string | string[]
    hint?: string
    variant?: 'outlined' | 'filled' | 'solo' | 'underlined'
    density?: 'compact' | 'default' | 'comfortable'
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
    hideDetails?: boolean
    bgColor?: string
    onchange?: (value: string | number | string[] | undefined) => void
    ref?: HTMLSelectElement | null
  }
</script>

<script lang="ts">
  import { ChevronDown } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  const uid = $props.id()

  let {
    class: className,
    value = $bindable<string | number | string[] | undefined>(undefined),
    label = '',
    placeholder = '',
    disabled = false,
    readonly = false,
    error = false,
    errorMessages = [],
    successMessages = [],
    hint = '',
    variant = 'outlined',
    density = 'default',
    color: _color = 'primary',
    hideDetails = false,
    bgColor,
    onchange,
    children,
    ref = $bindable(null),
    ...restProps
  }: NativeSelectProps = $props()

  const hasError = $derived(error || (Array.isArray(errorMessages) ? errorMessages.length > 0 : !!errorMessages))
  const hasSuccess = $derived(
    !hasError && (Array.isArray(successMessages) ? successMessages.length > 0 : !!successMessages),
  )

  const densityClasses = {
    compact: 'h-8 text-xs',
    default: 'h-9 text-sm',
    comfortable: 'h-10 text-base',
  }

  const variantClasses = {
    outlined: 'border bg-transparent',
    filled: 'border-b-2 bg-muted/30 border-transparent',
    solo: 'border bg-card shadow-md',
    underlined: 'border-b bg-transparent rounded-none border-x-0 border-t-0',
  }

  const stateClasses = $derived.by(() => {
    if (hasError) return 'border-destructive focus-visible:ring-destructive/20'
    if (hasSuccess) return 'border-success focus-visible:border-success'
    return 'border-input focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]'
  })
</script>

<div class={cn('relative w-full', densityClasses[density])}>
  <!-- Label -->
  {#if label}
    <label for={uid} class={cn('mb-1 block text-sm font-medium', hasError && 'text-destructive')}>
      {label}
    </label>
  {/if}

  <!-- Select Wrapper -->
  <div class={cn('group/native-select relative w-full', className)}>
    <!-- `readonly` is accepted for API parity but not rendered: it is invalid on
         <select> and browsers ignore it (same effective behavior as the Vue twin). -->
    <select
      bind:this={ref}
      bind:value
      id={uid}
      data-uipkge
      data-slot="native-select"
      disabled={disabled}
      aria-label={label || placeholder || undefined}
      class={cn(
        'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50',
        variantClasses[variant],
        stateClasses,
        densityClasses[density],
        'w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 pr-9 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        bgColor,
      )}
      onchange={() => onchange?.(value)}
      {...restProps}
    >
      {@render children?.()}
    </select>
    <ChevronDown
      class="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
      aria-hidden="true"
      data-uipkge
      data-slot="native-select-icon"
    />
  </div>

  <!-- Details: hint, error, success -->
  {#if !hideDetails}
    <div
      class={cn('mt-1 text-xs', {
        'text-destructive': hasError,
        'text-success': hasSuccess,
        'text-muted-foreground': !hasError && !hasSuccess,
      })}
    >
      {#if hasError}
        {#if typeof errorMessages === 'string'}
          <span>{errorMessages}</span>
        {:else}
          <span>{errorMessages[0]}</span>
        {/if}
      {:else if hasSuccess}
        {#if typeof successMessages === 'string'}
          <span>{successMessages}</span>
        {:else}
          <span>{successMessages[0]}</span>
        {/if}
      {:else}
        {hint}
      {/if}
    </div>
  {/if}
</div>
