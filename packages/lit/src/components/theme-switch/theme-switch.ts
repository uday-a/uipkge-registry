import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChevronDown, Monitor, Moon, Palette, Sparkles, Sun, type IconNode } from 'lucide'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import '../section-card/section-card'
import '../dropdown-menu/dropdown-menu'

export type Theme = 'light' | 'dark' | 'system' | 'black'
export type ThemeSwitchVariant = 'cards' | 'icons' | 'icon-only' | 'dropdown' | 'pill' | 'pill-4' | 'switch'

const ICONS: Record<Theme, [IconNode, string]> = {
  light: [Sun, 'sun'],
  dark: [Moon, 'moon'],
  system: [Monitor, 'monitor'],
  black: [Sparkles, 'sparkles'],
}

const LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  black: 'Black',
}

const VARIANT_OPTIONS: Record<ThemeSwitchVariant, Theme[]> = {
  cards: ['light', 'dark', 'system'],
  icons: ['light', 'dark', 'system'],
  'icon-only': ['light', 'dark'],
  dropdown: ['light', 'dark', 'system'],
  pill: ['light', 'dark', 'system'],
  'pill-4': ['system', 'light', 'dark', 'black'],
  switch: ['light', 'dark'],
}

const ic = (t: Theme, cls: string) => icon(ICONS[t][0], ICONS[t][1], cls)

// --- page theme store ----------------------------------------------------------
// The React registry delegates to next-themes, configured by the registry's
// ThemeProvider as `attribute="class" defaultTheme="system" enableSystem
// disableTransitionOnChange`. This store reproduces that behaviour so Lit and
// React pages share one persisted choice:
//  - localStorage key `theme` (next-themes' default storageKey), default `system`;
//  - the resolved theme as a class on <html> (`light` / `dark`), `system`
//    resolving through `prefers-color-scheme` and following its changes;
//  - `color-scheme` on <html> for light/dark;
//  - transitions suppressed for the swap;
//  - other tabs picked up through the `storage` event.
// Every element's ThemeController watches `html.dark`, so all uip-* elements
// follow automatically.

const STORAGE_KEY = 'theme'
const MEDIA = '(prefers-color-scheme: dark)'
const subscribers = new Set<UipThemeSwitch>()
let current: Theme | undefined
let listening = false

const readStored = (): Theme => {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' || v === 'system' || v === 'black' ? v : 'system'
  } catch {
    return 'system'
  }
}

function disableTransitions() {
  const style = document.createElement('style')
  style.appendChild(
    document.createTextNode(
      '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}',
    ),
  )
  document.head.appendChild(style)
  return () => {
    // Force a restyle so the new colours commit with transitions off.
    void getComputedStyle(document.body)
    setTimeout(() => style.remove(), 1)
  }
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? (matchMedia(MEDIA).matches ? 'dark' : 'light') : theme
  const d = document.documentElement
  const enable = disableTransitions()
  d.classList.remove('light', 'dark', 'black')
  d.classList.add(resolved)
  d.style.colorScheme = resolved === 'light' || resolved === 'dark' ? resolved : ''
  enable()
}

function startListening() {
  if (listening) return
  listening = true
  current = readStored()
  applyTheme(current)
  matchMedia(MEDIA).addEventListener('change', () => {
    if (current === 'system') applyTheme('system')
  })
  addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return
    current = readStored()
    applyTheme(current)
    subscribers.forEach((s) => s.requestUpdate())
  })
}

/** Set the page theme (persisted, applied to <html>, synced to every uncontrolled uip-theme-switch). */
export function setTheme(theme: Theme) {
  current = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage unavailable — keep the in-memory choice */
  }
  applyTheme(theme)
  subscribers.forEach((s) => s.requestUpdate())
}

// --- theme reveal (View Transition) ----------------------------------------------
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => unknown) => { finished: Promise<void> }
}

let revealing = false

/**
 * React's withThemeReveal, verbatim in behaviour: the new theme wipes in as a
 * circle from the clicked control. The keyframes live in the page's
 * tailwind.css behind `html[data-uipkge-theme-reveal]`. React runs the swap in
 * flushSync; here the callback returns the elements' updateComplete so the API
 * captures the DOM after Lit re-renders.
 */
async function withThemeReveal(enabled: boolean, point: { x: number; y: number } | undefined, swap: () => unknown) {
  const startViewTransition = (document as ViewTransitionDocument).startViewTransition?.bind(document)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!enabled || !startViewTransition || reduceMotion) {
    swap()
    return
  }
  if (revealing) return
  revealing = true

  const root = document.documentElement
  const x = point?.x ?? window.innerWidth / 2
  const y = point?.y ?? window.innerHeight / 2
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty('--uipkge-theme-x', `${x}px`)
  root.style.setProperty('--uipkge-theme-y', `${y}px`)
  root.style.setProperty('--uipkge-theme-r', `${radius}px`)
  root.setAttribute('data-uipkge-theme-reveal', '')

  try {
    await startViewTransition(swap).finished
  } finally {
    root.removeAttribute('data-uipkge-theme-reveal')
    revealing = false
  }
}

const pointOf = (e?: MouseEvent) =>
  // Keyboard activation dispatches a synthetic click at (0, 0): reveal from the centre instead.
  e && e.detail > 0 ? { x: e.clientX, y: e.clientY } : undefined

/**
 * <uip-theme-switch> — the registry ThemeSwitch as a web component.
 *
 *   <uip-theme-switch></uip-theme-switch>                          (cards, drives the page theme)
 *   <uip-theme-switch variant="dropdown"></uip-theme-switch>
 *   <uip-theme-switch variant="pill" value="system" class="max-w-sm"></uip-theme-switch>
 *
 * Props: `value` ('light' | 'dark' | 'system' | 'black'), `variant` ('cards' |
 * 'icons' | 'icon-only' | 'dropdown' | 'pill' | 'pill-4' | 'switch', default
 * 'cards'), `heading` (React's `title` — `title` is taken by HTMLElement),
 * `description`, `view-transition` (default true; `view-transition="false"`
 * turns the circular reveal off).
 *
 * Without `value` the element is bound to the page theme, like React falling
 * back to next-themes: it reads/writes localStorage `theme`, sets the `light` /
 * `dark` class and `color-scheme` on <html>, follows `prefers-color-scheme` in
 * `system` mode, and every unbound switch on the page stays in sync. With
 * `value` set (React's controlled `value` + `onValueChange`) it only updates
 * its own `value` and emits events; the page theme is left to the consumer
 * (call the exported `setTheme()`).
 *
 * Events (bubbling, composed): `input`, `change`, `value-change` { value }.
 * React's `className` → a class on the host (layout, e.g. `max-w-md`) or
 * `[&::part(base)]:…` for the root control.
 */
export class UipThemeSwitch extends LitElement {
  // Block for the full-width variants (cards, pill), inline otherwise — the host has no template of its own.
  static styles = [
    tailwind,
    css`:host { display: inline-block; } :host(:not([variant])), :host([variant='cards']), :host([variant^='pill']) { display: block; }`,
  ]

  static properties = {
    value: { reflect: true },
    variant: { reflect: true },
    heading: {},
    description: {},
    viewTransition: {
      attribute: 'view-transition',
      type: Boolean,
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
  }

  value?: Theme
  variant: ThemeSwitchVariant = 'cards'
  heading?: string
  description?: string
  viewTransition = true

  /** Pointer position of the last press in the dropdown (its `select` event carries none). */
  private menuPoint?: { x: number; y: number }

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    if (isServer) return
    subscribers.add(this)
    if (this.value === undefined) startListening()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    subscribers.delete(this)
  }

  private get bound() {
    return this.value === undefined
  }

  private get modelValue(): Theme {
    return this.value ?? current ?? 'system'
  }

  private get options() {
    return VARIANT_OPTIONS[this.variant] ?? VARIANT_OPTIONS.cards
  }

  private get activeIndex() {
    const i = this.options.indexOf(this.modelValue)
    return i === -1 ? 0 : i
  }

  private set(t: Theme, point?: { x: number; y: number }) {
    void withThemeReveal(this.viewTransition, point, () => {
      if (this.bound) {
        startListening()
        setTheme(t)
      } else this.value = t
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: t }, bubbles: true, composed: true }))
      return Promise.all([...subscribers].map((s) => s.updateComplete))
    })
  }

  private cycle(e?: MouseEvent) {
    const next = this.options[(this.activeIndex + 1) % this.options.length]
    if (next) this.set(next, pointOf(e))
  }

  render() {
    const v = this.modelValue
    const options = this.options
    const label = this.heading ?? 'Theme'

    if (this.variant === 'icons') {
      return html`<div
        part="base"
        role="radiogroup"
        aria-label=${label}
        class="border-border bg-card inline-flex items-center gap-0.5 rounded-md border p-0.5"
      >
        ${options.map(
          (t) => html`<button
            type="button"
            role="radio"
            aria-checked=${v === t ? 'true' : 'false'}
            aria-label=${LABELS[t]}
            class=${[
              'focus-visible:ring-ring grid size-7 place-items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none',
              v === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ].join(' ')}
            @click=${(e: MouseEvent) => this.set(t, pointOf(e))}
          >
            ${ic(t, 'size-4')}
          </button>`,
        )}
      </div>`
    }

    if (this.variant === 'icon-only') {
      return html`<button
        part="base"
        type="button"
        aria-label=${LABELS[v]}
        class="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
        @click=${(e: MouseEvent) => this.cycle(e)}
      >
        ${ic(v, 'size-4')}
      </button>`
    }

    if (this.variant === 'dropdown') {
      return html`<uip-dropdown-menu
        class="[&::part(content)]:min-w-[140px]"
        @pointerup=${(e: PointerEvent) => (this.menuPoint = { x: e.clientX, y: e.clientY })}
        @keydown=${() => (this.menuPoint = undefined)}
      >
        <button
          slot="trigger"
          part="base"
          type="button"
          class="border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none"
        >
          ${ic(v, 'size-4')}
          <span>${LABELS[v]}</span>
          ${icon(ChevronDown, 'chevron-down', 'size-3 opacity-60')}
        </button>
        <uip-dropdown-menu-content align="end">
          ${options.map(
            (t) => html`<uip-dropdown-menu-item
              @select=${() => {
                this.set(t, this.menuPoint)
                this.menuPoint = undefined
              }}
              >${ic(t, 'mr-2 size-4')}<span>${LABELS[t]}</span></uip-dropdown-menu-item
            >`,
          )}
        </uip-dropdown-menu-content>
      </uip-dropdown-menu>`
    }

    if (this.variant === 'pill' || this.variant === 'pill-4') {
      const indicatorStyle = {
        width: `calc((100% - 4px) / ${options.length})`,
        transform: `translateX(calc(${this.activeIndex} * 100%))`,
      }
      return html`<div
        part="base"
        role="radiogroup"
        aria-label=${label}
        class="border-border bg-card relative inline-flex w-full max-w-md rounded-full border p-0.5"
      >
        <span
          aria-hidden="true"
          class="bg-primary pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-300 ease-out"
          style=${styleMap(indicatorStyle)}
        ></span>
        ${options.map(
          (t) => html`<button
            type="button"
            role="radio"
            aria-checked=${v === t ? 'true' : 'false'}
            aria-label=${LABELS[t]}
            class=${[
              'focus-visible:ring-ring relative z-[1] inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              v === t ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
            @click=${(e: MouseEvent) => this.set(t, pointOf(e))}
          >
            ${ic(t, 'size-3.5')}
            <span>${LABELS[t]}</span>
          </button>`,
        )}
      </div>`
    }

    if (this.variant === 'switch') {
      return html`<button
        part="base"
        type="button"
        role="switch"
        aria-checked=${v === 'dark' ? 'true' : 'false'}
        aria-label=${LABELS[v]}
        class=${[
          'border-border focus-visible:ring-ring relative inline-flex h-8 w-16 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
          v === 'dark' ? 'bg-primary' : 'bg-muted',
        ].join(' ')}
        @click=${(e: MouseEvent) => this.set(v === 'dark' ? 'light' : 'dark', pointOf(e))}
      >
        ${icon(
          Sun,
          'sun',
          ['text-warning absolute left-1.5 size-4 transition-opacity', v === 'dark' ? 'opacity-30' : 'opacity-100'].join(' '),
        )}
        ${icon(
          Moon,
          'moon',
          ['text-muted-foreground absolute right-1.5 size-4 transition-opacity', v === 'light' ? 'opacity-30' : 'opacity-100'].join(
            ' ',
          ),
        )}
        <span
          aria-hidden="true"
          class="bg-card border-border absolute size-6 rounded-full border shadow transition-transform duration-300 ease-out"
          style=${styleMap({ transform: `translateX(${v === 'dark' ? '36px' : '4px'})` })}
        ></span>
      </button>`
    }

    // Cards (default): SectionCard with a 3-button grid.
    return html`<uip-section-card
      exportparts="base, content"
      .heading=${this.heading ?? 'Appearance'}
      .description=${this.description ?? 'Choose your interface theme.'}
    >
      <span slot="header-action" class="contents">${icon(Palette, 'palette', 'text-muted-foreground size-5')}</span>
      <div class="grid grid-cols-3 gap-2" role="radiogroup" aria-label=${this.heading ?? 'Theme'}>
        ${options.map(
          (t) => html`<button
            type="button"
            role="radio"
            aria-checked=${v === t ? 'true' : 'false'}
            class=${[
              'focus-visible:ring-ring rounded-md border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:outline-none',
              v === t ? 'border-primary ring-primary bg-primary/5 ring-1' : 'border-border hover:bg-muted/50',
            ].join(' ')}
            @click=${(e: MouseEvent) => this.set(t, pointOf(e))}
          >
            ${ic(t, 'text-muted-foreground mb-2 size-4')}
            <p class="text-xs font-medium">${LABELS[t]}</p>
          </button>`,
        )}
      </div>
    </uip-section-card>`
  }
}

customElements.get('uip-theme-switch') || customElements.define('uip-theme-switch', UipThemeSwitch)

declare global {
  interface HTMLElementTagNameMap {
    'uip-theme-switch': UipThemeSwitch
  }
}
