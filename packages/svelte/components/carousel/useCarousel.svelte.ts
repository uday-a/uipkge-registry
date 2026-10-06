/**
 * useCarousel
 *
 * Embla-backed carousel state for Svelte 5 runes. Mirrors the React twin
 * (`embla-carousel-react` + `useCarousel` context) 1:1: `Carousel.svelte`
 * owns the options and shares the returned state with its parts via Svelte
 * context; `CarouselContent` attaches the embla viewport, which creates the
 * engine.
 *
 * Why the framework-agnostic `embla-carousel` core instead of the
 * `embla-carousel-svelte` action wrapper: the wrapper's
 * `use:emblaCarouselSvelte` + `on:emblainit` custom-event pattern is Svelte-4
 * era (`on:` is deprecated in runes mode) and splits awkwardly across the
 * Carousel (owns opts/plugins) / CarouselContent (owns the viewport node)
 * boundary. The core is the same engine `embla-carousel-react` wraps, so
 * behavior (`loop`, `align`, `slidesToScroll`, `dragFree`, plugins such as
 * Autoplay) is identical across frameworks.
 *
 * Must be called during component initialization (like the Vue composable):
 * it registers an `onDestroy` cleanup.
 */
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType, type EmblaPluginType } from 'embla-carousel'
import { getContext, onDestroy } from 'svelte'

/** The live embla engine. React twin: `CarouselApi` in `carousel.tsx`. */
export type CarouselApi = EmblaCarouselType

export interface CarouselOptions {
  /** Embla options (`loop`, `align`, `slidesToScroll`, `dragFree`, …). React twin: `CarouselProps['opts']`. */
  opts?: EmblaOptionsType
  /** Embla plugins (e.g. `Autoplay()`). React twin: `CarouselProps['plugins']`. */
  plugins?: EmblaPluginType[]
  orientation?: 'horizontal' | 'vertical'
  /** Shorthand for `opts.loop`. An explicit `opts.loop` wins. Kept from the scroll-snap era. */
  loop?: boolean
}

export const CAROUSEL_CONTEXT_KEY = 'carousel'

export class CarouselState {
  /** The live embla engine once `CarouselContent` has attached, else `undefined`. `$state.raw` — never proxy an external class instance. */
  api = $state.raw<EmblaCarouselType | undefined>(undefined)
  canScrollPrev = $state(false)
  canScrollNext = $state(false)
  selectedIndex = $state(0)
  scrollSnaps = $state<number[]>([])
  orientation = $state<'horizontal' | 'vertical'>('horizontal')

  #viewport: HTMLElement | null = null
  #opts: EmblaOptionsType = {}
  #plugins: EmblaPluginType[] | undefined = undefined
  #onSelect = () => this.#syncFromApi()

  constructor(options: CarouselOptions = {}) {
    this.orientation = options.orientation ?? 'horizontal'
    this.#storeOptions(options)
  }

  /** Back-compat alias for the scroll-snap era's `activeIndex`. Prefer `selectedIndex`. */
  get activeIndex(): number {
    return this.selectedIndex
  }

  /** Back-compat alias for the scroll-snap era's `loop`. */
  get loop(): boolean {
    return !!this.#opts.loop
  }

  set loop(value: boolean) {
    this.syncOptions({ loop: value })
  }

  /** Back-compat manual scroll-sync method from scroll-snap era. */
  updateScrollState(): void {
    this.#syncFromApi()
  }

  /** The embla viewport node. React twin: `carouselRef`. */
  get viewport(): HTMLElement | null {
    return this.#viewport
  }

  get isHorizontal(): boolean {
    return this.orientation === 'horizontal'
  }

  #storeOptions(options: Pick<CarouselOptions, 'opts' | 'plugins' | 'loop'>): void {
    const nextOpts = options.opts ?? {}
    this.#opts =
      options.loop !== undefined && nextOpts.loop === undefined ? { ...nextOpts, loop: options.loop } : nextOpts
    this.#plugins = options.plugins
  }

  #mergedOpts(): EmblaOptionsType {
    // Orientation always wins over `opts.axis` — matches React (`{ ...opts, axis }`).
    return { ...this.#opts, axis: this.orientation === 'horizontal' ? 'x' : 'y' }
  }

  #syncFromApi(): void {
    const api = this.api
    if (!api) return
    // One handler covers both React effects (`onSelect` in Carousel + `onUpdate` in Indicators).
    this.canScrollPrev = api.canScrollPrev()
    this.canScrollNext = api.canScrollNext()
    this.scrollSnaps = api.scrollSnapList()
    this.selectedIndex = api.selectedScrollSnap()
  }

  /** Create the engine on `viewport`. Called by `CarouselContent` once its scrollable root mounts. */
  attach(viewport: HTMLElement): void {
    if (this.#viewport === viewport && this.api) return
    this.detach()
    this.#viewport = viewport
    const api = EmblaCarousel(viewport, this.#mergedOpts(), this.#plugins)
    this.api = api
    this.#syncFromApi()
    api.on('select', this.#onSelect)
    api.on('reInit', this.#onSelect)
  }

  detach(): void {
    if (this.api) {
      this.api.off('select', this.#onSelect)
      this.api.off('reInit', this.#onSelect)
      this.api.destroy()
      this.api = undefined
    }
    this.#viewport = null
  }

  /** Push new opts/plugins into the live engine (re-inits embla). Called by `Carousel` when props change. */
  syncOptions(options: Pick<CarouselOptions, 'opts' | 'plugins' | 'loop'>): void {
    this.#storeOptions(options)
    this.api?.reInit(this.#mergedOpts(), this.#plugins)
    this.#syncFromApi()
  }

  scrollPrev(): void {
    this.api?.scrollPrev()
  }

  scrollNext(): void {
    this.api?.scrollNext()
  }

  scrollTo(index: number, smooth = true): void {
    // Embla's 2nd arg is `jump` (instant) — the inverse of `smooth`.
    this.api?.scrollTo(index, !smooth)
  }

  /**
   * @deprecated Use `scrollPrev` (React parity). Kept for scroll-snap-era
   * consumers — the `smooth` arg is accepted for signature compat and ignored
   * (embla always animates prev/next).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollToPrev(smooth = true): void {
    this.scrollPrev()
  }

  /**
   * @deprecated Use `scrollNext` (React parity). Kept for scroll-snap-era
   * consumers — the `smooth` arg is accepted for signature compat and ignored
   * (embla always animates prev/next).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollToNext(smooth = true): void {
    this.scrollNext()
  }
}

export function useCarousel(options: CarouselOptions = {}): CarouselState {
  const state = new CarouselState(options)

  onDestroy(() => {
    state.detach()
  })

  return state
}

/** Read the carousel state from any sub-part. Throws outside `<Carousel />` — mirrors React's `useCarousel`. */
export function getCarouselContext(): CarouselState {
  const state = getContext<CarouselState | undefined>(CAROUSEL_CONTEXT_KEY)
  if (!state) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return state
}

/** @deprecated Use `CarouselState`. Renamed to free `CarouselApi` for the live Embla engine (React parity). */
export const CarouselApiClass = CarouselState
export type CarouselApiState = CarouselState
