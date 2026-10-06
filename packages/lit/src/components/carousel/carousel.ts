import { LitElement, css, html, nothing } from 'lit'
import { ChevronLeft, ChevronRight } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type CarouselOrientation = 'horizontal' | 'vertical'

/* ------------------------------------------------------------------ Carousel */

export class UipCarousel extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        position: relative;
      }
    `,
  ]

  static properties = {
    orientation: { type: String, reflect: true },
    loop: { type: Boolean },
    canScrollPrev: { type: Boolean, state: true },
    canScrollNext: { type: Boolean, state: true },
    selectedIndex: { type: Number, state: true },
    slideCount: { type: Number, state: true },
  }

  orientation: CarouselOrientation = 'horizontal'
  loop = false
  canScrollPrev = false
  canScrollNext = true
  selectedIndex = 0
  slideCount = 0

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel')
    this.setAttribute('role', 'region')
    this.setAttribute('aria-roledescription', 'carousel')
    this.setAttribute('aria-label', 'Carousel')
    this.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  firstUpdated() {
    this.updateSlides()
  }

  updateSlides() {
    const content = this.querySelector('uip-carousel-content') as UipCarouselContent | null
    if (content) {
      const items = content.querySelectorAll('uip-carousel-item')
      this.slideCount = items.length
      this.syncState()
    }
  }

  syncState() {
    if (this.loop) {
      this.canScrollPrev = true
      this.canScrollNext = true
    } else {
      this.canScrollPrev = this.selectedIndex > 0
      this.canScrollNext = this.selectedIndex < this.slideCount - 1
    }
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { index: this.selectedIndex },
        bubbles: true,
        composed: true,
      }),
    )
  }

  scrollPrev() {
    if (this.selectedIndex > 0) {
      this.scrollToIndex(this.selectedIndex - 1)
    } else if (this.loop && this.slideCount > 0) {
      this.scrollToIndex(this.slideCount - 1)
    }
  }

  scrollNext() {
    if (this.selectedIndex < this.slideCount - 1) {
      this.scrollToIndex(this.selectedIndex + 1)
    } else if (this.loop && this.slideCount > 0) {
      this.scrollToIndex(0)
    }
  }

  scrollToIndex(index: number) {
    if (index < 0 || index >= this.slideCount) return
    this.selectedIndex = index
    this.syncState()
    const content = this.querySelector('uip-carousel-content') as UipCarouselContent | null
    content?.scrollToSlide(index)
  }

  private handleKeyDown(e: KeyboardEvent) {
    const isVertical = this.orientation === 'vertical'
    if ((!isVertical && e.key === 'ArrowLeft') || (isVertical && e.key === 'ArrowUp')) {
      e.preventDefault()
      this.scrollPrev()
    } else if ((!isVertical && e.key === 'ArrowRight') || (isVertical && e.key === 'ArrowDown')) {
      e.preventDefault()
      this.scrollNext()
    }
  }

  render() {
    return html`
      <div
        part="base"
        class=${cn(
          'relative overflow-hidden',
          this.orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
        )}
      >
        <slot></slot>
      </div>
    `
  }
}

/* ---------------------------------------------------------- Carousel Content */

export class UipCarouselContent extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-content')
  }

  get orientation(): CarouselOrientation {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    return carousel?.orientation ?? 'horizontal'
  }

  scrollToSlide(index: number) {
    const scrollContainer = this.renderRoot.querySelector('[part=scroll]') as HTMLElement | null
    const items = this.querySelectorAll('uip-carousel-item')
    const targetItem = items[index] as HTMLElement | undefined
    if (scrollContainer && targetItem) {
      if (this.orientation === 'horizontal') {
        scrollContainer.scrollTo({ left: targetItem.offsetLeft, behavior: 'smooth' })
      } else {
        scrollContainer.scrollTo({ top: targetItem.offsetTop, behavior: 'smooth' })
      }
    }
  }

  private onSlotChange() {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    carousel?.updateSlides()
  }

  render() {
    const isHorizontal = this.orientation === 'horizontal'
    return html`
      <div
        part="scroll"
        class=${cn(
          isHorizontal
            ? 'flex snap-x snap-mandatory overflow-x-auto scroll-smooth'
            : 'flex snap-y snap-mandatory flex-col overflow-y-auto scroll-smooth',
          'relative h-full w-full',
          '[-ms-overflow-style:none] [scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden',
        )}
        aria-orientation=${this.orientation}
        role="group"
      >
        <div
          part="track"
          class=${cn(
            'flex',
            isHorizontal ? 'w-full' : 'flex-col',
          )}
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `
  }
}

/* ------------------------------------------------------------- Carousel Item */

export class UipCarouselItem extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: flex;
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 100%;
        width: 100%;
      }
      :host([orientation='vertical']) {
        height: 100%;
      }
    `,
  ]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-item')
    this.setAttribute('role', 'group')
    this.setAttribute('aria-roledescription', 'slide')

    const carousel = this.closest('uip-carousel') as UipCarousel | null
    if (carousel?.orientation === 'vertical') {
      this.setAttribute('orientation', 'vertical')
    }
  }

  render() {
    return html`
      <div part="base" class="relative flex w-full flex-col snap-start">
        <slot></slot>
      </div>
    `
  }
}

/* --------------------------------------------------------- Carousel Previous */

export class UipCarouselPrevious extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    label: { type: String },
  }

  label = 'Previous slide'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-previous')
  }

  private onClick() {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    carousel?.scrollPrev()
  }

  render() {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    const isHorizontal = (carousel?.orientation ?? 'horizontal') !== 'vertical'
    const disabled = carousel ? !carousel.canScrollPrev : false

    return html`
      <button
        type="button"
        part="base"
        class=${cn(
          'focus-visible:ring-ring inline-flex size-8 shrink-0 items-center justify-center rounded-full border shadow-md transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:outline-none',
          'bg-background/80 hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          isHorizontal ? 'top-1/2 -left-3 -translate-y-1/2' : '-top-3 left-1/2 -translate-x-1/2 rotate-90',
        )}
        ?disabled=${disabled}
        aria-label=${this.label}
        @click=${this.onClick}
      >
        <slot>${icon(ChevronLeft, 'chevron-left', 'size-4')}</slot>
      </button>
    `
  }
}

/* ------------------------------------------------------------- Carousel Next */

export class UipCarouselNext extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    label: { type: String },
  }

  label = 'Next slide'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-next')
  }

  private onClick() {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    carousel?.scrollNext()
  }

  render() {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    const isHorizontal = (carousel?.orientation ?? 'horizontal') !== 'vertical'
    const disabled = carousel ? !carousel.canScrollNext : false

    return html`
      <button
        type="button"
        part="base"
        class=${cn(
          'focus-visible:ring-ring inline-flex size-8 shrink-0 items-center justify-center rounded-full border shadow-md transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:outline-none',
          'bg-background/80 hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          isHorizontal ? 'top-1/2 -right-3 -translate-y-1/2' : '-bottom-3 left-1/2 -translate-x-1/2 rotate-90',
        )}
        ?disabled=${disabled}
        aria-label=${this.label}
        @click=${this.onClick}
      >
        <slot>${icon(ChevronRight, 'chevron-right', 'size-4')}</slot>
      </button>
    `
  }
}

/* ----------------------------------------------------------- Carousel Header */

export class UipCarouselHeader extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
      }
    `,
  ]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-header')
  }

  render() {
    return html`
      <div part="base" class="flex items-center justify-between px-1 pb-2">
        <slot></slot>
      </div>
    `
  }
}

/* ----------------------------------------------------------- Carousel Footer */

export class UipCarouselFooter extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
      }
    `,
  ]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-footer')
  }

  render() {
    return html`
      <div part="base" class="flex items-center justify-between px-1 pt-2">
        <slot></slot>
      </div>
    `
  }
}

/* ------------------------------------------------------- Carousel Indicators */

export class UipCarouselIndicators extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: flex;
        justify-content: center;
      }
    `,
  ]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'carousel-indicators')
    this.setAttribute('role', 'tablist')
    this.setAttribute('aria-label', 'Carousel navigation')
  }

  render() {
    const carousel = this.closest('uip-carousel') as UipCarousel | null
    const count = carousel?.slideCount ?? 0
    const selected = carousel?.selectedIndex ?? 0

    return html`
      <div part="base" class="flex items-center justify-center gap-1.5 py-2">
        ${Array.from({ length: count }).map(
          (_, i) => html`
            <button
              type="button"
              role="tab"
              aria-label="Go to slide ${i + 1}"
              aria-selected=${i === selected ? 'true' : 'false'}
              class=${cn(
                'h-2 rounded-full transition-all duration-200 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1',
                i === selected ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2',
              )}
              @click=${() => carousel?.scrollToIndex(i)}
            ></button>
          `,
        )}
      </div>
    `
  }
}

/* -------------------------------------------------------------- Registration */

customElements.get('uip-carousel') || customElements.define('uip-carousel', UipCarousel)
customElements.get('uip-carousel-content') || customElements.define('uip-carousel-content', UipCarouselContent)
customElements.get('uip-carousel-item') || customElements.define('uip-carousel-item', UipCarouselItem)
customElements.get('uip-carousel-previous') || customElements.define('uip-carousel-previous', UipCarouselPrevious)
customElements.get('uip-carousel-next') || customElements.define('uip-carousel-next', UipCarouselNext)
customElements.get('uip-carousel-header') || customElements.define('uip-carousel-header', UipCarouselHeader)
customElements.get('uip-carousel-footer') || customElements.define('uip-carousel-footer', UipCarouselFooter)
customElements.get('uip-carousel-indicators') || customElements.define('uip-carousel-indicators', UipCarouselIndicators)

declare global {
  interface HTMLElementTagNameMap {
    'uip-carousel': UipCarousel
    'uip-carousel-content': UipCarouselContent
    'uip-carousel-item': UipCarouselItem
    'uip-carousel-previous': UipCarouselPrevious
    'uip-carousel-next': UipCarouselNext
    'uip-carousel-header': UipCarouselHeader
    'uip-carousel-footer': UipCarouselFooter
    'uip-carousel-indicators': UipCarouselIndicators
  }
}
