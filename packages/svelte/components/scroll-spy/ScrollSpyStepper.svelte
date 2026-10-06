<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollSpyStepperProps extends HTMLAttributes<HTMLDivElement> {}
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getScrollSpyContext } from './context'

  let { class: className, ...restProps }: ScrollSpyStepperProps = $props()

  const ctx = getScrollSpyContext('ScrollSpyStepper')

  const items = $derived(ctx.items)
  const activeValue = $derived(ctx.activeValue)
  const scrollProgress = $derived(ctx.scrollProgress)
  const position = $derived(ctx.position)

  const activeIndex = $derived.by(() => {
    const list = items
    const active = activeValue
    const idx = list.findIndex((i) => i.value === active || i.value.replace(/^#/, '') === active.replace(/^#/, ''))
    return idx >= 0 ? idx : 0
  })

  function displayTitle(value: string | undefined, title: string | undefined): string {
    if (title) return title
    if (!value) return ''
    return value
      .replace(/^#/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const activeItem = $derived(items[activeIndex])
  const activeTitle = $derived(displayTitle(activeItem?.value, activeItem?.title))

  const isTop = $derived(position === 'top')
  const isBottom = $derived(position === 'bottom')
  const variant = $derived(ctx.variant)
  const indicator = $derived(ctx.indicator)
  const isScrollSpy = $derived(
    variant === 'scrollspy' ||
      variant === 'tabs' ||
      variant === 'pills' ||
      indicator === 'pill' ||
      indicator === 'dot',
  )
</script>

<!-- Top Sticky Scroll Spy Bar (Highlights ONLY the active section) -->
{#if isTop && isScrollSpy}
  <div
    data-slot="scroll-spy-top"
    class={cn(
      'border-border/70 bg-card/85 relative sticky top-0 z-20 flex w-full scrollbar-none items-center gap-1 overflow-x-auto rounded-xl border p-1.5 shadow-xs backdrop-blur-md',
      className,
    )}
    {...restProps}
  >
    {#each items as item, idx (item.value)}
      <button
        type="button"
        data-active={idx === activeIndex ? 'true' : 'false'}
        class={cn(
          'group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-[color,background-color,box-shadow,scale] duration-150 outline-none select-none',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]',
          idx === activeIndex
            ? 'bg-primary/10 text-primary font-semibold shadow-2xs'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        )}
        onclick={() => ctx.scrollToHref(item.value)}
      >
        <!-- Active Dot Indicator -->
        {#if idx === activeIndex}
          <span class="bg-primary size-1.5 shrink-0 rounded-full"></span>
        {/if}
        <!-- Section Title -->
        <span class="truncate">
          {displayTitle(item.value, item.title)}
        </span>
      </button>
    {/each}

    <!-- Slim Bottom Reading Progress Line -->
    <div class="bg-border/20 absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl">
      <div class="bg-primary h-full transition-[width] duration-150 ease-out" style="width: {Math.round(scrollProgress * 100)}%"></div>
    </div>
  </div>
{:else if isTop}
  <!-- Top Sticky Stepper Bar (Cumulative Step Wizard with Step Numbers & Connecting Lines) -->
  <div
    data-slot="scroll-spy-stepper-top"
    class={cn(
      'border-border/70 bg-card/85 sticky top-0 z-20 flex w-full scrollbar-none items-center gap-1.5 overflow-x-auto rounded-xl border p-2 shadow-xs backdrop-blur-md',
      className,
    )}
    {...restProps}
  >
    {#each items as item, idx (item.value)}
      <!-- Step Node Button -->
      <button
        type="button"
        data-active={idx === activeIndex ? 'true' : 'false'}
        class={cn(
          'group flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-[color,background-color,scale] duration-150 outline-none select-none',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]',
          idx === activeIndex
            ? 'bg-primary/10 text-foreground font-medium shadow-2xs'
            : idx < activeIndex
              ? 'text-foreground/80 hover:bg-muted/50'
              : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground',
        )}
        onclick={() => ctx.scrollToHref(item.value)}
      >
        <!-- Step Number / Dot -->
        <span
          class={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-[color,background-color,box-shadow,scale] duration-200',
            idx === activeIndex
              ? 'bg-primary text-primary-foreground scale-105 font-semibold shadow-2xs'
              : idx < activeIndex
                ? 'bg-primary/15 text-primary font-medium'
                : 'bg-muted text-muted-foreground/70',
          )}
        >
          {#if idx < activeIndex}
            <svg class="size-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          {:else}
            <span>{idx + 1}</span>
          {/if}
        </span>

        <!-- Step Title -->
        <span class="max-w-[120px] truncate">
          {displayTitle(item.value, item.title)}
        </span>
      </button>

      <!-- Connecting Progress Line -->
      {#if idx < items.length - 1}
        <div
          class={cn(
            'bg-border/70 h-0.5 max-w-10 min-w-4 flex-1 rounded-full transition-colors duration-200',
            idx < activeIndex && 'bg-primary',
          )}
        ></div>
      {/if}
    {/each}
  </div>
{:else if isBottom}
  <!-- Bottom Floating Stepper Capsule -->
  <div
    data-slot="scroll-spy-stepper-bottom"
    class={cn(
      'border-border/80 bg-background/95 sticky bottom-3 z-30 mx-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-md backdrop-blur-md select-none',
      className,
    )}
    {...restProps}
  >
    <!-- Previous Section Button -->
    <button
      type="button"
      aria-label="Previous section"
      disabled={activeIndex <= 0}
      class="text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-7 items-center justify-center rounded-full transition-[color,background-color,opacity,scale] active:scale-95 disabled:pointer-events-none disabled:opacity-25"
      onclick={ctx.goToPrev}
    >
      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>

    <!-- Segment / Dot Indicators -->
    <div class="flex items-center gap-1.5 px-1">
      {#each items as item, idx (item.value)}
        <button
          type="button"
          aria-label={`Jump to section ${idx + 1}`}
          class={cn(
            'h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-200',
            idx === activeIndex
              ? 'bg-primary w-5'
              : idx < activeIndex
                ? 'bg-primary/40 hover:bg-primary/60 w-2'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2',
          )}
          onclick={() => ctx.scrollToHref(item.value)}
        ></button>
      {/each}
    </div>

    <!-- Active Section Name -->
    <div class="border-border/60 flex items-center gap-2 border-l pl-2">
      <span class="text-foreground max-w-[130px] truncate text-xs font-medium tracking-tight">
        {activeTitle}
      </span>
      <span class="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
        {Math.round(scrollProgress * 100)}%
      </span>
    </div>

    <!-- Next Section Button -->
    <button
      type="button"
      aria-label="Next section"
      disabled={activeIndex >= items.length - 1}
      class="text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-7 items-center justify-center rounded-full transition-[color,background-color,opacity,scale] active:scale-95 disabled:pointer-events-none disabled:opacity-25"
      onclick={ctx.goToNext}
    >
      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
{/if}
