<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { RadioGroupContext } from './RadioGroup.svelte'

  export interface RadioGroupItemProps extends HTMLButtonAttributes {
    value: any
    /** Size of the radio item */
    size?: 'sm' | 'md' | 'lg'
    /** Custom color for the checked state */
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
    /** Label text displayed next to the radio item */
    label?: string
    /** Hint text shown below the radio item */
    hint?: string
    /** Error message to display */
    errorMessages?: string | string[]
    /** Whether to show error state */
    error?: boolean
    /** Density of the radio item */
    density?: 'compact' | 'default' | 'comfortable'
    /** Label position - before or after the radio */
    labelPosition?: 'before' | 'after'
    /** Loading state */
    loading?: boolean
    /** Hide the indicator icon */
    hideIcon?: boolean
    /** Custom indicator markup. Defaults to a filled circle. */
    children?: Snippet
    ref?: HTMLButtonElement | null
  }

  // Re-exported for consumers that build custom items against the group context.
  export type { RadioGroupContext }
</script>

<script lang="ts">
  import { getContext, untrack } from 'svelte'
  import { Circle } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    value,
    id = undefined,
    disabled = undefined,
    size = 'md',
    color = 'primary',
    label = undefined,
    hint = undefined,
    errorMessages = undefined,
    error = false,
    density = 'default',
    labelPosition = 'after',
    loading = false,
    hideIcon = false,
    children,
    onclick: onclickProp,
    ref = $bindable(null),
    ...restProps
  }: RadioGroupItemProps = $props()

  const group = getContext<RadioGroupContext | undefined>('radioGroup')

  let el: HTMLButtonElement | null = null

  $effect(() => {
    ref = el
  })

  const effectiveDisabled = $derived(Boolean(loading) || Boolean(disabled ?? group?.disabled ?? false))
  const checked = $derived(group?.current === value)
  const tabbable = $derived(group ? group.tabbableValue === value : true)

  $effect(() => {
    if (!el || !group) return
    const node = el
    // Track value + disabled so re-registration follows prop updates.
    const v = value
    const d = effectiveDisabled
    // untrack: the register write must not subscribe this effect to the
    // group's `registered` state, or the write re-triggers the effect
    // (effect_update_depth_exceeded). Registration itself is idempotent.
    untrack(() => group.register(v, d, node))
    return () => group.unregister(node)
  })

  // Size classes
  const sizeClasses = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
  }

  const indicatorSizes = {
    sm: 'size-1.5',
    md: 'size-2',
    lg: 'size-2.5',
  }

  // Color classes
  const colorClasses: Record<string, string> = {
    primary: 'data-[state=checked]:border-primary',
    secondary: 'data-[state=checked]:border-secondary',
    success: 'data-[state=checked]:border-success data-[state=checked]:text-success',
    warning: 'data-[state=checked]:border-warning data-[state=checked]:text-warning',
    error: 'data-[state=checked]:border-destructive data-[state=checked]:text-destructive',
    info: 'data-[state=checked]:border-info data-[state=checked]:text-info',
  }

  // Density classes
  const densityClasses = {
    compact: 'gap-1',
    default: 'gap-2',
    comfortable: 'gap-3',
  }

  const hasError = $derived.by(() => {
    if (error) return true
    if (errorMessages && (typeof errorMessages === 'string' ? errorMessages : errorMessages.length > 0)) return true
    return false
  })
</script>

<div class={cn('flex flex-col', densityClasses[density])}>
  <div class="flex items-center">
    {#if label && labelPosition === 'before'}
      <label
        for={id}
        class={cn(
          'mr-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          hasError && 'text-destructive',
          effectiveDisabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {label}
      </label>
    {/if}

    <!-- aria-invalid mirrors the Vue twin's error state (svelte's role table omits radio). -->
    <!-- svelte-ignore a11y_role_supports_aria_props -->
    <button
      bind:this={el}
      type="button"
      role="radio"
      {id}
      data-uipkge=""
      data-slot="radio-group-item"
      data-value={typeof value === 'string' ? value : undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={effectiveDisabled || undefined}
      aria-checked={checked}
      aria-busy={loading || undefined}
      aria-invalid={hasError || undefined}
      disabled={effectiveDisabled}
      tabindex={tabbable ? 0 : -1}
      class={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square shrink-0 rounded-full border shadow-sm transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        colorClasses[color] || colorClasses.primary,
        hasError && 'border-destructive',
        loading && 'opacity-50',
        className,
      )}
      {...restProps}
      onclick={(e) => {
        if (!effectiveDisabled) group?.select(value)
        onclickProp?.(e)
      }}
    >
      <span data-uipkge="" data-slot="radio-group-indicator" class="relative flex items-center justify-center">
        {#if children}
          {@render children()}
        {:else if !hideIcon}
          <Circle
            class={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current text-current',
              indicatorSizes[size],
            )}
          />
        {/if}
      </span>
    </button>

    {#if label && labelPosition === 'after'}
      <label
        for={id}
        class={cn(
          'ml-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          hasError && 'text-destructive',
          effectiveDisabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {label}
      </label>
    {/if}
  </div>

  {#if hint && !hasError}
    <p class="text-muted-foreground ml-6 text-xs">
      {hint}
    </p>
  {/if}

  {#if hasError}
    <div class="ml-6 flex flex-col gap-0.5">
      {#if typeof errorMessages === 'string'}
        <p class="text-destructive text-xs">
          {errorMessages}
        </p>
      {:else}
        {#each errorMessages ?? [] as msg, i (i)}
          <p class="text-destructive text-xs">
            {msg}
          </p>
        {/each}
      {/if}
    </div>
  {/if}
</div>
