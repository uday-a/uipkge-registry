import { LitElement, css, html, isServer } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const marqueeStyles = css`
  @keyframes uipkge-marquee-x {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes uipkge-marquee-y {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='marquee-track'] {
      animation: none !important;
    }
  }
`

export type MarqueeOrientation = 'horizontal' | 'vertical'
export type MarqueeDirection = 'left' | 'right' | 'up' | 'down'

/**
 * <uip-marquee> — infinitely scrolling marquee banner.
 */
export class UipMarquee extends LitElement {
  static styles = [
    tailwind,
    marqueeStyles,
    css`
      :host {
        display: block;
        overflow: hidden;
      }
    `,
  ]

  static properties = {
    orientation: { reflect: true },
    direction: { reflect: true },
    speed: { type: Number, reflect: true },
    pauseOnHover: { type: Boolean, attribute: 'pause-on-hover', reflect: true },
    gap: { type: Number, reflect: true },
    repeat: { type: Number, reflect: true },
    paused: { type: Boolean, reflect: true },
  }

  orientation: MarqueeOrientation = 'horizontal'
  direction: MarqueeDirection = 'left'
  speed = 20
  pauseOnHover = false
  gap = 16
  repeat = 2
  paused = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'marquee')
    this.setAttribute('role', 'region')
    this.setAttribute('aria-roledescription', 'marquee')
  }

  willUpdate() {
    this.setAttribute('data-orientation', this.orientation)
    this.setAttribute('data-direction', this.direction)
  }

  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps)
    if (changedProps.has('repeat')) {
      this.cloneNodes()
    }
  }

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    const assigned = slot.assignedNodes({ flatten: true })
    this.cloneNodes(assigned)
  }

  private cloneNodes(nodes?: Node[]) {
    if (isServer) return
    if (!nodes) {
      const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot')
      if (!slot) return
      nodes = slot.assignedNodes({ flatten: true })
    }
    const cloneContainers = this.renderRoot.querySelectorAll<HTMLElement>('[data-clone]')
    cloneContainers.forEach((container) => {
      container.replaceChildren(...nodes!.map((n) => n.cloneNode(true)))
    })
  }

  render() {
    const isVertical = this.orientation === 'vertical'
    const reverse = this.direction === 'right' || this.direction === 'down'

    const containerClass = cn(
      'group flex overflow-hidden',
      isVertical ? 'flex-col' : 'flex-row',
      this.pauseOnHover && 'hover:[&>[data-slot=marquee-track]]:[animation-play-state:paused]',
    )

    const trackClass = cn(
      'flex shrink-0',
      isVertical ? 'flex-col' : 'flex-row',
      this.paused && '![animation-play-state:paused]',
    )

    const trackStyle = `gap: var(--marquee-gap); animation-name: ${
      isVertical ? 'uipkge-marquee-y' : 'uipkge-marquee-x'
    }; animation-duration: ${this.speed}s; animation-timing-function: linear; animation-iteration-count: infinite; animation-direction: ${
      reverse ? 'reverse' : 'normal'
    };`

    return html`
      <div
        part="base"
        data-slot="marquee"
        data-orientation=${this.orientation}
        data-direction=${this.direction}
        class=${containerClass}
        style="--marquee-gap: ${this.gap}px;"
      >
        <div data-slot="marquee-track" class=${trackClass} style=${trackStyle}>
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
        ${Array.from({ length: Math.max(0, this.repeat - 1) }, (_, i) => html`
          <div
            data-slot="marquee-track"
            data-clone=${i + 1}
            class=${trackClass}
            style=${trackStyle}
            aria-hidden="true"
          ></div>
        `)}
      </div>
    `
  }
}

customElements.get('uip-marquee') || customElements.define('uip-marquee', UipMarquee)

declare global {
  interface HTMLElementTagNameMap {
    'uip-marquee': UipMarquee
  }
}
