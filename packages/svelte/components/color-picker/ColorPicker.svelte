<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    value?: string
    disabled?: boolean
    /** Override the swatches shown below the color input. Pass [] to hide entirely. */
    presets?: string[]
    /** Hide the hex text field next to the color trigger. */
    hideHexInput?: boolean
    /** Fires with the new value on every change (input, hex edit, or swatch click). */
    onValueChange?: (value: string) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  const DEFAULT_PRESETS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#ffffff',
    '#d4d4d4',
    '#737373',
    '#171717',
  ]

  let {
    value = $bindable(''),
    disabled,
    presets = DEFAULT_PRESETS,
    hideHexInput = false,
    onValueChange,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: ColorPickerProps = $props()

  const swatches = $derived(presets ?? [])

  /** Native <input type="color"> only accepts #rrggbb — keep a safe value while typing free-form hex. */
  const safeColorValue = $derived(/^#[0-9a-fA-F]{6}$/.test(value || '') ? value : '#ffffff')

  function update(next: string) {
    value = next
    onValueChange?.(next)
  }
</script>

<div bind:this={ref} data-uipkge data-slot="color-picker" class={cn('space-y-3', className)} {...restProps}>
  <!-- Color trigger + hex field -->
  <div class="flex items-center gap-2">
    <div
      class="border-input relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-xs"
      style:background-color={value || '#ffffff'}
    >
      <input
        type="color"
        value={safeColorValue}
        {disabled}
        aria-label="Pick color"
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        oninput={(e) => update(e.currentTarget.value)}
      />
    </div>
    {#if !hideHexInput}
      <input
        type="text"
        value={value || ''}
        placeholder="#000000"
        spellcheck="false"
        autocomplete="off"
        {disabled}
        aria-label="Hex color"
        class="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 flex-1 rounded-md border px-3 text-sm uppercase shadow-xs outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        oninput={(e) => update(e.currentTarget.value)}
      />
    {/if}
  </div>

  <!-- Preset swatches -->
  {#if swatches.length}
    <div class="flex flex-wrap gap-1.5">
      {#each swatches as color (color)}
        <button
          type="button"
          {disabled}
          aria-label={`Select ${color}`}
          style:background-color={color}
          class={cn(
            'ring-offset-background focus-visible:ring-ring/40 size-6 shrink-0 rounded-md shadow-sm transition-transform outline-none hover:scale-110 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
            value?.toLowerCase() === color.toLowerCase() ? 'ring-foreground ring-2 ring-offset-2' : 'ring-border/50 ring-1',
            color.toLowerCase() === '#ffffff' && 'ring-border',
          )}
          onclick={() => update(color)}
        ></button>
      {/each}
    </div>
  {/if}
</div>
