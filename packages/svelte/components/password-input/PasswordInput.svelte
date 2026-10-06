<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { PasswordInputVariants } from './password-input.variants'

  export interface PasswordInputProps extends Omit<HTMLInputAttributes, 'size' | 'type' | 'minlength' | 'value'> {
    /** Controlled value. Pair with `bind:value`. */
    value?: string | undefined
    defaultValue?: string
    size?: PasswordInputVariants['size']
    variant?: PasswordInputVariants['variant']
    showStrength?: boolean
    showToggle?: boolean
    minLength?: number
    ref?: HTMLInputElement | null
  }

  export interface PasswordStrength {
    score: number
    label: 'weak' | 'fair' | 'good' | 'strong'
    color: string
    barColor: string
    percent: number
  }

  export function getPasswordStrength(pwd: string): PasswordStrength {
    if (!pwd) return { score: 0, label: 'weak', color: '', barColor: 'bg-transparent', percent: 0 }

    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 1) {
      return { score, label: 'weak', color: 'text-destructive', barColor: 'bg-destructive', percent: 25 }
    }
    if (score <= 2) {
      return {
        score,
        label: 'fair',
        color: 'text-warning',
        barColor: 'bg-warning',
        percent: 50,
      }
    }
    if (score <= 3) {
      return {
        score,
        label: 'good',
        color: 'text-info',
        barColor: 'bg-info',
        percent: 75,
      }
    }
    return {
      score,
      label: 'strong',
      color: 'text-success',
      barColor: 'bg-success',
      percent: 100,
    }
  }
</script>

<script lang="ts">
  import { Eye, EyeOff } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { passwordInputVariants } from './password-input.variants'

  let {
    class: className,
    value = $bindable(undefined),
    defaultValue = '',
    placeholder = 'Enter password',
    size = 'default',
    variant = 'outlined',
    disabled = false,
    readonly = false,
    showStrength = false,
    showToggle = true,
    minLength = 0,
    autocomplete = 'current-password',
    ref = $bindable(null),
    ...restProps
  }: PasswordInputProps = $props()

  let passwordVisible = $state(false)
  // svelte-ignore state_referenced_locally -- uncontrolled seed: later defaultValue changes must not clobber typing.
  let internalValue = $state(defaultValue)
  const inputValue = $derived(value ?? internalValue)
  const computedType = $derived(passwordVisible ? 'text' : 'password')
  const strength = $derived(getPasswordStrength(inputValue))
  const meetsMinLength = $derived(inputValue.length >= minLength)

  function handleInput(event: Event) {
    const next = (event.target as HTMLInputElement).value
    if (value === undefined) internalValue = next
    value = next
  }

  function toggleVisibility() {
    if (disabled || readonly) return
    passwordVisible = !passwordVisible
    ref?.focus()
  }

  const wrapperClasses = $derived(
    cn(
      passwordInputVariants({ size, variant }),
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
      disabled && 'pointer-events-none cursor-not-allowed bg-muted/30 opacity-50',
      className,
    ),
  )
  const inputPadding = $derived(size === 'sm' ? 'px-2.5' : size === 'lg' ? 'px-4' : 'px-3')
  const togglePadding = $derived(size === 'sm' ? 'pr-2' : size === 'lg' ? 'pr-3' : 'pr-2.5')
</script>

<div class="flex w-full flex-col gap-2">
  <div class={wrapperClasses} data-uipkge data-slot="password-input" data-size={size} data-variant={variant}>
    <input
      bind:this={ref}
      value={inputValue}
      oninput={handleInput}
      type={computedType}
      {placeholder}
      {disabled}
      {readonly}
      {autocomplete}
      {...restProps}
      class={cn('placeholder:text-muted-foreground w-full min-w-0 flex-1 bg-transparent outline-none', inputPadding)}
    />
    {#if showToggle}
      <div class={cn('flex shrink-0 items-center', togglePadding)}>
        <button
          type="button"
          aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          aria-pressed={passwordVisible}
          disabled={disabled || readonly}
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed"
          onmousedown={(e) => e.preventDefault()}
          onclick={toggleVisibility}
        >
          <!-- Visible password → EyeOff (click to hide); hidden → Eye (click to show). Matches Input. -->
          {#if passwordVisible}
            <EyeOff class="size-4" aria-hidden="true" />
          {:else}
            <Eye class="size-4" aria-hidden="true" />
          {/if}
        </button>
      </div>
    {/if}
  </div>

  {#if showStrength && inputValue}
    <div
      class="flex flex-col gap-1.5"
      role="status"
      aria-live="polite"
      aria-label={`Password strength: ${strength.label}`}
    >
      <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full" aria-hidden="true">
        <div
          class={cn('h-full rounded-full transition-[width] duration-300', strength.barColor)}
          style="width: {strength.percent}%"
        ></div>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class={cn(strength.color, 'font-medium capitalize')}>{strength.label}</span>
        {#if minLength > 0}
          <span class={meetsMinLength ? 'text-success' : 'text-muted-foreground'}>
            {inputValue.length} / {minLength} chars
          </span>
        {/if}
      </div>
    </div>
  {/if}

  {#if minLength > 0 && !showStrength && inputValue}
    <p class="text-muted-foreground text-xs">Minimum {minLength} characters</p>
  {/if}
</div>
