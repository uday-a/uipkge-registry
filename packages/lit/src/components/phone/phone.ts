import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type PhoneModel = 'iphone-17-pro' | 'galaxy-s26-ultra'
export type PhoneVariant = 'apple' | 'android' | PhoneModel
export type PhoneSize = 'sm' | 'md' | 'lg'
export type IPhone17ProColor = 'cosmic-orange' | 'deep-blue' | 'silver'
export type GalaxyS26UltraColor = 'titanium-black' | 'titanium-gray' | 'titanium-silver' | 'cobalt-violet'
export type PhoneColor = IPhone17ProColor | GalaxyS26UltraColor | 'black' | 'natural' | 'blue'

type Finish = {
  name: string
  base: string
  highlight: string
  shadow: string
  button: string
}

const SIZE_CLASS: Record<PhoneSize, string> = {
  sm: 'w-[240px]',
  md: 'w-[300px]',
  lg: 'w-[340px]',
}

const SIZE_SCALE: Record<PhoneSize, number> = { sm: 0.8, md: 1, lg: 1.133 }

function resolveModel(model?: PhoneModel, variant?: PhoneVariant): PhoneModel {
  const value = model ?? variant
  return value === 'galaxy-s26-ultra' || value === 'android' ? 'galaxy-s26-ultra' : 'iphone-17-pro'
}

function getFinish(model: PhoneModel, color?: string): Finish {
  if (model === 'iphone-17-pro') {
    const selected: IPhone17ProColor =
      color === 'silver'
        ? 'silver'
        : color === 'deep-blue' || color === 'blue' || color === 'black'
          ? 'deep-blue'
          : 'cosmic-orange'

    return {
      'cosmic-orange': {
        name: 'Cosmic Orange',
        base: '#d65f27',
        highlight: '#f49a69',
        button: '#bd4e1d',
        shadow: '0 30px 70px -22px rgba(184, 72, 24, 0.62), 0 10px 24px -14px rgba(0, 0, 0, 0.5)',
      },
      'deep-blue': {
        name: 'Deep Blue',
        base: '#183867',
        highlight: '#526f9d',
        button: '#102d56',
        shadow: '0 30px 70px -22px rgba(18, 45, 91, 0.7), 0 10px 24px -14px rgba(0, 0, 0, 0.55)',
      },
      silver: {
        name: 'Silver',
        base: '#b9babd',
        highlight: '#f1f1f2',
        button: '#9b9ca0',
        shadow: '0 30px 70px -24px rgba(0, 0, 0, 0.42), 0 10px 24px -14px rgba(0, 0, 0, 0.38)',
      },
    }[selected]
  }

  const selected: GalaxyS26UltraColor =
    color === 'titanium-gray'
      ? 'titanium-gray'
      : color === 'titanium-silver' || color === 'silver' || color === 'natural'
        ? 'titanium-silver'
        : color === 'cobalt-violet' || color === 'blue'
          ? 'cobalt-violet'
          : 'titanium-black'

  return {
    'titanium-black': {
      name: 'Titanium Black',
      base: '#242426',
      highlight: '#66666a',
      button: '#171719',
      shadow: '0 30px 68px -22px rgba(0, 0, 0, 0.7), 0 10px 24px -14px rgba(0, 0, 0, 0.65)',
    },
    'titanium-gray': {
      name: 'Titanium Gray',
      base: '#66666a',
      highlight: '#aaa9ad',
      button: '#4a4a4e',
      shadow: '0 30px 68px -24px rgba(0, 0, 0, 0.52), 0 10px 24px -14px rgba(0, 0, 0, 0.5)',
    },
    'titanium-silver': {
      name: 'Titanium Silver',
      base: '#b9babe',
      highlight: '#eeeeef',
      button: '#999a9e',
      shadow: '0 30px 68px -24px rgba(0, 0, 0, 0.4), 0 10px 24px -14px rgba(0, 0, 0, 0.4)',
    },
    'cobalt-violet': {
      name: 'Cobalt Violet',
      base: '#4b3a74',
      highlight: '#8a78b1',
      button: '#352658',
      shadow: '0 30px 68px -22px rgba(48, 31, 86, 0.68), 0 10px 24px -14px rgba(0, 0, 0, 0.55)',
    },
  }[selected]
}

function getPhoneVars(model: PhoneModel, scale: number, finish: Finish): Record<string, string> {
  const px = (value: number) => `${value * scale}px`
  const common = {
    '--phone-finish': finish.base,
    '--phone-finish-highlight': finish.highlight,
    '--phone-button': finish.button,
    '--phone-button-depth': px(3),
    '--phone-button-radius': px(1.5),
  }

  if (model === 'iphone-17-pro') {
    return {
      ...common,
      '--phone-rim': px(2.5),
      '--phone-bezel': px(7.5),
      '--phone-outer-radius': px(44),
      '--phone-bezel-radius': px(41.5),
      '--phone-screen-radius': px(34),
      '--phone-island-width': px(88),
      '--phone-island-height': px(27),
      '--phone-island-top': px(11),
      '--phone-status-height': px(44),
      '--phone-status-padding': px(18),
      '--phone-status-size': px(12),
      '--phone-indicator-height': px(5),
      '--phone-indicator-bottom': px(8),
    }
  }

  return {
    ...common,
    '--phone-rim': px(2.2),
    '--phone-bezel': px(5.8),
    '--phone-outer-radius': px(26.9),
    '--phone-bezel-radius': px(24.7),
    '--phone-screen-radius': px(18.9),
    '--phone-camera-size': px(12),
    '--phone-camera-top': px(10),
    '--phone-status-height': px(36),
    '--phone-status-padding': px(16),
    '--phone-status-size': px(12),
    '--phone-indicator-height': px(4),
    '--phone-indicator-bottom': px(8),
  }
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-phone> — the registry Phone mockup as a web component.
 */
export class UipPhone extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; vertical-align: middle; }`]

  static properties = {
    model: { reflect: true },
    variant: { reflect: true },
    size: { reflect: true },
    color: { reflect: true },
    showStatusBar: { converter: trueUnlessFalse, attribute: 'show-status-bar' },
    time: {},
    showHomeIndicator: { type: Boolean, attribute: 'show-home-indicator' },
    showNavBar: { type: Boolean, attribute: 'show-nav-bar' },
  }

  model?: PhoneModel
  variant?: PhoneVariant
  size: PhoneSize = 'md'
  color?: string
  showStatusBar = true
  time = '9:41'
  showHomeIndicator?: boolean
  showNavBar?: boolean

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'phone')
  }

  render() {
    const resolvedModel = resolveModel(this.model, this.variant)
    const isIPhone = resolvedModel === 'iphone-17-pro'
    const finish = getFinish(resolvedModel, this.color)
    const phoneVars = getPhoneVars(resolvedModel, SIZE_SCALE[this.size] ?? 1, finish)
    const showHome = this.showHomeIndicator ?? isIPhone
    const showNav = this.showNavBar ?? !isIPhone
    const aspectRatio = isIPhone ? '71.9 / 150' : '78.1 / 163.6'

    return html`
      <div
        part="base"
        data-uipkge=""
        data-slot="phone"
        data-model=${resolvedModel}
        data-size=${this.size}
        data-color=${finish.name.toLowerCase().replaceAll(' ', '-')}
        role="group"
        aria-label=${`${isIPhone ? 'iPhone 17 Pro' : 'Galaxy S26 Ultra'} preview, ${finish.name}`}
        class=${cn('relative inline-block max-w-full select-none', SIZE_CLASS[this.size] ?? SIZE_CLASS.md)}
        style=${styleMap(phoneVars)}
      >
        <div
          data-slot="phone-chassis"
          class="relative w-full"
          style=${styleMap({
            aspectRatio,
            borderRadius: 'var(--phone-outer-radius)',
            background:
              'linear-gradient(115deg, var(--phone-finish-highlight) 0%, var(--phone-finish) 38%, color-mix(in srgb, var(--phone-finish) 72%, black) 100%)',
            boxShadow: finish.shadow,
          })}
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-30 border border-white/25 shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.18),inset_0_0_3px_rgba(0,0,0,0.5)]"
            style=${styleMap({ borderRadius: 'var(--phone-outer-radius)' })}
          ></div>

          ${isIPhone
            ? html`
                <div
                  data-slot="phone-action-button"
                  data-side="left"
                  aria-hidden="true"
                  class="absolute top-[15.8%] left-0 h-[4.8%] -translate-x-full bg-[var(--phone-button)] shadow-[inset_1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: 'var(--phone-button-radius) 0 0 var(--phone-button-radius)',
                  })}
                ></div>
                <div
                  data-slot="phone-volume-button"
                  data-control="up"
                  data-side="left"
                  aria-hidden="true"
                  class="absolute top-[23.3%] left-0 h-[7.2%] -translate-x-full bg-[var(--phone-button)] shadow-[inset_1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: 'var(--phone-button-radius) 0 0 var(--phone-button-radius)',
                  })}
                ></div>
                <div
                  data-slot="phone-volume-button"
                  data-control="down"
                  data-side="left"
                  aria-hidden="true"
                  class="absolute top-[32.2%] left-0 h-[7.2%] -translate-x-full bg-[var(--phone-button)] shadow-[inset_1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: 'var(--phone-button-radius) 0 0 var(--phone-button-radius)',
                  })}
                ></div>
                <div
                  data-slot="phone-side-button"
                  data-side="right"
                  aria-hidden="true"
                  class="absolute top-[24.1%] right-0 h-[12.2%] translate-x-full bg-[var(--phone-button)] shadow-[inset_-1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: '0 var(--phone-button-radius) var(--phone-button-radius) 0',
                  })}
                ></div>
                <div
                  data-slot="phone-camera-control"
                  data-side="right"
                  aria-hidden="true"
                  class="absolute top-[68.5%] right-0 h-[8.7%] translate-x-full bg-[var(--phone-button)] shadow-[inset_-1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: '0 var(--phone-button-radius) var(--phone-button-radius) 0',
                  })}
                ></div>
              `
            : html`
                <div
                  data-slot="phone-volume-button"
                  data-side="right"
                  aria-hidden="true"
                  class="absolute top-[17.2%] right-0 h-[13.8%] translate-x-full bg-[var(--phone-button)] shadow-[inset_-1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: '0 var(--phone-button-radius) var(--phone-button-radius) 0',
                  })}
                ></div>
                <div
                  data-slot="phone-side-button"
                  data-side="right"
                  aria-hidden="true"
                  class="absolute top-[33.1%] right-0 h-[8.9%] translate-x-full bg-[var(--phone-button)] shadow-[inset_-1px_0_rgba(255,255,255,0.22)]"
                  style=${styleMap({
                    width: 'var(--phone-button-depth)',
                    borderRadius: '0 var(--phone-button-radius) var(--phone-button-radius) 0',
                  })}
                ></div>
              `}

          <div
            data-slot="phone-bezel"
            aria-hidden="true"
            class="absolute bg-[#050506] shadow-[inset_0_0_1px_rgba(255,255,255,0.32)]"
            style=${styleMap({ inset: 'var(--phone-rim)', borderRadius: 'var(--phone-bezel-radius)' })}
          ></div>

          <div
            data-slot="phone-screen"
            class="bg-background text-foreground absolute overflow-hidden"
            style=${styleMap({
              inset: 'calc(var(--phone-rim) + var(--phone-bezel))',
              borderRadius: 'var(--phone-screen-radius)',
            })}
          >
            <div data-slot="phone-content" class="absolute inset-0 z-10 overflow-auto">
              <slot></slot>
            </div>

            ${isIPhone
              ? html`
                  <div
                    data-slot="phone-island"
                    aria-hidden="true"
                    class="absolute left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#050506] shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
                    style=${styleMap({
                      top: 'var(--phone-island-top)',
                      width: 'var(--phone-island-width)',
                      height: 'var(--phone-island-height)',
                    })}
                  >
                    <span class="absolute top-1/2 right-[9%] aspect-square h-[36%] -translate-y-1/2 rounded-full bg-[#101929] ring-1 ring-[#172c4a]">
                      <span class="absolute top-[16%] left-[18%] size-[28%] rounded-full bg-white/25"></span>
                    </span>
                  </div>
                `
              : html`
                  <div
                    data-slot="phone-camera"
                    aria-hidden="true"
                    class="absolute left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#07090c] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                    style=${styleMap({
                      top: 'var(--phone-camera-top)',
                      width: 'var(--phone-camera-size)',
                      height: 'var(--phone-camera-size)',
                    })}
                  >
                    <span class="absolute inset-[24%] rounded-full bg-[#11243d]"></span>
                  </div>
                `}

            ${this.showStatusBar
              ? html`
                  <div
                    data-slot="phone-status-bar"
                    aria-hidden="true"
                    class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between font-semibold text-current"
                    style=${styleMap({
                      height: 'var(--phone-status-height)',
                      paddingInline: 'var(--phone-status-padding)',
                      fontSize: 'var(--phone-status-size)',
                    })}
                  >
                    <span class="leading-none tabular-nums">${this.time}</span>
                    <div class="flex items-center gap-[0.28em]">
                      <svg viewBox="0 0 16 12" class="h-[0.78em] w-[1.05em]" fill="currentColor" aria-hidden="true">
                        <path d="M1 11h2V8H1v3Zm4 0h2V6H5v5Zm4 0h2V3H9v8Zm4 0h2V0h-2v11Z" />
                      </svg>
                      <svg viewBox="0 0 16 12" class="h-[0.78em] w-[1.05em]" fill="currentColor" aria-hidden="true">
                        <path d="M8 10.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM3.8 7.3l1.3 1.3a4.1 4.1 0 0 1 5.8 0l1.3-1.3a6 6 0 0 0-8.4 0ZM1 4.5l1.3 1.3a8 8 0 0 1 11.4 0L15 4.5a9.9 9.9 0 0 0-14 0Z" />
                      </svg>
                      <span class="relative h-[0.82em] w-[1.65em] rounded-[0.2em] border-[0.12em] border-current">
                        <span class="absolute inset-[0.13em] right-[28%] rounded-[0.08em] bg-current"></span>
                        <span class="absolute top-[28%] -right-[0.22em] h-[44%] w-[0.12em] rounded-r-full bg-current/65"></span>
                      </span>
                    </div>
                  </div>
                `
              : nothing}

            ${(isIPhone && showHome) || (!isIPhone && showNav)
              ? html`
                  <div
                    data-slot=${isIPhone ? 'phone-home-indicator' : 'phone-nav-bar'}
                    aria-hidden="true"
                    class="pointer-events-none absolute inset-x-0 z-40 flex justify-center"
                    style=${styleMap({ bottom: 'var(--phone-indicator-bottom)' })}
                  >
                    <div
                      class=${cn(
                        'rounded-full bg-current',
                        isIPhone ? 'w-[36%] max-w-[120px]' : 'w-[27%] max-w-[100px] opacity-55',
                      )}
                      style=${styleMap({ height: 'var(--phone-indicator-height)' })}
                    ></div>
                  </div>
                `
              : nothing}

            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 z-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)]"
              style=${styleMap({ borderRadius: 'var(--phone-screen-radius)' })}
            ></div>
          </div>
        </div>
      </div>
    `
  }
}

customElements.get('uip-phone') || customElements.define('uip-phone', UipPhone)

declare global {
  interface HTMLElementTagNameMap {
    'uip-phone': UipPhone
  }
}
