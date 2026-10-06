<script lang="ts" module>
  import type { Component, Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  export interface InputProps extends Omit<HTMLInputAttributes, 'size' | 'prefix'> {
    /** Uncontrolled initial value. Ignored once `value` is bound. */
    defaultValue?: string | number
    /** Two-way bound value (`bind:value`). Falls back to internal state seeded from `defaultValue`. */
    value?: string | number
    size?: 'small' | 'middle' | 'large'
    variant?: 'outlined' | 'filled' | 'borderless'
    status?: 'error' | 'warning'
    prefix?: string
    suffix?: string
    /**
     * Convenience props for the very common "icon at the start/end" case.
     * Pass a `@lucide/svelte` (or any) component: `prefixIcon={Mail}`.
     * If both `prefix` (string) and `prefixIcon` are set, the icon wins.
     */
    prefixIcon?: Component
    suffixIcon?: Component
    addonBefore?: string
    addonAfter?: string
    allowClear?: boolean
    showCount?: boolean
    showPasswordToggle?: boolean
    /** Custom content rendered in the prefix / suffix / addon slots. Wins over the string + icon props. */
    prefixSnippet?: Snippet
    suffixSnippet?: Snippet
    addonBeforeSnippet?: Snippet
    addonAfterSnippet?: Snippet
    /** React-parity alias for `maxlength`. */
    maxLength?: number
    /** React-parity alias for `autocomplete`. */
    autoComplete?: string
    /** Fires with the new value whenever the user types or clears. */
    onValueChange?: (value: string) => void
    /** The native `<input>`, via `bind:ref`. */
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { Eye, EyeOff, X } from '@lucide/svelte'

  let {
    class: className,
    defaultValue = '',
    value = $bindable<string | number | undefined>(undefined),
    size = 'middle',
    variant = 'outlined',
    status,
    prefix,
    suffix,
    prefixIcon,
    suffixIcon,
    addonBefore,
    addonAfter,
    allowClear = false,
    showCount = false,
    showPasswordToggle = false,
    disabled = false,
    readonly = false,
    maxlength,
    maxLength,
    minlength,
    autocomplete,
    autoComplete,
    type = 'text',
    placeholder,
    id,
    prefixSnippet,
    suffixSnippet,
    addonBeforeSnippet,
    addonAfterSnippet,
    onValueChange,
    ref = $bindable(null),
    ...restProps
  }: InputProps = $props()

  // svelte-ignore state_referenced_locally: defaultValue seeds uncontrolled state once by design.
  let uncontrolled = $state<string | number>(defaultValue)
  // Controlled when the parent binds `value` (including an empty string);
  // otherwise mirror the internal state seeded from `defaultValue`.
  const current = $derived(value ?? uncontrolled)

  let focused = $state(false)
  let hovered = $state(false)
  let passwordVisible = $state(false)

  const isPassword = $derived(type === 'password')
  const resolvedMaxLength = $derived(maxLength ?? maxlength)
  const resolvedAutoComplete = $derived(autoComplete ?? autocomplete)
  const hasPrefix = $derived(!!prefix || !!prefixIcon || !!prefixSnippet)
  const hasSuffix = $derived(!!suffix || !!suffixIcon || !!suffixSnippet)
  const hasAddonBefore = $derived(!!addonBefore || !!addonBeforeSnippet)
  const hasAddonAfter = $derived(!!addonAfter || !!addonAfterSnippet)

  const hasRightConfig = $derived.by(() => {
    const hasCount = showCount && resolvedMaxLength != null
    const hasPasswordToggle = showPasswordToggle && isPassword
    return allowClear || hasPasswordToggle || !!hasCount
  })

  const hasRight = $derived(hasSuffix || hasRightConfig)
  const currentLength = $derived(String(current ?? '').length)

  const showClear = $derived(
    allowClear && !!current && (focused || hovered) && !disabled && !readonly,
  )
  const showPasswordToggleBtn = $derived(isPassword && showPasswordToggle && !disabled && !readonly)
  const showCountDisplay = $derived(showCount && maxlength != null)
  const computedType = $derived(!isPassword ? type : passwordVisible ? 'text' : 'password')

  const sizeClasses = {
    small: 'h-8 text-xs',
    middle: 'h-9 text-base md:text-sm',
    large: 'h-11 text-base',
  }

  const wrapperRounded = $derived.by(() => {
    if (hasAddonBefore && hasAddonAfter) return 'rounded-none'
    if (hasAddonBefore) return 'rounded-l-none rounded-r-md'
    if (hasAddonAfter) return 'rounded-r-none rounded-l-md'
    return 'rounded-md'
  })

  const resolvedAriaInvalid = $derived.by(() => {
    if (status === 'error') return true as const
    const raw = restProps['aria-invalid'] as boolean | 'true' | 'false' | 'grammar' | 'spelling' | '' | undefined
    if (raw === true || raw === 'true' || raw === '' || raw === 'grammar' || raw === 'spelling') {
      return raw === '' ? true : raw
    }
    if (raw === false || raw === 'false') return false as const
    return undefined
  })

  const wrapperClasses = $derived.by(() => {
    const base = 'flex w-full items-center gap-1.5 overflow-hidden border transition-[color,box-shadow] outline-none'
    const sizeClass = sizeClasses[size]

    const variantMap = {
      outlined: 'border-input bg-transparent shadow-xs',
      filled: 'border-transparent bg-muted/50 shadow-none',
      borderless: 'border-transparent bg-transparent shadow-none',
    }
    const variantClass = variantMap[variant]

    const statusMap = {
      error:
        'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
      warning: 'border-warning focus-within:border-warning focus-within:ring-warning/20',
    }
    const statusClass = status ? statusMap[status] : ''
    const focusClass = !status ? 'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]' : ''
    const disabledClass = disabled ? 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30' : ''
    const ariaInvalidClass =
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'

    return cn(
      base,
      sizeClass,
      variantClass,
      statusClass,
      focusClass,
      disabledClass,
      ariaInvalidClass,
      wrapperRounded,
      className,
    )
  })

  function addonClasses(position: 'before' | 'after') {
    const roundedClass =
      position === 'before' ? 'rounded-l-md rounded-r-none border-r-0' : 'rounded-r-md rounded-l-none border-l-0'
    return cn(
      'flex items-center bg-muted px-3 text-sm text-muted-foreground border border-input',
      roundedClass,
      sizeClasses[size],
    )
  }

  const inputPadding = $derived.by(() => {
    const leftPad = size === 'small' ? 'pl-2' : size === 'large' ? 'pl-3' : 'pl-2.5'
    const rightPad = size === 'small' ? 'pr-2' : size === 'large' ? 'pr-3' : 'pr-2.5'

    if (!hasPrefix && !hasRight) return cn(leftPad, rightPad)
    if (hasPrefix && !hasRight) return cn('pl-0', rightPad)
    if (!hasPrefix && hasRight) return cn(leftPad, 'pr-0')
    return 'px-0'
  })

  function setValue(next: string) {
    value = next
    uncontrolled = next
    onValueChange?.(next)
  }

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    setValue(e.currentTarget.value)
  }

  function handleClear() {
    setValue('')
    ref?.focus()
  }

  function togglePassword() {
    passwordVisible = !passwordVisible
    ref?.focus()
  }
</script>

<div class="flex w-full">
  <!-- Addon before -->
  {#if hasAddonBefore}
    <div class={addonClasses('before')}>
      {#if addonBeforeSnippet}
        {@render addonBeforeSnippet()}
      {:else}
        {addonBefore}
      {/if}
    </div>
  {/if}

  <!-- Input wrapper -->
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions: wrapper click only forwards focus to the native input -->
  <div
    class={wrapperClasses}
    data-uipkge=""
    data-slot="input"
    aria-invalid={resolvedAriaInvalid}
    onmouseenter={() => (hovered = true)}
    onmouseleave={() => (hovered = false)}
    onclick={() => ref?.focus()}
  >
    <!-- Prefix -->
    {#if hasPrefix}
      <span
        class="text-muted-foreground pointer-events-none shrink-0 select-none {size === 'small'
          ? 'pl-2'
          : size === 'large'
            ? 'pl-3'
            : 'pl-2.5'}"
      >
        {#if prefixSnippet}
          {@render prefixSnippet()}
        {:else if prefixIcon}
          {@const PrefixIcon = prefixIcon}
          <PrefixIcon class="size-4" aria-hidden="true" />
        {:else}
          {prefix}
        {/if}
      </span>
    {/if}

    <!-- Native input -->
    <input
      {id}
      bind:this={ref}
      value={current}
      {...restProps}
      type={computedType}
      {disabled}
      {readonly}
      maxlength={resolvedMaxLength}
      autocomplete={resolvedAutoComplete as any}
      {minlength}
      {placeholder}
      aria-invalid={resolvedAriaInvalid}
      class={cn(
        'w-full min-w-0 flex-1 bg-transparent outline-none',
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:cursor-not-allowed',
        inputPadding,
      )}
      oninput={handleInput}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
    />

    <!-- Suffix / Actions -- only render when there is something on the
         right; otherwise an empty padded flex child steals horizontal
         space from plain inputs. Built-in actions (clear / password
         toggle / count) render first, then the user's suffix so the
         slotted content is always the rightmost element in the row. -->
    {#if hasRight}
      <div
        class="flex shrink-0 items-center gap-1 {size === 'small' ? 'pr-2' : size === 'large' ? 'pr-3' : 'pr-2.5'}"
      >
        {#if showClear}
          <button
            type="button"
            aria-label="Clear input"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
            onmousedown={(e) => e.preventDefault()}
            onclick={handleClear}
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        {/if}

        {#if showPasswordToggleBtn}
          <button
            type="button"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={passwordVisible}
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
            onmousedown={(e) => e.preventDefault()}
            onclick={togglePassword}
          >
            {#if passwordVisible}
              <EyeOff class="size-4" aria-hidden="true" />
            {:else}
              <Eye class="size-4" aria-hidden="true" />
            {/if}
          </button>
        {/if}

        {#if showCountDisplay}
          <span class="text-muted-foreground pointer-events-none text-xs select-none">
            {currentLength}/{resolvedMaxLength}
          </span>
        {/if}

        {#if hasSuffix}
          <span class="text-muted-foreground pointer-events-none select-none">
            {#if suffixSnippet}
              {@render suffixSnippet()}
            {:else if suffixIcon}
              {@const SuffixIcon = suffixIcon}
              <SuffixIcon class="size-4" aria-hidden="true" />
            {:else}
              {suffix}
            {/if}
          </span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Addon after -->
  {#if hasAddonAfter}
    <div class={addonClasses('after')}>
      {#if addonAfterSnippet}
        {@render addonAfterSnippet()}
      {:else}
        {addonAfter}
      {/if}
    </div>
  {/if}
</div>
