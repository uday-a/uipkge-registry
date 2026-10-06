<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RatingProps extends HTMLAttributes<HTMLDivElement> {
    /** Currently selected value. Bindable. */
    value?: number
    /** Maximum rating value */
    max?: number
    /** If true, prevents user interaction */
    readonly?: boolean
    /** If true, disables the rating */
    disabled?: boolean
    /** Density of the component */
    density?: 'compact' | 'default' | 'comfortable'
    /** Color of the selected stars */
    color?: string
    /** If true, clicking the same value clears the rating */
    clearable?: boolean
    /** If true, stars grow on hover */
    hover?: boolean
    /** ARIA label for each rating item */
    itemAriaLabel?: string
    /** Size of the stars */
    size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large'
    /** Show the numeric value next to the stars */
    showValue?: boolean
    /** Card variant styling */
    variant?: 'outlined' | 'filled' | 'soft'
    /** If true, creates a half star at 0.5 */
    halfIncrements?: boolean
    /** If true, displays tooltips on hover */
    tooltips?: string[]
    /** Called with the new value after every commit (click or keyboard). */
    onValueChange?: (value: number) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable(0),
    max = 5,
    readonly = false,
    disabled = false,
    density = 'default',
    color = 'var(--warning)',
    clearable = false,
    hover = false,
    itemAriaLabel = 'rating',
    size = 'medium',
    showValue = false,
    variant = 'outlined',
    halfIncrements = false,
    tooltips,
    onValueChange,
    ref = $bindable(null),
    ...restProps
  }: RatingProps = $props()

  const instanceId = $props.id()

  const densityClasses = {
    compact: 'rating-density-compact',
    default: 'rating-density-default',
    comfortable: 'rating-density-comfortable',
  }

  const variantClasses = {
    outlined: 'rating-variant-outlined',
    filled: 'rating-variant-filled',
    soft: 'rating-variant-soft',
  }

  const sizeClasses = {
    'x-small': 'rating-size-xs',
    small: 'rating-size-sm',
    medium: 'rating-size-md',
    large: 'rating-size-lg',
    'x-large': 'rating-size-xl',
  }

  function commit(next: number) {
    value = next
    onValueChange?.(next)
  }

  function resolveClickValue(event: MouseEvent, star: number): number {
    if (!halfIncrements) return star
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const isLeft = event.clientX - rect.left < rect.width / 2
    const next = isLeft ? star - 0.5 : star
    return next < 0.5 ? 0.5 : next
  }

  function handleClick(event: MouseEvent, star: number) {
    if (disabled || readonly) return
    const next = resolveClickValue(event, star)
    if (clearable && next === value) {
      commit(0)
    } else {
      commit(next)
    }
  }

  function handleKeydown(event: KeyboardEvent, star: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (disabled || readonly) return
      if (clearable && star === value) {
        commit(0)
      } else {
        commit(star)
      }
      return
    }
    const step = halfIncrements ? 0.5 : 1
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      commit(Math.min(max, (value ?? 0) + step))
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      commit(Math.max(0, (value ?? 0) - step))
    } else if (event.key === 'Home') {
      event.preventDefault()
      commit(halfIncrements ? 0.5 : 1)
    } else if (event.key === 'End') {
      event.preventDefault()
      commit(max)
    }
  }

  function starClass(index: number): string {
    if (value >= index + 1) return 'rating-star rating-star-full'
    if (value >= index + 0.5 && halfIncrements) return 'rating-star rating-star-half'
    return 'rating-star rating-star-empty'
  }

  /** Stagger cascade only for filled stars (0-based index). */
  function starDelay(index: number): string {
    if (value < index + 1) return '0ms'
    return `${index * 45}ms`
  }

  const stars = $derived(Array.from({ length: max }, (_, i) => i + 1))
</script>

<!-- aria-valuenow/min/max mirror the Vue twin (svelte's role table omits radiogroup). -->
<!-- svelte-ignore a11y_role_supports_aria_props -->
<div
  bind:this={ref}
  data-uipkge=""
  data-slot="rating"
  class={cn(
    'rating',
    densityClasses[density],
    variantClasses[variant],
    sizeClasses[size],
    readonly && 'rating-readonly',
    disabled && 'rating-disabled',
    hover && 'rating-hover',
    clearable && 'rating-clearable',
    showValue && 'rating-show-value',
    className,
  )}
  style="--rating-color: {color}"
  role="radiogroup"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={`Rating: ${value} of ${max}`}
  {...restProps}
>
  {#each stars as n (n)}
    <button
      type="button"
      role="radio"
      class={cn('focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none', starClass(n - 1))}
      style="--star-delay: {starDelay(n - 1)}"
      disabled={disabled || readonly}
      aria-label={tooltips?.[n - 1] ?? `${itemAriaLabel} ${n} of ${max}`}
      aria-checked={Math.ceil(value || 0) === n}
      title={tooltips?.[n - 1]}
      tabindex={readonly || disabled ? -1 : Math.ceil(value || 1) === n ? 0 : -1}
      onclick={(e) => handleClick(e, n)}
      onkeydown={(e) => handleKeydown(e, n)}
    >
      {#if value >= n}
        <!-- Full Star Icon -->
        <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="color: {color}">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      {:else if value >= n - 0.5 && halfIncrements}
        <!-- Half Star Icon -->
        <svg class="star-icon star-half" viewBox="0 0 24 24" aria-hidden="true" style="color: {color}">
          <defs>
            <linearGradient id="{instanceId}-half-{n}">
              <stop offset="50%" stop-color="currentColor" />
              <stop offset="50%" stop-color="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="url(#{instanceId}-half-{n})"
            stroke="currentColor"
            stroke-width="1"
          />
        </svg>
      {:else}
        <!-- Empty Star Icon -->
        <svg
          class="star-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      {/if}
    </button>
  {/each}
  {#if showValue}
    <span class="rating-value">{value}</span>
  {/if}
</div>

<style>
  .rating {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
  }

  .rating-readonly {
    cursor: default;
  }

  .rating-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .rating-star {
    transition: transform 0.15s ease-in-out;
  }

  .rating:not(.rating-disabled):not(.rating-readonly) .rating-star:hover {
    transform: scale(1.12);
  }

  .rating-hover .rating-star:hover {
    transform: scale(1.18);
  }

  .rating-clearable .rating-star {
    cursor: pointer;
  }

  .rating-variant-filled {
    background: var(--muted);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .rating-variant-soft {
    background: var(--accent);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .rating-star {
    background: none;
    border: none;
    padding: 0.125rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .rating-star:focus-visible {
    outline: 2px solid var(--rating-color);
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Density */
  .rating-density-compact .rating-star {
    padding: 0;
  }

  .rating-density-default .rating-star {
    padding: 0.0625rem;
  }

  .rating-density-comfortable .rating-star {
    padding: 0.125rem;
  }

  /* Sizes */
  .rating-size-xs .star-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .rating-size-sm .star-icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  .rating-size-md .star-icon {
    width: 1.375rem;
    height: 1.375rem;
  }

  .rating-size-lg .star-icon {
    width: 1.625rem;
    height: 1.625rem;
  }

  .rating-size-xl .star-icon {
    width: 2rem;
    height: 2rem;
  }

  .rating-star-empty {
    color: var(--muted-foreground);
  }

  .rating-star-full {
    color: var(--rating-color);
  }

  .rating-star-full .star-icon {
    animation: rating-star-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
    animation-delay: var(--star-delay, 0ms);
  }

  @keyframes rating-star-pop {
    0% {
      opacity: 0.4;
      transform: scale(0.6);
    }
    60% {
      opacity: 1;
      transform: scale(1.18);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rating-star-full .star-icon {
      animation: none !important;
    }
    .rating-star {
      transition: none !important;
    }
  }

  .rating-star-half .star-icon {
    position: relative;
  }

  .rating-value {
    margin-left: 0.5rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .rating-show-value {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
