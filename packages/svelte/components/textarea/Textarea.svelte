<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { HTMLTextareaAttributes } from 'svelte/elements'

  export interface TextareaProps {
    // Core
    value?: string | number
    defaultValue?: string | number
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    success?: string
    messages?: string[]
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autofocus?: boolean
    name?: string
    id?: string

    // Variants (Vuetify-style)
    variant?: 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain'
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
    density?: 'compact' | 'comfortable' | 'default'

    // Appearance
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle' | 'full'

    // Auto size (Ant Design API)
    autoSize?: boolean | { minRows?: number; maxRows?: number }

    // Legacy auto grow / resize
    autoGrow?: boolean
    noResize?: boolean
    autoResize?: boolean

    // Rows -- accept both number and string ("3" vs rows={3}).
    rows?: number | string
    rowHeight?: number

    // Prefix/Suffix
    prefix?: string
    suffix?: string

    // Counter (legacy)
    counter?: boolean | number

    // Show count (Ant Design API)
    showCount?: boolean | { formatter?: (count: number, maxLength?: number) => string }

    // Max length
    maxLength?: number

    // Allow clear
    allowClear?: boolean

    // Validation
    rules?: Array<(value: unknown) => true | string>
    errorMessages?: string | string[]
    successMessages?: string | string[]
    validateOn?: 'blur' | 'input' | 'submit' | 'lazy' | 'blurlazy' | 'inputlazy'

    // States
    loading?: boolean
    persistentHint?: boolean
    persistentError?: boolean
    persistentPlaceholder?: boolean
    persistentPrefix?: boolean
    persistentSuffix?: boolean

    // Misc
    class?: string
    inputClass?: string
    labelClass?: string
    hintClass?: string
    bgColor?: string
    flat?: boolean
    bordered?: boolean

    // Browser
    spellcheck?: boolean
    autocomplete?: HTMLTextareaAttributes['autocomplete']

    // Direction
    direction?: 'ltr' | 'rtl'

    // Events (Svelte callback props mirroring the Vue emits)
    onclear?: () => void
    onfocus?: (event?: FocusEvent) => void
    onblur?: (event?: FocusEvent) => void
    onkeydown?: (event: KeyboardEvent) => void
    onkeyup?: (event?: KeyboardEvent) => void

    children?: Snippet
    ref?: HTMLTextAreaElement | null
  }

  let textareaCounter = 0
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { Check, CircleAlert, LoaderCircle, X } from '@lucide/svelte'

  let {
    defaultValue = '',
    value = $bindable(defaultValue),
    label,
    placeholder,
    hint,
    error,
    success,
    disabled = false,
    readonly = false,
    required = false,
    autofocus,
    name,
    id,
    variant = 'outlined',
    density = 'default',
    rounded = 'none',
    autoSize,
    autoGrow = false,
    noResize = false,
    autoResize: autoResizeProp = false,
    rows = 3,
    rowHeight = 24,
    prefix,
    suffix,
    counter,
    showCount,
    maxLength,
    allowClear = false,
    rules,
    errorMessages,
    successMessages,
    validateOn,
    loading = false,
    persistentHint = false,
    persistentError: _persistentError = false,
    persistentPlaceholder: _persistentPlaceholder = false,
    persistentPrefix = false,
    persistentSuffix = false,
    class: className,
    inputClass,
    labelClass,
    hintClass,
    bgColor,
    flat: _flat = false,
    bordered: _bordered = true,
    spellcheck,
    autocomplete,
    direction = 'ltr',
    onclear,
    onfocus,
    onblur,
    onkeydown,
    onkeyup,
    children,
    ref = $bindable(null),
  }: TextareaProps = $props()

  // NOTE: `color` and `messages` are accepted for Vue API parity but intentionally
  // unwired — the Svelte port styles validation state through variant classes.

  const autoId = `textarea-${++textareaCounter}`
  const textareaId = $derived(id ?? autoId)
  const descriptionId = $derived(`${textareaId}-description`)

  let focused = $state(false)
  let internalErrorMessages = $state<string[]>([])
  let textareaEl: HTMLTextAreaElement | null = $state(null)

  $effect(() => {
    ref = textareaEl
  })

  // Auto size
  const autoSizeEnabled = $derived(autoSize !== undefined)
  const anyAutoResize = $derived(autoSizeEnabled || autoResizeProp || autoGrow)

  const autoSizeConfig = $derived<{ minRows?: number; maxRows?: number }>(
    typeof autoSize === 'object' ? autoSize : {},
  )

  let minHeightPx = $state(0)
  let maxHeightPx = $state(Infinity)

  function measureHeights() {
    if (!textareaEl) return
    if (!autoSizeEnabled) return
    const el = textareaEl
    const originalValue = el.value
    const originalRows = el.rows
    const originalOverflow = el.style.overflowY
    el.value = ''
    el.style.overflowY = 'hidden'
    const { minRows, maxRows } = autoSizeConfig
    if (minRows) {
      el.rows = minRows
      minHeightPx = el.scrollHeight
    } else {
      minHeightPx = 0
    }
    if (maxRows) {
      el.rows = maxRows
      maxHeightPx = el.scrollHeight
    } else {
      maxHeightPx = Infinity
    }
    el.value = originalValue
    el.rows = originalRows
    el.style.overflowY = originalOverflow
    doAutoResize()
  }

  $effect(() => {
    // Re-measure when the config object identity changes.
    void autoSizeConfig
    tick().then(() => measureHeights())
  })

  // Auto grow functionality (legacy)
  const rowsNum = $derived(Number(rows) || 3)

  const computedRows = $derived.by(() => {
    if (autoSizeEnabled || autoResizeProp) return rowsNum
    if (!autoGrow) return rowsNum
    if (!textareaEl) return rowsNum
    const lineHeight = rowHeight
    const computedHeight = textareaEl.scrollHeight
    const newRows = Math.ceil((computedHeight - lineHeight) / lineHeight) + 1
    return Math.max(rowsNum, newRows)
  })

  // Validation
  function validate() {
    if (!rules || rules.length === 0) return true
    internalErrorMessages = []
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        internalErrorMessages.push(result as string)
      }
    }
    return internalErrorMessages.length === 0
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    value = target.value
    if (anyAutoResize) {
      doAutoResize()
    }
    if (validateOn === 'input' || validateOn === 'inputlazy') {
      // nextTick so value is settled before rules run
      tick().then(() => validate())
    }
  }

  function doAutoResize() {
    if (!textareaEl) return
    if (!anyAutoResize) return
    const el = textareaEl
    el.style.height = 'auto'
    let newHeight = el.scrollHeight
    if (minHeightPx && newHeight < minHeightPx) {
      newHeight = minHeightPx
    }
    if (newHeight > maxHeightPx) {
      newHeight = maxHeightPx
      el.style.overflowY = 'auto'
    } else {
      el.style.overflowY = 'hidden'
    }
    el.style.height = `${newHeight}px`
  }

  // Handle clear
  function handleClear() {
    value = ''
    onclear?.()
    tick().then(() => {
      doAutoResize()
      textareaEl?.focus()
    })
  }

  // Handle focus/blur
  function handleFocus(event: FocusEvent) {
    focused = true
    onfocus?.(event)
  }

  function handleBlur(event: FocusEvent) {
    focused = false
    if (validateOn === 'blur' || validateOn === 'blurlazy') {
      validate()
    }
    onblur?.(event)
  }

  // Compute error/success messages
  const computedErrorMessages = $derived.by((): string[] => {
    if (errorMessages) {
      return Array.isArray(errorMessages) ? errorMessages : [errorMessages]
    }
    if (error) {
      return [error]
    }
    return internalErrorMessages
  })

  const computedSuccessMessages = $derived.by((): string[] => {
    if (successMessages) {
      return Array.isArray(successMessages) ? successMessages : [successMessages]
    }
    if (success) {
      return [success]
    }
    return []
  })

  const hasError = $derived(computedErrorMessages.length > 0)
  const hasSuccess = $derived(computedSuccessMessages.length > 0)

  // Counter (legacy)
  const computedCounter = $derived.by((): number | null => {
    if (typeof counter === 'number') return counter
    if (counter) return maxLength ?? 100
    return null
  })

  const currentLength = $derived(String(value ?? '').length)

  // Show count (Ant Design API)
  const showCountEnabled = $derived(showCount !== undefined && showCount !== false)

  const showCountConfig = $derived<{ formatter?: (count: number, maxLength?: number) => string }>(
    typeof showCount === 'object' ? showCount : {},
  )

  const countText = $derived.by(() => {
    const formatter = showCountConfig.formatter
    if (formatter) {
      return formatter(currentLength, maxLength)
    }
    if (maxLength !== undefined) {
      return `${currentLength} / ${maxLength}`
    }
    return `${currentLength}`
  })

  // Allow clear
  const showClear = $derived(
    Boolean(allowClear && !disabled && !readonly && String(value ?? '').length > 0),
  )

  // Variant classes
  const variantClasses = $derived.by(() => {
    const base = 'w-full transition-colors duration-200'
    switch (variant) {
      case 'outlined':
        return cn(
          base,
          'border-2 rounded-lg',
          focused ? 'border-primary ring-2 ring-primary/20' : 'border-input',
          hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        )
      case 'filled':
        return cn(
          base,
          'border-b-2 bg-muted/50 rounded-t-lg',
          focused ? 'border-primary bg-muted' : 'border-transparent',
          hasError && 'border-destructive',
        )
      case 'solo':
        return cn(
          base,
          'rounded-lg shadow-sm',
          focused ? 'shadow-md' : 'shadow-sm',
          'bg-card border border-transparent',
        )
      case 'underlined':
        return cn(
          base,
          'border-b-2 rounded-none border-x-0 border-t-0 px-0',
          focused ? 'border-primary' : 'border-muted-foreground/30',
          hasError && 'border-destructive',
        )
      case 'plain':
        return cn(base, 'border-0 bg-transparent')
      default:
        return base
    }
  })

  // Density classes
  const densityClasses = $derived.by(() => {
    switch (density) {
      case 'compact':
        return 'text-sm min-h-8'
      case 'comfortable':
        return 'text-base min-h-10'
      case 'default':
      default:
        return 'text-base min-h-12'
    }
  })

  // Resize classes
  const resizeClasses = $derived.by(() => {
    if (noResize) return 'resize-none'
    if (anyAutoResize) return 'resize-none'
    return 'resize-y'
  })

  // Watch for programmatic value changes to trigger auto-resize (also runs on mount).
  $effect(() => {
    void value
    if (anyAutoResize) {
      tick().then(() => doAutoResize())
    }
  })
</script>

<div data-uipkge="" data-slot="textarea" dir={direction} class={cn('relative space-y-2', className)}>
  <!-- Label -->
  {#if label}
    <label
      for={textareaId}
      data-uipkge=""
      data-slot="label"
      class={cn(
        'text-foreground text-sm font-medium',
        labelClass,
        focused && 'text-primary',
        hasError && 'text-destructive',
      )}
    >
      {label}
      {#if required}
        <span class="text-destructive ml-0.5">*</span>
      {/if}
    </label>
  {/if}

  <!-- Control wrapper -->
  <div
    class={cn(
      'relative flex items-center',
      variantClasses,
      densityClasses,
      disabled && 'pointer-events-none opacity-50',
      readonly && !disabled && 'cursor-default',
      rounded !== 'none' && `rounded-${rounded}`,
    )}
    style={bgColor ? `background-color: ${bgColor}` : undefined}
  >
    <!-- Prefix -->
    {#if prefix}
      <span
        class={cn('text-muted-foreground pointer-events-none absolute top-3 left-3 text-sm', {
          'opacity-50': !persistentPrefix && !focused,
        })}
      >
        {prefix}
      </span>
    {/if}

    <!-- Textarea -->
    <!-- svelte-ignore a11y_autofocus: autofocus is an explicit opt-in consumer prop -->
    <textarea
      id={textareaId}
      bind:this={textareaEl}
      value={value ?? ''}
      {placeholder}
      {disabled}
      {readonly}
      {required}
      {name}
      {autocomplete}
      {autofocus}
      {spellcheck}
      maxlength={maxLength}
      rows={computedRows}
      aria-describedby={hasError || hasSuccess || hint ? descriptionId : undefined}
      aria-invalid={hasError || undefined}
      class={cn(
        'w-full flex-1 resize-y bg-transparent outline-none',
        densityClasses,
        resizeClasses,
        prefix ? 'pl-16' : 'pl-3',
        suffix ? 'pr-16' : showClear ? 'pr-10' : 'pr-3',
        showCountEnabled && 'pb-6',
        'py-2',
        inputClass,
      )}
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      onkeydown={(e) => onkeydown?.(e)}
      onkeyup={(e) => onkeyup?.(e)}
    ></textarea>

    <!-- Suffix -->
    {#if suffix}
      <span
        class={cn('text-muted-foreground pointer-events-none absolute top-3 right-3 text-sm', {
          'opacity-50': !persistentSuffix && !focused,
        })}
      >
        {suffix}
      </span>
    {/if}

    <!-- Clear button -->
    {#if showClear}
      <button
        type="button"
        tabindex="-1"
        aria-label="Clear"
        class={cn(
          'text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-3 flex items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
          suffix ? 'right-10' : 'right-3',
        )}
        onclick={handleClear}
      >
        <X class="size-4" aria-hidden="true" />
      </button>
    {/if}

    <!-- Loading spinner -->
    {#if loading}
      <div class="absolute top-3 right-3 flex items-center justify-center">
        <LoaderCircle class="text-muted-foreground size-4 animate-spin" />
      </div>
    {/if}

    <!-- Success/Error indicators -->
    {#if hasSuccess && !loading}
      <div class="text-success absolute top-3 right-3 flex items-center justify-center">
        <Check class="size-4" aria-hidden="true" />
      </div>
    {/if}
    {#if hasError && !loading}
      <div class="text-destructive absolute top-3 right-3 flex items-center justify-center">
        <CircleAlert class="size-4" aria-hidden="true" />
      </div>
    {/if}

    <!-- Show count -->
    {#if showCountEnabled}
      <div
        class={cn('text-muted-foreground pointer-events-none absolute right-3 bottom-1.5 text-xs', {
          'text-destructive': maxLength !== undefined && currentLength > maxLength,
        })}
      >
        {countText}
      </div>
    {/if}
  </div>

  <!-- Messages (hint, error, success) -->
  <div id={descriptionId} class="mt-1.5">
    <!-- Hint -->
    {#if hint && (!hasError || persistentHint) && !focused}
      <p class={cn('text-muted-foreground text-sm', hintClass)}>
        {hint}
      </p>
    {/if}

    <!-- Error messages -->
    {#each computedErrorMessages as msg, i (`error-${i}`)}
      <p class="text-destructive flex items-center gap-1 text-sm" role="alert">
        <CircleAlert class="size-3 shrink-0" aria-hidden="true" />
        {msg}
      </p>
    {/each}

    <!-- Success messages -->
    {#each computedSuccessMessages as msg, i (`success-${i}`)}
      <p class="text-success flex items-center gap-1 text-sm">
        <Check class="size-3 shrink-0" aria-hidden="true" />
        {msg}
      </p>
    {/each}

    <!-- Counter (legacy) -->
    {#if computedCounter !== null}
      <div
        class={cn('text-muted-foreground mt-1 text-right text-xs', {
          'text-destructive': currentLength > computedCounter,
        })}
      >
        {currentLength} / {computedCounter}
      </div>
    {/if}
  </div>

  {@render children?.()}
</div>
