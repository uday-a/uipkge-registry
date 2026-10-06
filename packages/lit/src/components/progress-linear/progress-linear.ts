import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { progressLinearVariants, type ProgressLinearVariants } from './progress-linear.variants'

type Rounded = NonNullable<ProgressLinearVariants['rounded']>

// Boolean props whose React default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-progress-linear> — the registry ProgressLinear as a web component.
 *
 * Class strings are React's verbatim, on the same elements (container,
 * background, buffer, stream, progress bar). React's injected keyframes are
 * copied into the static styles — the one allowed CSS exception for
 * React-injected keyframes — with one fix: React's markup uses
 * `motion-safe:animate-indeterminate{,1,2}` while its <style> defines the
 * unprefixed `.animate-indeterminate{,1,2}`, so the indeterminate slide never
 * runs in React; here the rules match the markup's exact class names (escaped)
 * so the animation works. Reported, not silently diverged.
 *
 * `height` is a pixel number or any CSS length (`height="8"` / `height="2px"`).
 * Parts: `base` (the progressbar root), `fill` (the progress bar).
 */
export class UipProgressLinear extends LitElement {
  // React's root is a block-level <div> (relative w-full).
  static styles = [
    tailwind,
    css`:host { display: block; width: 100%; }`,
    // React's injected keyframes, with selectors matching the markup's exact
    // class names (see class comment).
    css`
      @media (prefers-reduced-motion: no-preference) {
        .uipkge-pl .motion-safe\\:animate-indeterminate {
          animation: uipkge-pl-indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .uipkge-pl .motion-safe\\:animate-indeterminate1 {
          animation: uipkge-pl-indeterminate1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .uipkge-pl .motion-safe\\:animate-indeterminate2 {
          animation: uipkge-pl-indeterminate2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .uipkge-pl .animate-stream {
          animation: uipkge-pl-stream 1s linear infinite;
        }
      }
      @keyframes uipkge-pl-indeterminate {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(400%);
        }
      }
      @keyframes uipkge-pl-indeterminate1 {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(400%);
        }
      }
      @keyframes uipkge-pl-indeterminate2 {
        0% {
          transform: translateX(-100%);
          opacity: 1;
        }
        100% {
          transform: translateX(400%);
          opacity: 0;
        }
      }
      @keyframes uipkge-pl-stream {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(40px);
        }
      }
    `,
  ]

  static properties = {
    value: { type: Number },
    bgColor: { attribute: 'bg-color' },
    buffer: { type: Number },
    color: {},
    height: {
      converter: {
        fromAttribute: (v: string | null) => {
          if (v === null || v === '') return undefined
          const n = Number(v)
          return Number.isNaN(n) ? v : n
        },
        toAttribute: (v: unknown) => String(v),
      },
    },
    indeterminate: { type: Boolean, reflect: true },
    reverse: { type: Boolean, reflect: true },
    rounded: { reflect: true },
    stream: { type: Boolean, reflect: true },
    striped: { type: Boolean, reflect: true },
    active: { type: Boolean, converter: trueByDefault },
  }

  value = 0
  bgColor?: string
  buffer?: number
  color?: string
  height?: number | string
  indeterminate = false
  reverse = false
  rounded: Rounded = 'default'
  stream = false
  striped = false
  active = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'progress-linear')
  }

  render() {
    const normalizedValue = Math.min(100, Math.max(0, this.value))
    const normalizedBuffer = Math.min(100, Math.max(0, this.buffer || 0))
    const heightValue =
      typeof this.height === 'number' ? `${this.height}px` : typeof this.height === 'string' ? this.height : '4px'
    const bgColorValue = this.bgColor || 'currentColor'
    const progressColorValue = this.color || 'currentColor'
    const indeterminate = this.indeterminate
    const reverse = this.reverse

    return html`<div
      part="base"
      data-uipkge=""
      data-slot="progress-linear"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${indeterminate ? nothing : normalizedValue}
      class=${cn('uipkge-pl', progressLinearVariants({ rounded: this.rounded }))}
      style=${styleMap({ height: heightValue })}
    >
      <div
        class=${cn(
          'absolute inset-0 transition-colors duration-300',
          this.striped
            ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]'
            : '',
          !indeterminate && normalizedBuffer > 0 ? 'opacity-30' : 'opacity-100',
        )}
        style=${styleMap({
          backgroundColor: bgColorValue,
          width: normalizedBuffer > 0 ? `${normalizedBuffer}%` : '100%',
        })}
      ></div>

      ${!indeterminate && normalizedBuffer > 0 && normalizedBuffer < 100
        ? html`<div
            class=${cn(
              'absolute inset-0 transition-colors duration-300',
              reverse ? 'right-0 left-auto' : 'right-auto left-0',
              this.striped
                ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.15)_8px,rgba(255,255,255,0.15)_16px)]'
                : '',
            )}
            style=${styleMap({ backgroundColor: bgColorValue, width: `${normalizedBuffer}%`, opacity: '0.3' })}
          ></div>`
        : nothing}
      ${this.stream && !indeterminate && this.active
        ? html`<div class=${cn('absolute inset-0 overflow-hidden', reverse ? 'right-0 left-auto' : 'right-auto left-0')}>
            <div
              class="animate-stream absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)] bg-[length:40px_40px]"
              style=${styleMap({ width: `${normalizedBuffer || 100}%` })}
            ></div>
          </div>`
        : nothing}

      <div
        part="fill"
        class=${cn(
          'absolute inset-y-0 transition-colors duration-300',
          reverse ? 'right-0 left-auto' : 'right-auto left-0',
          indeterminate ? 'motion-safe:animate-indeterminate' : '',
          this.striped && !indeterminate
            ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.25)_8px,rgba(255,255,255,0.25)_16px)]'
            : '',
        )}
        style=${indeterminate
          ? styleMap({ width: '100%' })
          : styleMap({ width: `${normalizedValue}%`, backgroundColor: progressColorValue })}
      >
        ${indeterminate
          ? html`<div
                class="motion-safe:animate-indeterminate1 absolute inset-y-0 w-full bg-inherit"
                style=${styleMap({ backgroundColor: progressColorValue })}
              ></div>
              <div
                class="motion-safe:animate-indeterminate2 absolute inset-y-0 w-full bg-inherit"
                style=${styleMap({ backgroundColor: progressColorValue })}
              ></div>`
          : nothing}
      </div>
    </div>`
  }
}

customElements.get('uip-progress-linear') || customElements.define('uip-progress-linear', UipProgressLinear)

declare global {
  interface HTMLElementTagNameMap {
    'uip-progress-linear': UipProgressLinear
  }
}
