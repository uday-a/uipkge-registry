<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements'

  export type CheckboxChecked = boolean | 'indeterminate'

  export interface CheckboxProps extends Omit<HTMLButtonAttributes, 'value' | 'children'> {
    /** The controlled checked state. Bindable (`bind:checked`); falls back to internal state when unbound. */
    checked?: CheckboxChecked | null
    /** The value given as data when submitted with a name. Inside a group, drives membership. */
    value?: string
    /** Id of the element. Auto-generated when `label` is set without an explicit `id`. */
    id?: string
    /** Size of the checkbox. */
    size?: 'sm' | 'md' | 'lg'
    /** Custom color for the checked state — matches the Vuetify color system. */
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
    /** Label text displayed next to the checkbox. */
    label?: string
    /** Hint text shown below the checkbox. */
    hint?: string
    /** Error message(s) to display. */
    errorMessages?: string | string[]
    /** Whether to show error state. */
    error?: boolean
    /** When `true`, the checkbox is in readonly state (focusable but not toggleable). */
    readonly?: boolean
    /** When `true`, shows an indeterminate state. */
    indeterminate?: boolean
    /** Density of the checkbox — affects spacing. */
    density?: 'compact' | 'default' | 'comfortable'
    /** When `true`, the icon is hidden. */
    hideIcon?: boolean
    /** Loading state — shows a spinner. */
    loading?: boolean
    /** Ripple effect on click (accepted for API parity; no visual effect). */
    ripple?: boolean
    /** Custom icon to show when checked. */
    checkedIcon?: Snippet
    /** Custom icon to show when indeterminate. */
    indeterminateIcon?: Snippet
    /** Label position — before or after the checkbox. */
    labelPosition?: 'before' | 'after'
    /** Whether the checkbox appears flat (no elevation). */
    flat?: boolean
    /** Inline text style. */
    inline?: boolean
    /** Name attribute for form submission. */
    name?: string
    /** The rendered control, via `bind:ref`. */
    ref?: HTMLButtonElement | null
    /** Custom indicator content. Receives `{ checked }`. */
    children?: Snippet<[{ checked: CheckboxChecked }]>
    /** Fires when the checked state changes (click or keyboard toggle). */
    onCheckedChange?: (value: CheckboxChecked) => void
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { Check, Loader2, Minus } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import type { CheckboxGroupContext } from './CheckboxGroup.svelte'

  let {
    class: className,
    checked = $bindable(false),
    value,
    id,
    size = 'md',
    color = 'primary',
    label,
    hint,
    errorMessages,
    error = false,
    disabled = false,
    readonly = false,
    indeterminate = false,
    density = 'default',
    hideIcon = false,
    loading = false,
    ripple: _ripple = true,
    checkedIcon,
    indeterminateIcon,
    labelPosition = 'after',
    flat = false,
    inline = false,
    name,
    ref = $bindable(null),
    children,
    onCheckedChange,
    onclick: onclickProp,
    ...restProps
  }: CheckboxProps = $props()

  // `_ripple` is destructured aside (accepted for API parity with the Vue twin)
  // so it never leaks into `...restProps` and onto the DOM.
  const group = getContext<CheckboxGroupContext | null>('checkboxGroupContext') ?? null
  const inGroup = $derived(group !== null && value !== undefined)
  const actualName = $derived(name ?? group?.name)

  // Stable auto id for the `<label for>` association (no reactive useId in
  // Svelte — a module counter is enough for uniqueness within a page).
  let autoIdCounter = 0
  const autoId = `checkbox-${++autoIdCounter}-${Math.random().toString(36).slice(2, 7)}`
  const resolvedId = $derived(id ?? (label ? autoId : undefined))

  const sizeClasses = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
  } as const

  const iconSizes = {
    sm: 'size-2.5',
    md: 'size-3.5',
    lg: 'size-4',
  } as const

  const colorClasses: Record<string, string> = {
    primary:
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
    secondary:
      'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary',
    success:
      'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success',
    warning:
      'data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning',
    error:
      'data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:border-destructive',
    info: 'data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info',
  }

  const densityClasses = {
    compact: 'gap-1',
    default: 'gap-2',
    comfortable: 'gap-3',
  } as const

  const hasError = $derived(
    Boolean(error || (typeof errorMessages === 'string' ? errorMessages : (errorMessages?.length ?? 0) > 0)),
  )

  const groupChecked = $derived(inGroup ? group!.isSelected(value!) : null)
  const isIndeterminate = $derived(indeterminate || checked === 'indeterminate')
  const dataState = $derived<'checked' | 'unchecked' | 'indeterminate'>(
    isIndeterminate ? 'indeterminate' : (groupChecked ?? checked ?? false) ? 'checked' : 'unchecked',
  )
  const ariaChecked = $derived(dataState === 'indeterminate' ? 'mixed' : dataState === 'checked')

  const checkboxClasses = $derived(
    cn(
      'peer border-input data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      colorClasses[color] || colorClasses.primary,
      hasError &&
        'border-destructive data-[state=checked]:!bg-destructive data-[state=checked]:!border-destructive data-[state=indeterminate]:!bg-destructive data-[state=indeterminate]:!border-destructive',
      flat && 'shadow-none',
      className,
    ),
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    toggle()
    onclickProp?.(event)
  }

  function toggle() {
    if (disabled || group?.disabled || readonly || loading) return
    if (inGroup) {
      group!.toggle(value!)
      onCheckedChange?.(group!.isSelected(value!) ? true : false)
      return
    }
    const next: CheckboxChecked = dataState === 'checked' ? false : true
    checked = next
    onCheckedChange?.(next)
  }
</script>

<div class={cn('flex items-start', densityClasses[density], inline ? 'inline-flex' : 'flex-col')}>
  {#if label && labelPosition === 'before'}
    <label
      for={resolvedId}
      class={cn(
        'mr-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        hasError ? 'text-destructive' : '',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {label}
    </label>
  {/if}

  <div class="flex items-center">
    <button
      bind:this={ref}
      type="button"
      role="checkbox"
      data-uipkge
      data-slot="checkbox"
      id={resolvedId}
      aria-checked={ariaChecked}
      aria-invalid={hasError || undefined}
      data-state={dataState}
      {value}
      disabled={disabled || group?.disabled}
      class={checkboxClasses}
      onclick={handleClick}
      {...restProps}
    >
      <span data-slot="checkbox-indicator" class="grid place-content-center text-current transition-none">
        {#if children}
          {@render children({
            checked: dataState === 'checked' ? true : dataState === 'indeterminate' ? 'indeterminate' : false,
          })}
        {:else if loading}
          <Loader2 class={cn(iconSizes[size], 'animate-spin')} />
        {:else if isIndeterminate}
          {#if indeterminateIcon}
            {@render indeterminateIcon()}
          {:else}
            <Minus class={cn(iconSizes[size], 'checkbox-indicator-icon')} />
          {/if}
        {:else if !hideIcon && dataState === 'checked'}
          {#if checkedIcon}
            {@render checkedIcon()}
          {:else}
            <Check class={cn(iconSizes[size], 'checkbox-indicator-icon')} />
          {/if}
        {/if}
      </span>
    </button>
    {#if actualName}
      <input
        type="checkbox"
        hidden
        tabindex="-1"
        aria-hidden="true"
        name={actualName}
        value={value ?? 'on'}
        checked={dataState === 'checked'}
      />
    {/if}

    {#if label && labelPosition === 'after'}
      <label
        for={resolvedId}
        class={cn(
          'ml-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          hasError ? 'text-destructive' : '',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {label}
      </label>
    {/if}
  </div>

  {#if hint && !hasError}
    <p class="text-muted-foreground mt-1 text-xs">
      {hint}
    </p>
  {/if}

  {#if hasError}
    <div class="mt-1 flex flex-col gap-0.5">
      {#if typeof errorMessages === 'string'}
        <p class="text-destructive text-xs">{errorMessages}</p>
      {:else}
        {#each errorMessages ?? [] as msg (msg)}
          <p class="text-destructive text-xs">{msg}</p>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Subtle scale-in when the check / indeterminate mark mounts. */
  @keyframes checkbox-check-in {
    0% {
      opacity: 0;
      transform: scale(0.55);
    }
    70% {
      opacity: 1;
      transform: scale(1.08);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  :global([data-slot='checkbox-indicator']) .checkbox-indicator-icon {
    animation: checkbox-check-in 200ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    :global([data-slot='checkbox-indicator']) .checkbox-indicator-icon {
      animation: none !important;
    }
  }
</style>
