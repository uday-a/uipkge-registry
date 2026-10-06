import { LitElement, css, html, nothing } from 'lit'
import type { IconNode } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type IconBoxVariant =
  'primary' | 'muted' | 'outline' | 'solid' | 'subtle' | 'destructive' | 'success' | 'warning' | 'ghost' | 'custom'
export type IconBoxSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconBoxShape = 'rounded' | 'circle' | 'square'

const variantClasses: Record<IconBoxVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  muted: 'bg-muted text-muted-foreground',
  outline: 'border border-border bg-background text-foreground shadow-xs',
  solid: 'bg-foreground text-background shadow-xs',
  subtle: 'bg-accent text-accent-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
  custom: '',
}

const shapeClasses: Record<IconBoxShape, string> = {
  rounded: 'rounded-lg',
  circle: 'rounded-full',
  square: 'rounded-none',
}

const sizeClasses: Record<IconBoxSize, string> = {
  '2xs': 'size-6 p-1',
  xs: 'size-7 p-1.5',
  sm: 'size-8 p-1.5',
  md: 'size-9 p-2',
  lg: 'size-11 p-2.5',
  xl: 'size-14 p-3.5',
}

const iconSizes: Record<IconBoxSize, string> = {
  '2xs': 'size-3',
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-4.5',
  lg: 'size-6',
  xl: 'size-7',
}

// The shared icon() helper renders the <svg> without a part; tag it after render.
function tagIconPart(root: ParentNode) {
  root.querySelector('svg.lucide')?.setAttribute('part', 'icon')
}

/**
 * <uip-icon-box> — the registry IconBox.
 *
 * `icon` is a Lucide IconNode from the `lucide` package (property only) and
 * `icon-name` its kebab-case name (for lucide-react's `lucide-<name>` class);
 * or slot your own <svg> (React's `children`).
 *
 * React's `className` lands on the box itself → `part="base"`; React's
 * `iconClassName` on the rendered icon → `part="icon"`. Style both from the
 * page on the host, e.g. React's `className="bg-rose-500/15"
 * iconClassName="text-rose-500"` is
 * `class="[&::part(base)]:bg-rose-500/15 [&::part(icon)]:text-rose-500"`.
 * (A slotted icon is light DOM — style it directly.)
 */
export class UipIconBox extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    icon: { attribute: false },
    iconName: { attribute: 'icon-name' },
    variant: { reflect: true },
    shape: { reflect: true },
    size: { reflect: true },
  }

  icon?: IconNode
  iconName = 'icon'
  variant: IconBoxVariant = 'primary'
  shape: IconBoxShape = 'rounded'
  size: IconBoxSize = 'md'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'icon-box')
  }

  willUpdate() {
    this.setAttribute('data-variant', this.variant)
    this.setAttribute('data-size', this.size)
    this.setAttribute('data-shape', this.shape)
  }

  updated() {
    tagIconPart(this.renderRoot)
  }

  render() {
    return html`<div
      part="base"
      data-slot="icon-box"
      data-variant=${this.variant}
      data-size=${this.size}
      data-shape=${this.shape}
      class=${cn(
        'inline-flex shrink-0 items-center justify-center transition-colors',
        variantClasses[this.variant],
        shapeClasses[this.shape],
        sizeClasses[this.size],
      )}
    >
      <slot>${this.icon ? icon(this.icon, this.iconName, iconSizes[this.size]) : nothing}</slot>
    </div>`
  }
}

export type IconStackVariant = 'primary' | 'muted' | 'destructive' | 'success' | 'warning'
export type IconStackSize = 'sm' | 'md' | 'lg' | 'xl'

const stackSizeMap: Record<IconStackSize, { root: string; base: string; icon: string }> = {
  sm: { root: 'size-10', base: 'size-8 rounded-lg', icon: 'size-4' },
  md: { root: 'size-14', base: 'size-11 rounded-xl', icon: 'size-5' },
  lg: { root: 'size-18', base: 'size-14 rounded-2xl', icon: 'size-7' },
  xl: { root: 'size-24', base: 'size-18 rounded-3xl', icon: 'size-9' },
}

const stackVariantMap: Record<IconStackVariant, { back: string; front: string; text: string }> = {
  primary: {
    back: 'bg-primary/20 border-primary/30',
    front: 'bg-background border-primary/20 shadow-primary/10',
    text: 'text-primary',
  },
  muted: {
    back: 'bg-muted border-border',
    front: 'bg-card border-border shadow-black/5',
    text: 'text-muted-foreground',
  },
  destructive: {
    back: 'bg-destructive/20 border-destructive/30',
    front: 'bg-background border-destructive/20 shadow-destructive/10',
    text: 'text-destructive',
  },
  success: {
    back: 'bg-success/20 border-success/30',
    front: 'bg-background border-success/20 shadow-success/10',
    text: 'text-success',
  },
  warning: {
    back: 'bg-warning/20 border-warning/30',
    front: 'bg-background border-warning/20 shadow-warning/10',
    text: 'text-warning',
  },
}

/**
 * <uip-icon-stack> — the registry IconStack (2.5D layered icon container).
 * Same `icon` / `icon-name` / slot contract as <uip-icon-box>.
 *
 * React's `iconClassName` → `part="icon"` on the rendered icon
 * (`class="[&::part(icon)]:…"` on the host).
 *
 * React's front tile lifts on `group-hover:` of an ancestor `.group`; an
 * outside `.group` can't be matched from inside the shadow root, so that
 * class is kept verbatim but is inert here.
 */
export class UipIconStack extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    icon: { attribute: false },
    iconName: { attribute: 'icon-name' },
    variant: { reflect: true },
    size: { reflect: true },
  }

  icon?: IconNode
  iconName = 'icon'
  variant: IconStackVariant = 'primary'
  size: IconStackSize = 'md'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'icon-stack')
  }

  willUpdate() {
    this.setAttribute('data-variant', this.variant)
    this.setAttribute('data-size', this.size)
  }

  updated() {
    tagIconPart(this.renderRoot)
  }

  render() {
    const s = stackSizeMap[this.size]
    const v = stackVariantMap[this.variant]
    return html`<div
      part="base"
      data-slot="icon-stack"
      data-variant=${this.variant}
      data-size=${this.size}
      class=${cn('relative inline-flex items-center justify-center select-none', s.root)}
    >
      <div
        aria-hidden="true"
        class=${cn('absolute inset-0 m-auto rotate-6 border transition-transform duration-300', s.base, v.back)}
      ></div>
      <div
        class=${cn(
          'relative z-10 flex items-center justify-center border shadow-md transition-transform duration-300 group-hover:-translate-y-0.5',
          s.base,
          v.front,
          v.text,
        )}
      >
        <slot>${this.icon ? icon(this.icon, this.iconName, s.icon) : nothing}</slot>
      </div>
    </div>`
  }
}

customElements.get('uip-icon-box') || customElements.define('uip-icon-box', UipIconBox)
customElements.get('uip-icon-stack') || customElements.define('uip-icon-stack', UipIconStack)

declare global {
  interface HTMLElementTagNameMap {
    'uip-icon-box': UipIconBox
    'uip-icon-stack': UipIconStack
  }
}
