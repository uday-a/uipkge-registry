<!--
  Carousel Component

  A flexible carousel/slider for cycling through content, built on
  `embla-carousel` (the same engine as the React twin's
  `embla-carousel-react`). All parts are wired through Svelte context that
  holds the shared `CarouselState`.

  @example - Basic carousel with images
  <Carousel>
    <CarouselContent>
      {#each images as img (img.id)}
        <CarouselItem>
          <img src={img.src} alt={img.alt} class="h-full w-full object-cover" />
        </CarouselItem>
      {/each}
    </CarouselContent>
  </Carousel>

  @example - Carousel with navigation controls
  <Carousel opts={{ loop: true }}>
    <CarouselContent>
      {#each slides as slide (slide.id)}
        <CarouselItem>
          <SlideContent content={slide} />
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselFooter>
      <CarouselPrevious />
      <CarouselIndicators />
      <CarouselNext />
    </CarouselFooter>
  </Carousel>

  @example - Vertical carousel
  <Carousel orientation="vertical">
    <CarouselContent>
      {#each items as item (item.id)}
        <CarouselItem>
          {item}
        </CarouselItem>
      {/each}
    </CarouselContent>
  </Carousel>

  @example - Controlled index + engine access
  <Carousel bind:value={activeIndex} bind:api={embla}>
    ...
  </Carousel>
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
  import type { CarouselApi } from './useCarousel.svelte'

  export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
    /** Embla options (`loop`, `align`, `slidesToScroll`, `dragFree`, …). React twin: `opts`. */
    opts?: EmblaOptionsType
    /** Embla plugins (e.g. `Autoplay()`). React twin: `plugins`. */
    plugins?: EmblaPluginType[]
    orientation?: 'horizontal' | 'vertical'
    /** Shorthand for `opts.loop`. An explicit `opts.loop` wins. */
    loop?: boolean
    /** Controlled active slide index. Two-way bindable (`bind:value`). */
    value?: number
    /** The live embla engine. Two-way bindable (`bind:api`) — the Svelte equivalent of React's `setApi`. */
    api?: CarouselApi | undefined
    /** React-parity callback, fired when the engine initializes. Prefer `bind:api`. */
    setApi?: (api: CarouselApi) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { useCarousel, CAROUSEL_CONTEXT_KEY } from './useCarousel.svelte'
  import { carouselVariants } from './carousel.variants'

  let {
    class: className,
    opts,
    plugins,
    orientation = 'horizontal',
    loop = false,
    value = $bindable(0),
    api = $bindable(undefined),
    setApi,
    children,
    ref = $bindable(null),
    onkeydowncapture,
    ...restProps
  }: CarouselProps = $props()

  // Initial capture is intentional: opts/plugins/orientation/loop sync into
  // the live engine via the $effect below (which re-inits embla on change).
  // svelte-ignore state_referenced_locally
  const carousel = useCarousel({ opts, plugins, orientation, loop })

  // Provide to children
  setContext(CAROUSEL_CONTEXT_KEY, carousel)

  // Sync options into the shared state (re-inits the engine when attached).
  $effect(() => {
    carousel.orientation = orientation
    carousel.syncOptions({ opts, plugins, loop })
  })

  // Publish the engine outward (bindable + React-style callback).
  $effect(() => {
    const engine = carousel.api
    if (engine && api !== engine) {
      api = engine
      setApi?.(engine)
    } else if (!engine && api !== undefined) {
      api = undefined
    }
  })

  // Controlled-index support: parent writes `value` → engine jumps (no
  // animation, so mount/controlled updates never visibly sweep past slides)…
  $effect(() => {
    if (carousel.api && value !== carousel.selectedIndex) {
      carousel.scrollTo(value, false)
    }
  })

  // …and engine selection flows back to `value`.
  $effect(() => {
    const selected = carousel.selectedIndex
    if (selected !== value) {
      value = selected
    }
  })

  // Arrow-key navigation — mirrors React's onKeyDownCapture.
  type OnKeyDownCapture = NonNullable<HTMLAttributes<HTMLDivElement>['onkeydowncapture']>
  const handleKeyDownCapture: OnKeyDownCapture = (e) => {
    onkeydowncapture?.(e)
    if (e.defaultPrevented) return
    const isVertical = orientation === 'vertical'
    if ((!isVertical && e.key === 'ArrowLeft') || (isVertical && e.key === 'ArrowUp')) {
      e.preventDefault()
      carousel.scrollPrev()
    } else if ((!isVertical && e.key === 'ArrowRight') || (isVertical && e.key === 'ArrowDown')) {
      e.preventDefault()
      carousel.scrollNext()
    }
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="carousel"
  data-orientation={orientation}
  class={cn(carouselVariants({ orientation }), className)}
  role="region"
  aria-roledescription="carousel"
  aria-label="Carousel"
  {...restProps}
  onkeydowncapture={handleKeyDownCapture}
>
  {@render children?.()}
</div>
