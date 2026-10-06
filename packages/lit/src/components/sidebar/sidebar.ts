import { LitElement, css, html, isServer, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { styleMap } from 'lit/directives/style-map.js'
import { PanelLeft } from 'lucide'
import { cn } from '../../lib/utils'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { sidebarMenuButtonVariants, type SidebarMenuButtonVariants } from './sidebar.variants'

/* ------------------------------------------------------------------ */
/* Constants (React's, verbatim)                                       */
/* ------------------------------------------------------------------ */

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'
const MOBILE_QUERY = '(max-width: 768px)'

const sidebarTailwind = tailwind
// Every sidebar host generates no box: React's element is rendered inside the
// shadow root and laid out directly by the parent (flex/grid/list), exactly
// like React's DOM. React's `className` → `class="[&::part(base)]:…"`.
const contents = css`
  :host {
    display: contents;
  }
`

// Boolean props that default to true must accept the string "false".
const trueByDefault = {
  fromAttribute: (v: string | null) => v !== null && v !== 'false',
  toAttribute: (v: boolean) => (v ? '' : null),
}

type Side = 'left' | 'right'
type Variant = 'sidebar' | 'floating' | 'inset'
type Collapsible = 'offcanvas' | 'icon' | 'none'

// `[&>svg]` / `[&>span:last-child]` can't see slotted children, so the same
// rules are repeated as `::slotted()` on the <slot> (as button.ts does).
const slottedIcon = '[&::slotted(svg)]:size-4 [&::slotted(svg)]:shrink-0'

/* ------------------------------------------------------------------ */
/* Base class: how a part reaches SidebarProvider's context            */
/* ------------------------------------------------------------------ */

/**
 * Every sidebar part (and <uip-sidebar> itself) finds its provider with
 * `closest('uip-sidebar-provider')` on connect and registers with it; the
 * provider calls `requestUpdate()` on every registered part when its state
 * changes (open / isMobile / openMobile) or when a <uip-sidebar>'s data
 * attributes change. That's React's `useSidebar()` context.
 *
 * React styles the parts through ancestor/sibling selectors on the Sidebar's
 * outer div (`group-data-[collapsible=icon]:…`, `peer-data-[variant=inset]:…`)
 * and on the menu item / menu button (`group/menu-item`, `peer/menu-button`).
 * Selectors don't cross shadow roots, so each part renders a *mirror* inside
 * its own shadow root: a `display: contents` wrapper (or a hidden sibling)
 * carrying the same classes and data attributes as React's ancestor/peer,
 * copied from the real <uip-sidebar> host. React's class strings then work
 * verbatim.
 */
abstract class SidebarElement extends LitElement {
  static styles = [sidebarTailwind, contents]

  protected abstract slotName: string
  /** The provider this part belongs to (React's `useSidebar()`). */
  provider: UipSidebarProvider | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', this.slotName)
    this.connectProvider()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.provider?.parts.delete(this)
    this.provider = null
  }

  private connectProvider() {
    const p = this.closest('uip-sidebar-provider')
    if (!p) return
    if (p instanceof UipSidebarProvider) {
      this.provider = p
      p.parts.add(this)
      this.requestUpdate()
    } else {
      customElements.whenDefined('uip-sidebar-provider').then(() => this.isConnected && this.connectProvider())
    }
  }

  /** React's `useSidebar().state`. */
  protected get sidebarState() {
    return this.provider?.state ?? 'expanded'
  }

  /**
   * React's `group` ancestor — the Sidebar's outer div — mirrored around
   * `content`, with the real <uip-sidebar> host's data attributes (none when
   * the sidebar is collapsible="none" or mobile, as in React).
   */
  protected group(content: unknown, extraClass = '', item?: UipSidebarMenuItem | null) {
    const s = this.closest('uip-sidebar')
    const a = (n: string) => s?.getAttribute(n) ?? nothing
    return html`<div
      class=${cn('group contents', extraClass)}
      data-state=${a('data-state')}
      data-collapsible=${a('data-collapsible')}
      data-variant=${a('data-variant')}
      data-side=${a('data-side')}
      ?data-hover=${!!item?.hover}
      ?data-focus-within=${!!item?.focusWithin}
    >
      ${content}
    </div>`
  }

  /** The menu item this part is a direct child of. */
  protected get item(): UipSidebarMenuItem | null {
    const p = this.parentElement
    return p instanceof UipSidebarMenuItem ? p : null
  }

  /**
   * React's `peer/menu-button` (the sibling SidebarMenuButton) mirrored as a
   * hidden element before the action / badge.
   */
  protected menuButtonPeer() {
    const b = this.item?.menuButton
    if (!b) return nothing
    return html`<div
      hidden
      class="peer/menu-button"
      data-size=${b.size}
      data-active=${String(b.isActive)}
      ?data-hover=${b.hovered}
    ></div>`
  }
}

/* ------------------------------------------------------------------ */
/* SidebarProvider                                                     */
/* ------------------------------------------------------------------ */

/**
 * <uip-sidebar-provider> — React's SidebarProvider (context + the
 * `sidebar-wrapper` div + TooltipProvider delayDuration=0).
 *
 *   <uip-sidebar-provider>
 *     <uip-sidebar collapsible="icon">…</uip-sidebar>
 *     <main>…<uip-sidebar-trigger></uip-sidebar-trigger></main>
 *   </uip-sidebar-provider>
 *
 * Props: `default-open` (default true; `default-open="false"` starts
 * collapsed), `open` (the live state; set `.open` to control it).
 * Events: `open-change` (detail: { open }) — React's `onOpenChange`, fired by
 * the trigger, the rail and Cmd/Ctrl+B. Like React, every change writes the
 * `sidebar_state` cookie (7 days); like React it is never read back (a server
 * can read it to render `default-open`).
 *
 * API (React's `useSidebar()`): `state` ('expanded' | 'collapsed'), `open`,
 * `setOpen(open)`, `isMobile` (viewport ≤ 768px), `openMobile`,
 * `setOpenMobile(open)`, `toggleSidebar()`.
 *
 * `--sidebar-width` / `--sidebar-width-icon` are set as inline style on the
 * host (as React sets them on the wrapper) unless the consumer's `style`
 * already sets them. The host is `display: contents`; React's `className`
 * goes on `::part(base)` (the wrapper div).
 */
export class UipSidebarProvider extends LitElement {
  static styles = [sidebarTailwind, contents]

  static properties = {
    open: { reflect: true, converter: trueByDefault },
    defaultOpen: { attribute: 'default-open', converter: trueByDefault },
    isMobile: { state: true },
    openMobile: { state: true },
  }

  open?: boolean
  defaultOpen = true
  isMobile = false
  openMobile = false

  /** Registered parts; re-rendered whenever the context changes. */
  readonly parts = new Set<LitElement>()
  private mql?: MediaQueryList

  constructor() {
    super()
    new ThemeController(this)
  }

  get state(): 'expanded' | 'collapsed' {
    return this.open ? 'expanded' : 'collapsed'
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'sidebar-wrapper')
    if (this.open === undefined) this.open = this.defaultOpen
    if (isServer) return
    if (!this.style.getPropertyValue('--sidebar-width')) this.style.setProperty('--sidebar-width', SIDEBAR_WIDTH)
    if (!this.style.getPropertyValue('--sidebar-width-icon'))
      this.style.setProperty('--sidebar-width-icon', SIDEBAR_WIDTH_ICON)
    this.mql = matchMedia(MOBILE_QUERY)
    this.mql.addEventListener('change', this.onMediaChange)
    this.onMediaChange()
    addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.mql?.removeEventListener('change', this.onMediaChange)
    removeEventListener('keydown', this.onKeyDown)
  }

  private onMediaChange = () => {
    this.isMobile = !!this.mql?.matches
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      this.toggleSidebar()
    }
  }

  setOpen(value: boolean) {
    this.open = value
    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: value }, bubbles: true, composed: true }))
  }

  setOpenMobile(value: boolean) {
    this.openMobile = value
  }

  toggleSidebar() {
    return this.isMobile ? this.setOpenMobile(!this.openMobile) : this.setOpen(!this.open)
  }

  /** Re-render the provider and every part (a sidebar's data attributes changed). */
  notify(source?: LitElement) {
    this.requestUpdate()
    this.parts.forEach((p) => p !== source && p.requestUpdate())
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('open') || changed.has('isMobile') || changed.has('openMobile')) {
      this.parts.forEach((p) => p.requestUpdate())
    }
  }

  render() {
    // React's `has-data-[variant=inset]:` looks at the wrapper's descendants;
    // slotted nodes aren't shadow-tree descendants, so mirror a match.
    const hasInset = !isServer && !!this.querySelector('[data-variant=inset]')
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="sidebar-wrapper"
      class="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full"
    >
      ${hasInset ? html`<i hidden data-variant="inset"></i>` : nothing}<slot></slot>
    </div>`
  }
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

/**
 * <uip-sidebar> — React's Sidebar.
 *
 * Props: `side` ('left' | 'right'), `variant` ('sidebar' | 'floating' |
 * 'inset'), `collapsible` ('offcanvas' | 'icon' | 'none').
 *
 * Like React it renders one of three branches: `collapsible="none"` → a plain
 * panel; viewport ≤ 768px → a <uip-sheet> (openMobile, 18rem wide, no close
 * button); otherwise the desktop gap + fixed panel. The host carries the
 * outer div's `data-state` / `data-collapsible` / `data-variant` /
 * `data-side` and the `group peer` classes, so light-DOM children can use
 * React's `group-data-[collapsible=icon]:hidden` from the page's Tailwind.
 *
 * Parts: `base` (React's className target: the fixed panel, or the plain
 * panel when collapsible="none"), `root` (outer div), `gap`, `inner`
 * (`data-sidebar="sidebar"`), `sheet` (mobile <uip-sheet>).
 */
export class UipSidebar extends SidebarElement {
  static properties = {
    side: { reflect: true },
    variant: { reflect: true },
    collapsible: { reflect: true },
  }

  protected slotName = 'sidebar'
  side: Side = 'left'
  variant: Variant = 'sidebar'
  collapsible: Collapsible = 'offcanvas'
  private signature = ''

  private get branch(): 'none' | 'mobile' | 'desktop' {
    if (this.collapsible === 'none') return 'none'
    return this.provider?.isMobile ? 'mobile' : 'desktop'
  }

  protected willUpdate() {
    const branch = this.branch
    const desktop = branch === 'desktop'
    const set = (n: string, v: string | null) => (v === null ? this.removeAttribute(n) : this.setAttribute(n, v))
    const state = this.sidebarState
    set('data-state', desktop ? state : null)
    set('data-collapsible', desktop ? (state === 'collapsed' ? this.collapsible : '') : null)
    set('data-variant', desktop ? this.variant : null)
    set('data-side', desktop ? this.side : null)
    set('data-sidebar', branch === 'mobile' ? 'sidebar' : null)
    set('data-mobile', branch === 'mobile' ? 'true' : null)
    this.classList.toggle('group', desktop)
    this.classList.toggle('peer', desktop)
  }

  protected updated() {
    const sig = ['data-state', 'data-collapsible', 'data-variant', 'data-side'].map((n) => this.getAttribute(n)).join('|')
    if (sig !== this.signature) {
      this.signature = sig
      this.provider?.notify(this)
    }
  }

  private onSheetOpenChange(e: CustomEvent<{ open: boolean }>) {
    // The inner sheet's event is an implementation detail, not the provider's
    // open-change.
    e.stopPropagation()
    this.provider?.setOpenMobile(e.detail.open)
  }

  render() {
    const branch = this.branch
    if (branch === 'none') {
      return html`<div
        part="base"
        data-uipkge=""
        data-slot="sidebar"
        class="bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col"
      >
        <slot></slot>
      </div>`
    }

    if (branch === 'mobile') {
      // React: SheetContent className + `--sidebar-width: 18rem`; `[&>button]:hidden`
      // hides the close button (show-close-button=false here).
      return html`<uip-sheet
        part="sheet"
        data-sidebar="sidebar"
        data-mobile="true"
        side=${this.side}
        .open=${!!this.provider?.openMobile}
        .showCloseButton=${false}
        hide-header
        heading="Sidebar"
        description="Displays the mobile sidebar."
        class="[--sidebar-width:18rem] [&::part(content)]:bg-sidebar [&::part(content)]:text-sidebar-foreground [&::part(content)]:w-(--sidebar-width) [&::part(content)]:p-0"
        @open-change=${this.onSheetOpenChange}
      >
        <div part="inner" class="flex h-full w-full flex-col"><slot></slot></div>
      </uip-sheet>`
    }

    const { side, variant, collapsible } = this
    const state = this.sidebarState
    return html`<div
      part="root"
      class="group peer text-sidebar-foreground hidden md:block"
      data-uipkge=""
      data-slot="sidebar"
      data-state=${state}
      data-collapsible=${state === 'collapsed' ? collapsible : ''}
      data-variant=${variant}
      data-side=${side}
    >
      <div
        part="gap"
        class=${cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      ></div>
      <div
        part="base"
        class=${cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        )}
      >
        <div
          part="inner"
          data-sidebar="sidebar"
          class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          <slot></slot>
        </div>
      </div>
    </div>`
  }
}

/* ------------------------------------------------------------------ */
/* SidebarTrigger / SidebarRail                                        */
/* ------------------------------------------------------------------ */

/**
 * <uip-sidebar-trigger> — React's SidebarTrigger: a ghost icon <uip-button>
 * (PanelLeft + sr-only "Toggle Sidebar") that calls `toggleSidebar()`.
 * Must be inside the provider. React's className → `::part(base)` (the
 * <uip-button>).
 */
export class UipSidebarTrigger extends SidebarElement {
  protected slotName = 'sidebar-trigger'

  render() {
    return html`<uip-button
      part="base"
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      class="[&::part(base)]:focus-visible:ring-ring [&::part(base)]:h-7 [&::part(base)]:w-7 [&::part(base)]:focus-visible:ring-2 [&::part(base)]:focus-visible:outline-none"
      @click=${() => this.provider?.toggleSidebar()}
      >${icon(PanelLeft, 'panel-left')}<span class="sr-only">Toggle Sidebar</span></uip-button
    >`
  }
}

/** <uip-sidebar-rail> — React's SidebarRail: the thin toggle strip on the sidebar's edge. */
export class UipSidebarRail extends SidebarElement {
  protected slotName = 'sidebar-rail'

  render() {
    return this.group(
      html`<button
        part="base"
        type="button"
        data-sidebar="rail"
        data-uipkge=""
        data-slot="sidebar-rail"
        aria-label="Toggle Sidebar"
        tabindex="-1"
        title="Toggle Sidebar"
        class=${cn(
          'hover:after:bg-sidebar-border focus-visible:ring-ring absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-colors duration-200 ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] focus-visible:ring-2 focus-visible:outline-none sm:flex',
          'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
          '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
          'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
          '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
          '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        )}
        @click=${() => this.provider?.toggleSidebar()}
      ></button>`,
    )
  }
}

/* ------------------------------------------------------------------ */
/* SidebarInset                                                        */
/* ------------------------------------------------------------------ */

/**
 * <uip-sidebar-inset> — React's SidebarInset (<main>). React's
 * `peer-data-[variant=inset]:…` reads the preceding Sidebar; the element
 * mirrors that sidebar's data attributes as a hidden `peer` sibling.
 */
export class UipSidebarInset extends SidebarElement {
  protected slotName = 'sidebar-inset'

  private get peerSidebar() {
    let s = this.previousElementSibling
    while (s && s.localName !== 'uip-sidebar') s = s.previousElementSibling
    return s
  }

  render() {
    const s = this.peerSidebar
    const a = (n: string) => s?.getAttribute(n) ?? nothing
    return html`<div
        hidden
        class="peer"
        data-state=${a('data-state')}
        data-collapsible=${a('data-collapsible')}
        data-variant=${a('data-variant')}
        data-side=${a('data-side')}
      ></div>
      <main
        part="base"
        data-uipkge=""
        data-slot="sidebar-inset"
        class=${cn(
          // min-w-0 is load-bearing: a flex-1 child without it inherits min-width: auto,
          // which means any single wide descendant (chart, table, code block) blows the
          // inset's width past its grid track. The upstream shadcn-ui sidebar omits this.
          'bg-background relative flex w-full min-w-0 flex-1 flex-col',
          'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        )}
      >
        <slot></slot>
      </main>`
  }
}

/* ------------------------------------------------------------------ */
/* SidebarInput / SidebarSeparator                                     */
/* ------------------------------------------------------------------ */

/**
 * <uip-sidebar-input> — React's SidebarInput: a <uip-input> with
 * `bg-background h-8 w-full shadow-none`. Forwards `value`, `placeholder`,
 * `type`, `name`, `disabled`, `aria-label`; `input` / `change` bubble from the
 * inner input (read `.value`).
 */
export class UipSidebarInput extends SidebarElement {
  static properties = {
    value: {},
    placeholder: {},
    type: {},
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
  }

  protected slotName = 'sidebar-input'
  value = ''
  placeholder?: string
  type = 'text'
  name?: string
  disabled = false
  accessibleLabel?: string

  render() {
    return html`<uip-input
      part="base"
      data-sidebar="input"
      class="w-full [&::part(control)]:bg-background [&::part(control)]:h-8 [&::part(control)]:shadow-none"
      .value=${live(this.value)}
      type=${this.type}
      name=${this.name ?? nothing}
      placeholder=${this.placeholder ?? nothing}
      aria-label=${this.accessibleLabel ?? nothing}
      ?disabled=${this.disabled}
      @input=${(e: Event) => (this.value = (e.currentTarget as HTMLInputElement).value)}
    ></uip-input>`
  }
}

/** <uip-sidebar-separator> — React's SidebarSeparator (a <uip-separator>). */
export class UipSidebarSeparator extends SidebarElement {
  protected slotName = 'sidebar-separator'

  render() {
    return html`<uip-separator
      part="base"
      data-sidebar="separator"
      class="[&::part(base)]:bg-sidebar-border [&::part(base)]:mx-2 [&::part(base)]:w-auto"
    ></uip-separator>`
  }
}

/* ------------------------------------------------------------------ */
/* Layout parts                                                        */
/* ------------------------------------------------------------------ */

/** <uip-sidebar-header> — React's SidebarHeader. */
export class UipSidebarHeader extends SidebarElement {
  protected slotName = 'sidebar-header'
  render() {
    return html`<div part="base" data-uipkge="" data-slot="sidebar-header" data-sidebar="header" class="flex flex-col gap-2 p-2">
      <slot></slot>
    </div>`
  }
}

/** <uip-sidebar-footer> — React's SidebarFooter. */
export class UipSidebarFooter extends SidebarElement {
  protected slotName = 'sidebar-footer'
  render() {
    return html`<div part="base" data-uipkge="" data-slot="sidebar-footer" data-sidebar="footer" class="flex flex-col gap-2 p-2">
      <slot></slot>
    </div>`
  }
}

/** <uip-sidebar-content> — React's SidebarContent (the scrolling middle). */
export class UipSidebarContent extends SidebarElement {
  protected slotName = 'sidebar-content'
  render() {
    return this.group(
      html`<div
        part="base"
        data-uipkge=""
        data-slot="sidebar-content"
        data-sidebar="content"
        class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden"
      >
        <slot></slot>
      </div>`,
    )
  }
}

/** <uip-sidebar-group> — React's SidebarGroup. */
export class UipSidebarGroup extends SidebarElement {
  protected slotName = 'sidebar-group'
  render() {
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="sidebar-group"
      data-sidebar="group"
      class="relative flex w-full min-w-0 flex-col p-2"
    >
      <slot></slot>
    </div>`
  }
}

/** <uip-sidebar-group-label> — React's SidebarGroupLabel (fades out in icon mode). */
export class UipSidebarGroupLabel extends SidebarElement {
  protected slotName = 'sidebar-group-label'
  render() {
    return this.group(
      html`<div
        part="base"
        data-uipkge=""
        data-slot="sidebar-group-label"
        data-sidebar="group-label"
        class=${cn(
          'text-sidebar-foreground/70 ring-sidebar-ring mt-2 mb-1 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
          'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        )}
      >
        <slot class=${slottedIcon}></slot>
      </div>`,
    )
  }
}

/** <uip-sidebar-group-action> — React's SidebarGroupAction (icon button in the group's corner). */
export class UipSidebarGroupAction extends SidebarElement {
  static properties = { accessibleLabel: { attribute: 'aria-label' } }
  protected slotName = 'sidebar-group-action'
  accessibleLabel?: string
  render() {
    return this.group(
      html`<button
        part="base"
        type="button"
        data-uipkge=""
        data-slot="sidebar-group-action"
        data-sidebar="group-action"
        aria-label=${this.accessibleLabel ?? nothing}
        class=${cn(
          'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
          'after:absolute after:-inset-2 md:after:hidden',
          'group-data-[collapsible=icon]:hidden',
        )}
      >
        <slot class=${slottedIcon}></slot>
      </button>`,
    )
  }
}

/** <uip-sidebar-group-content> — React's SidebarGroupContent. */
export class UipSidebarGroupContent extends SidebarElement {
  protected slotName = 'sidebar-group-content'
  render() {
    return html`<div part="base" data-uipkge="" data-slot="sidebar-group-content" data-sidebar="group-content" class="w-full text-sm">
      <slot></slot>
    </div>`
  }
}

/* ------------------------------------------------------------------ */
/* SidebarMenu family                                                  */
/* ------------------------------------------------------------------ */

/** <uip-sidebar-menu> — React's SidebarMenu (<ul>). Children: <uip-sidebar-menu-item>. */
export class UipSidebarMenu extends SidebarElement {
  protected slotName = 'sidebar-menu'
  render() {
    return html`<ul part="base" data-uipkge="" data-slot="sidebar-menu" data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
      <slot></slot>
    </ul>`
  }
}

/**
 * <uip-sidebar-menu-item> — React's SidebarMenuItem (<li class="group/menu-item">).
 * Its direct children (menu button, action, badge, sub menu) can't see the
 * <li>'s `:hover` / `:focus-within` / `:has()` across shadow roots, so the
 * item tracks hover and focus-within and re-renders them.
 */
export class UipSidebarMenuItem extends SidebarElement {
  protected slotName = 'sidebar-menu-item'
  hover = false
  focusWithin = false

  get menuButton(): UipSidebarMenuButton | null {
    return this.querySelector(':scope > uip-sidebar-menu-button')
  }

  get hasAction() {
    return !!this.querySelector(':scope > uip-sidebar-menu-action')
  }

  /** Re-render the item's direct sidebar children. */
  refresh(source?: Element) {
    for (const c of this.children) if (c !== source && c instanceof SidebarElement) c.requestUpdate()
  }

  private setHover(v: boolean) {
    if (this.hover === v) return
    this.hover = v
    this.refresh()
  }

  private setFocusWithin(v: boolean) {
    if (this.focusWithin === v) return
    this.focusWithin = v
    this.refresh()
  }

  render() {
    return html`<li
      part="base"
      data-uipkge=""
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      class="group/menu-item relative"
      @pointerenter=${(e: PointerEvent) => e.pointerType !== 'touch' && this.setHover(true)}
      @pointerleave=${() => this.setHover(false)}
      @focusin=${() => this.setFocusWithin(true)}
      @focusout=${(e: FocusEvent) => {
        const next = e.relatedTarget as Node | null
        if (!next || !this.contains(next)) this.setFocusWithin(false)
      }}
    >
      <slot @slotchange=${() => this.refresh()}></slot>
    </li>`
  }
}

type MenuButtonVariant = NonNullable<SidebarMenuButtonVariants['variant']>
type MenuButtonSize = NonNullable<SidebarMenuButtonVariants['size']>

/**
 * <uip-sidebar-menu-button> — React's SidebarMenuButton.
 *
 * Props: `is-active`, `variant` ('default' | 'outline'), `size` ('default' |
 * 'sm' | 'lg'), `tooltip` (text; shown on the right only while the sidebar is
 * collapsed and not mobile, like React), `disabled`, `aria-label`, and
 * `href` / `target` (renders an <a> — the stand-in for React's `asChild`).
 */
export class UipSidebarMenuButton extends SidebarElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static properties = {
    isActive: { type: Boolean, attribute: 'is-active', reflect: true },
    variant: { reflect: true },
    size: { reflect: true },
    tooltip: {},
    disabled: { type: Boolean, reflect: true },
    href: {},
    target: {},
    accessibleLabel: { attribute: 'aria-label' },
  }

  protected slotName = 'sidebar-menu-button'
  isActive = false
  variant: MenuButtonVariant = 'default'
  size: MenuButtonSize = 'default'
  tooltip?: string
  disabled = false
  href?: string
  target?: string
  accessibleLabel?: string
  /** Pointer is over the button (mirrored to the action/badge as `peer-hover`). */
  hovered = false

  private setHovered(v: boolean) {
    if (this.hovered === v) return
    this.hovered = v
    this.item?.refresh()
  }

  protected updated(changed: Map<string, unknown>) {
    // The sibling action / badge mirror size + active.
    if (changed.has('size') || changed.has('isActive')) this.item?.refresh(this)
  }

  render() {
    const item = this.item
    const classes = cn(sidebarMenuButtonVariants({ variant: this.variant, size: this.size }))
    const slot = html`<slot
      class="${slottedIcon} [&::slotted(svg)]:text-sidebar-foreground/70 [&::slotted(span:last-child)]:truncate"
    ></slot>`
    const enter = (e: PointerEvent) => e.pointerType !== 'touch' && this.setHovered(true)
    const leave = () => this.setHovered(false)
    const button = this.href
      ? html`<a
          part="base"
          data-uipkge=""
          data-slot="sidebar-menu-button"
          data-sidebar="menu-button"
          data-size=${this.size}
          data-active=${String(this.isActive)}
          href=${this.disabled ? nothing : this.href}
          target=${this.target ?? nothing}
          aria-disabled=${this.disabled ? 'true' : nothing}
          aria-label=${this.accessibleLabel ?? nothing}
          class=${classes}
          @pointerenter=${enter}
          @pointerleave=${leave}
          >${slot}</a
        >`
      : html`<button
          part="base"
          type="button"
          data-uipkge=""
          data-slot="sidebar-menu-button"
          data-sidebar="menu-button"
          data-size=${this.size}
          data-active=${String(this.isActive)}
          ?disabled=${this.disabled}
          aria-label=${this.accessibleLabel ?? nothing}
          class=${classes}
          @pointerenter=${enter}
          @pointerleave=${leave}
        >
          ${slot}
        </button>`
    const hidden = this.sidebarState !== 'collapsed' || !!this.provider?.isMobile
    const content = this.tooltip
      ? html`<uip-tooltip
          class="contents"
          content=${this.tooltip}
          side="right"
          align="center"
          delay-duration="0"
          ?disabled=${hidden}
          >${button}</uip-tooltip
        >`
      : button
    // `group-has-data-[sidebar=menu-action]/menu-item:pr-8` needs an action
    // inside the item: mirror one.
    return this.group(
      [item?.hasAction ? html`<i hidden data-sidebar="menu-action"></i>` : html``, content],
      'group/menu-item',
      item,
    )
  }
}

/**
 * <uip-sidebar-menu-action> — React's SidebarMenuAction (icon button at the
 * row's right edge). `show-on-hover` reveals it only on row hover / focus
 * (≥ md), like React. `aria-label` is forwarded.
 */
export class UipSidebarMenuAction extends SidebarElement {
  static properties = {
    showOnHover: { type: Boolean, attribute: 'show-on-hover' },
    accessibleLabel: { attribute: 'aria-label' },
  }
  protected slotName = 'sidebar-menu-action'
  showOnHover = false
  accessibleLabel?: string

  render() {
    return this.group(
      [
        this.menuButtonPeer(),
        html`<button
          part="base"
          type="button"
          data-uipkge=""
          data-slot="sidebar-menu-action"
          data-sidebar="menu-action"
          aria-label=${this.accessibleLabel ?? nothing}
          class=${cn(
            'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
            'after:absolute after:-inset-2 md:after:hidden',
            'peer-data-[size=sm]/menu-button:top-1',
            'peer-data-[size=default]/menu-button:top-1.5',
            'peer-data-[size=lg]/menu-button:top-2.5',
            'group-data-[collapsible=icon]:hidden',
            this.showOnHover &&
              'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
            // Shadow adaptation: :hover / :focus-within of the item and the
            // sibling button can't be matched from here; the mirrors carry
            // data-hover / data-focus-within instead.
            'peer-data-[hover]/menu-button:text-sidebar-accent-foreground',
            this.showOnHover && 'group-data-[focus-within]/menu-item:opacity-100 group-data-[hover]/menu-item:opacity-100',
          )}
        >
          <slot class=${slottedIcon}></slot>
        </button>`,
      ],
      'group/menu-item',
      this.item,
    )
  }
}

/** <uip-sidebar-menu-badge> — React's SidebarMenuBadge (count at the row's right edge). */
export class UipSidebarMenuBadge extends SidebarElement {
  protected slotName = 'sidebar-menu-badge'
  render() {
    return this.group([
      this.menuButtonPeer(),
      html`<div
        part="base"
        data-uipkge=""
        data-slot="sidebar-menu-badge"
        data-sidebar="menu-badge"
        class=${cn(
          'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
          'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
          'peer-data-[size=sm]/menu-button:top-1',
          'peer-data-[size=default]/menu-button:top-1.5',
          'peer-data-[size=lg]/menu-button:top-2.5',
          'group-data-[collapsible=icon]:hidden',
          // Shadow adaptation (see menu-action).
          'peer-data-[hover]/menu-button:text-sidebar-accent-foreground',
        )}
      >
        <slot></slot>
      </div>`,
    ])
  }
}

/**
 * <uip-sidebar-menu-skeleton> — React's SidebarMenuSkeleton: optional icon
 * block (`show-icon`) and a text bar `width` wide (default 70%).
 */
export class UipSidebarMenuSkeleton extends SidebarElement {
  static properties = {
    showIcon: { type: Boolean, attribute: 'show-icon' },
    width: {},
  }
  protected slotName = 'sidebar-menu-skeleton'
  showIcon = false
  width = '70%'

  render() {
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      class="flex h-8 items-center gap-2 rounded-md px-2"
    >
      ${this.showIcon ? html`<uip-skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon"></uip-skeleton>` : nothing}
      <uip-skeleton
        class="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style=${styleMap({ '--skeleton-width': this.width })}
      ></uip-skeleton>
    </div>`
  }
}

/**
 * <uip-sidebar-menu-sub> — React's SidebarMenuSub (indented child <ul>).
 * React tags it `data-sidebar="menu-badge"`; kept verbatim.
 */
export class UipSidebarMenuSub extends SidebarElement {
  protected slotName = 'sidebar-menu-sub'
  render() {
    return this.group(
      html`<ul
        part="base"
        data-uipkge=""
        data-slot="sidebar-menu-sub"
        data-sidebar="menu-badge"
        class=${cn(
          'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
          'group-data-[collapsible=icon]:hidden',
        )}
      >
        <slot></slot>
      </ul>`,
    )
  }
}

/** <uip-sidebar-menu-sub-item> — React's SidebarMenuSubItem (<li>). */
export class UipSidebarMenuSubItem extends SidebarElement {
  protected slotName = 'sidebar-menu-sub-item'
  render() {
    return html`<li
      part="base"
      data-uipkge=""
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      class="group/menu-sub-item relative"
    >
      <slot></slot>
    </li>`
  }
}

/**
 * <uip-sidebar-menu-sub-button> — React's SidebarMenuSubButton (an <a>).
 * Props: `href`, `target`, `size` ('sm' | 'md'), `is-active`, `aria-label`.
 */
export class UipSidebarMenuSubButton extends SidebarElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static properties = {
    href: {},
    target: {},
    size: { reflect: true },
    isActive: { type: Boolean, attribute: 'is-active', reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
  }
  protected slotName = 'sidebar-menu-sub-button'
  href?: string
  target?: string
  size: 'sm' | 'md' = 'md'
  isActive = false
  accessibleLabel?: string

  render() {
    const size = this.size
    return this.group(
      html`<a
        part="base"
        data-uipkge=""
        data-slot="sidebar-menu-sub-button"
        data-sidebar="menu-sub-button"
        data-size=${size}
        data-active=${String(this.isActive)}
        href=${this.href ?? nothing}
        target=${this.target ?? nothing}
        aria-label=${this.accessibleLabel ?? nothing}
        class=${cn(
          'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
          'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          'group-data-[collapsible=icon]:hidden',
        )}
        ><slot
          class="${slottedIcon} [&::slotted(svg)]:text-sidebar-accent-foreground [&::slotted(span:last-child)]:truncate"
        ></slot
      ></a>`,
    )
  }
}

/* ------------------------------------------------------------------ */
/* Registration (provider first, so parts find an upgraded provider)   */
/* ------------------------------------------------------------------ */

const define = (tag: string, cls: CustomElementConstructor) => customElements.get(tag) || customElements.define(tag, cls)
define('uip-sidebar-provider', UipSidebarProvider)
define('uip-sidebar', UipSidebar)
define('uip-sidebar-trigger', UipSidebarTrigger)
define('uip-sidebar-rail', UipSidebarRail)
define('uip-sidebar-inset', UipSidebarInset)
define('uip-sidebar-input', UipSidebarInput)
define('uip-sidebar-separator', UipSidebarSeparator)
define('uip-sidebar-header', UipSidebarHeader)
define('uip-sidebar-footer', UipSidebarFooter)
define('uip-sidebar-content', UipSidebarContent)
define('uip-sidebar-group', UipSidebarGroup)
define('uip-sidebar-group-label', UipSidebarGroupLabel)
define('uip-sidebar-group-action', UipSidebarGroupAction)
define('uip-sidebar-group-content', UipSidebarGroupContent)
define('uip-sidebar-menu', UipSidebarMenu)
define('uip-sidebar-menu-item', UipSidebarMenuItem)
define('uip-sidebar-menu-button', UipSidebarMenuButton)
define('uip-sidebar-menu-action', UipSidebarMenuAction)
define('uip-sidebar-menu-badge', UipSidebarMenuBadge)
define('uip-sidebar-menu-skeleton', UipSidebarMenuSkeleton)
define('uip-sidebar-menu-sub', UipSidebarMenuSub)
define('uip-sidebar-menu-sub-item', UipSidebarMenuSubItem)
define('uip-sidebar-menu-sub-button', UipSidebarMenuSubButton)

declare global {
  interface HTMLElementTagNameMap {
    'uip-sidebar-provider': UipSidebarProvider
    'uip-sidebar': UipSidebar
    'uip-sidebar-trigger': UipSidebarTrigger
    'uip-sidebar-rail': UipSidebarRail
    'uip-sidebar-inset': UipSidebarInset
    'uip-sidebar-input': UipSidebarInput
    'uip-sidebar-separator': UipSidebarSeparator
    'uip-sidebar-header': UipSidebarHeader
    'uip-sidebar-footer': UipSidebarFooter
    'uip-sidebar-content': UipSidebarContent
    'uip-sidebar-group': UipSidebarGroup
    'uip-sidebar-group-label': UipSidebarGroupLabel
    'uip-sidebar-group-action': UipSidebarGroupAction
    'uip-sidebar-group-content': UipSidebarGroupContent
    'uip-sidebar-menu': UipSidebarMenu
    'uip-sidebar-menu-item': UipSidebarMenuItem
    'uip-sidebar-menu-button': UipSidebarMenuButton
    'uip-sidebar-menu-action': UipSidebarMenuAction
    'uip-sidebar-menu-badge': UipSidebarMenuBadge
    'uip-sidebar-menu-skeleton': UipSidebarMenuSkeleton
    'uip-sidebar-menu-sub': UipSidebarMenuSub
    'uip-sidebar-menu-sub-item': UipSidebarMenuSubItem
    'uip-sidebar-menu-sub-button': UipSidebarMenuSubButton
  }
}
