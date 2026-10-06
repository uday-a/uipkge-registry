import {
  type AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button/button.variants'
import { UiInputComponent } from '@/ui/input/input.component'
import {
  UiSheetComponent,
  UiSheetContentComponent,
  UiSheetDescriptionComponent,
  UiSheetHeaderComponent,
  UiSheetTitleComponent,
} from '@/ui/sheet/sheet.component'
import { UiSkeletonComponent } from '@/ui/skeleton/skeleton.component'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { UI_TOOLTIP_CONFIG, UiTooltipDirective } from '@/ui/tooltip/tooltip.component'
import { sidebarMenuButtonVariants } from './sidebar.variants'
import {
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
} from './sidebar-context'
import type { SidebarCollapsible, SidebarSide, SidebarState, SidebarVariant } from './sidebar-context'

/**
 * Angular port of the UIPKGE Sidebar, 1:1 with the React / Vue primitive:
 * - SidebarProvider owns the state and shares it through DI (`injectSidebar()` is
 *   React's `useSidebar()`): open / state / isMobile / openMobile / setOpen /
 *   setOpenMobile / toggleSidebar, Cmd/Ctrl+B, the `sidebar_state` cookie, and a
 *   0ms tooltip delay for everything inside.
 * - Sidebar renders the desktop gap + fixed rail (offcanvas / icon / none), or a
 *   Sheet below 768px -- exactly the React markup, so the same Tailwind classes apply.
 * - Trigger / Rail toggle the provider; MenuButton shows its tooltip only on the
 *   collapsed icon rail.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-provider, [ui-sidebar-provider]',
  standalone: true,
  providers: [
    {
      provide: UI_TOOLTIP_CONFIG,
      useValue: { delayDuration: 0, skipDelayDuration: 300, disableHoverableContent: false },
    },
  ],
  host: {
    '[attr.data-slot]': '"sidebar-wrapper"',
    '[attr.data-uipkge]': '""',
    '[style.--sidebar-width]': 'sidebarWidth',
    '[style.--sidebar-width-icon]': 'sidebarWidthIcon',
    '[class]': 'hostClass',
    '(window:keydown)': 'onKeydown($event)',
  },
  template: `<ng-content />`,
})
export class UiSidebarProviderComponent implements OnInit {
  @Input() defaultOpen = true
  /** Controlled open state (pair with openChange); omit for uncontrolled. */
  @Input('open') controlledOpen?: boolean
  @Output() openChange = new EventEmitter<boolean>()
  @Input('class') className?: string

  readonly sidebarWidth = SIDEBAR_WIDTH
  readonly sidebarWidthIcon = SIDEBAR_WIDTH_ICON
  private readonly _open = signal(true)
  private readonly _isMobile = signal(false)
  private readonly _openMobile = signal(false)

  constructor() {
    // Viewport detection runs client-side only (SSR renders the desktop branch, as React does).
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mql = window.matchMedia('(max-width: 768px)')
      const onChange = () => this._isMobile.set(mql.matches)
      onChange()
      mql.addEventListener('change', onChange)
      inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', onChange))
    }
  }

  ngOnInit(): void {
    this._open.set(this.defaultOpen)
  }

  get open(): boolean {
    return this.controlledOpen ?? this._open()
  }

  get state(): SidebarState {
    return this.open ? 'expanded' : 'collapsed'
  }

  get isMobile(): boolean {
    return this._isMobile()
  }

  get openMobile(): boolean {
    return this._openMobile()
  }

  get hostClass(): string {
    return cn('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', this.className)
  }

  setOpen(value: boolean): void {
    if (this.controlledOpen === undefined) this._open.set(value)
    this.openChange.emit(value)
    // Persist like React / Vue so server renders can restore it.
    if (typeof document !== 'undefined') {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }

  setOpenMobile(value: boolean): void {
    this._openMobile.set(value)
  }

  toggleSidebar(): void {
    if (this.isMobile) this.setOpenMobile(!this.openMobile)
    else this.setOpen(!this.open)
  }

  matchesShortcut(event: { key: string; metaKey?: boolean; ctrlKey?: boolean }): boolean {
    return event.key === SIDEBAR_KEYBOARD_SHORTCUT && !!(event.metaKey || event.ctrlKey)
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.matchesShortcut(event)) {
      event.preventDefault()
      this.toggleSidebar()
    }
  }
}

/** React's `useSidebar()`: the nearest provider, or a clear error when there is none. */
export function injectSidebar(): UiSidebarProviderComponent {
  const sidebar = inject(UiSidebarProviderComponent, { optional: true })
  if (!sidebar) throw new Error('injectSidebar() must be used within a <ui-sidebar-provider>.')
  return sidebar
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar, [ui-sidebar]',
  standalone: true,
  imports: [
    UiRenderTemplateDirective,
    UiSheetComponent,
    UiSheetContentComponent,
    UiSheetHeaderComponent,
    UiSheetTitleComponent,
    UiSheetDescriptionComponent,
  ],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': 'mode === "mobile" ? null : "sidebar"',
    '[attr.data-state]': 'mode === "desktop" ? sidebar.state : null',
    '[attr.data-collapsible]': 'mode === "desktop" ? (sidebar.state === "collapsed" ? collapsible : "") : null',
    '[attr.data-variant]': 'mode === "desktop" ? variant : null',
    '[attr.data-side]': 'mode === "desktop" ? side : null',
    '[class]': 'hostClass',
  },
  template: `
    <ng-template #body><ng-content /></ng-template>
    @switch (mode) {
      @case ('none') {
        <ng-container [uiRenderTemplate]="body" />
      }
      @case ('mobile') {
        <ui-sheet [open]="sidebar.openMobile" (openChange)="sidebar.setOpenMobile($event)">
          <ui-sheet-content
            [side]="side"
            [attributes]="mobileAttributes"
            class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          >
            <ui-sheet-header class="sr-only">
              <ui-sheet-title>Sidebar</ui-sheet-title>
              <ui-sheet-description>Displays the mobile sidebar.</ui-sheet-description>
            </ui-sheet-header>
            <div class="flex h-full w-full flex-col"><ng-container [uiRenderTemplate]="body" /></div>
          </ui-sheet-content>
        </ui-sheet>
      }
      @default {
        <!-- This is what handles the sidebar gap on desktop -->
        <div [class]="gapClass"></div>
        <div [class]="containerClass">
          <div
            data-sidebar="sidebar"
            class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
          >
            <ng-container [uiRenderTemplate]="body" />
          </div>
        </div>
      }
    }
  `,
})
export class UiSidebarComponent implements AfterViewInit {
  readonly sidebar = injectSidebar()
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  /** Static `class="..."` tokens from the template (React's className goes to the inner container). */
  private readonly staticClasses = [...this.el.classList]
  @Input() side: SidebarSide = 'left'
  @Input() variant: SidebarVariant = 'sidebar'
  @Input() collapsible: SidebarCollapsible = 'offcanvas'
  @Input('class') className?: string

  readonly mobileAttributes = {
    'data-sidebar': 'sidebar',
    'data-slot': 'sidebar',
    'data-mobile': 'true',
    style: `--sidebar-width: ${SIDEBAR_WIDTH_MOBILE}`,
  }

  /**
   * Angular always applies a static class attribute to the host; React only puts className on
   * the fixed container (desktop) or the sheet (mobile). Drop the static tokens the host class
   * does not contain after the first render -- later host-class diffs keep it that way.
   */
  ngAfterViewInit(): void {
    const keep = new Set(this.hostClass.split(/\s+/))
    for (const token of this.staticClasses) if (!keep.has(token)) this.el.classList.remove(token)
  }

  get mode(): 'none' | 'mobile' | 'desktop' {
    if (this.collapsible === 'none') return 'none'
    return this.sidebar.isMobile ? 'mobile' : 'desktop'
  }

  get hostClass(): string {
    if (this.mode === 'none')
      return cn('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', this.className)
    // Mobile renders only the portalled Sheet, like React: the host takes no space.
    if (this.mode === 'mobile') return 'contents'
    return 'group peer text-sidebar-foreground hidden md:block'
  }

  get gapClass(): string {
    return cn(
      'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
      'group-data-[collapsible=offcanvas]:w-0',
      'group-data-[side=right]:rotate-180',
      this.variant === 'floating' || this.variant === 'inset'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    )
  }

  get containerClass(): string {
    return cn(
      'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
      this.side === 'left'
        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
      // Adjust the padding for floating and inset variants.
      this.variant === 'floating' || this.variant === 'inset'
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
      this.className,
    )
  }
}

/** Native buttons/anchors keep their semantics; custom-element hosts get button semantics. */
function buttonSemantics(el: HTMLElement): { role: string | null; tabindex: string | null } {
  const native = el.tagName === 'BUTTON' || el.tagName === 'A'
  return { role: native ? null : 'button', tabindex: native ? null : '0' }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-trigger, [ui-sidebar-trigger]',
  standalone: true,
  host: {
    '[attr.data-sidebar]': '"trigger"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-trigger"',
    '[attr.role]': 'semantics.role',
    '[attr.tabindex]': 'semantics.tabindex',
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[class]': 'hostClass',
    '(click)': 'onToggle()',
    '(keydown.enter)': 'onKey($event)',
    '(keydown.space)': 'onKey($event)',
  },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
    <span class="sr-only">Toggle Sidebar</span>
    <ng-content />
  `,
})
export class UiSidebarTriggerComponent {
  private readonly sidebar = injectSidebar()
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly semantics = buttonSemantics(this.el)
  readonly isNativeButton = this.el.tagName === 'BUTTON'
  @Input('class') className?: string
  @Output() toggle = new EventEmitter<void>()

  get hostClass(): string {
    return cn(
      buttonVariants({ variant: 'ghost', size: 'icon' }),
      'focus-visible:ring-ring h-7 w-7 focus-visible:ring-2 focus-visible:outline-none',
      this.className,
    )
  }

  onToggle(): void {
    this.toggle.emit()
    this.sidebar.toggleSidebar()
  }

  onKey(event: Event): void {
    if (this.isNativeButton) return
    event.preventDefault()
    this.onToggle()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-rail, [ui-sidebar-rail]',
  standalone: true,
  host: {
    '[attr.data-sidebar]': '"rail"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-rail"',
    '[attr.aria-label]': '"Toggle Sidebar"',
    '[attr.title]': '"Toggle Sidebar"',
    '[attr.tabindex]': '"-1"',
    '[attr.role]': 'isNativeButton ? null : "button"',
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[class]': 'hostClass',
    '(click)': 'onToggle()',
  },
  template: `<ng-content />`,
})
export class UiSidebarRailComponent {
  private readonly sidebar = injectSidebar()
  readonly isNativeButton = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON'
  @Input('class') className?: string
  @Output() toggle = new EventEmitter<void>()

  get hostClass(): string {
    return cn(
      'hover:after:bg-sidebar-border focus-visible:ring-ring absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-colors duration-200 ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] focus-visible:ring-2 focus-visible:outline-none sm:flex',
      'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
      '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
      'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
      '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
      '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
      this.className,
    )
  }

  onToggle(): void {
    this.toggle.emit()
    this.sidebar.toggleSidebar()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-inset, [ui-sidebar-inset]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-inset"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarInsetComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      // min-w-0 is load-bearing: a flex-1 child without it inherits min-width: auto,
      // which means any single wide descendant (chart, table, code block) blows the
      // inset's width past its grid track. The upstream shadcn-ui sidebar omits this.
      'bg-background relative flex w-full min-w-0 flex-1 flex-col',
      'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-input, [ui-sidebar-input]',
  standalone: true,
  imports: [UiInputComponent],
  host: { class: 'contents' },
  template: `
    <ui-input
      data-uipkge=""
      data-slot="sidebar-input"
      data-sidebar="input"
      [value]="value"
      [placeholder]="placeholder"
      [class]="inputClass"
      (valueChange)="valueChange.emit($event)"
    />
  `,
})
export class UiSidebarInputComponent {
  @Input() value?: string
  @Input() placeholder = ''
  @Input('class') className?: string
  @Output() valueChange = new EventEmitter<string>()

  get inputClass(): string {
    return cn('bg-background h-8 w-full shadow-none', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-header, [ui-sidebar-header]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-header"',
    '[attr.data-sidebar]': '"header"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col gap-2 p-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-footer, [ui-sidebar-footer]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-footer"',
    '[attr.data-sidebar]': '"footer"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarFooterComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col gap-2 p-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-separator, [ui-sidebar-separator]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-separator"',
    '[attr.data-sidebar]': '"separator"',
    '[attr.role]': '"separator"',
    '[attr.data-orientation]': '"horizontal"',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiSidebarSeparatorComponent {
  @Input('class') className?: string

  get hostClass(): string {
    // The React part wraps <Separator>; same base classes + the sidebar overrides.
    return cn(
      'bg-border block shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      'bg-sidebar-border mx-2 w-auto',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-content, [ui-sidebar-content]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-content"',
    '[attr.data-sidebar]': '"content"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarContentComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-group, [ui-sidebar-group]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-group"',
    '[attr.data-sidebar]': '"group"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarGroupComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('relative flex w-full min-w-0 flex-col p-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-group-label, [ui-sidebar-group-label]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-group-label"',
    '[attr.data-sidebar]': '"group-label"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarGroupLabelComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-sidebar-foreground/70 ring-sidebar-ring mt-2 mb-1 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg,&>lucide-icon>svg]:size-4 [&>svg,&>lucide-icon>svg]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-group-action, [ui-sidebar-group-action]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-group-action"',
    '[attr.data-sidebar]': '"group-action"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarGroupActionComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg,&>lucide-icon>svg]:size-4 [&>svg,&>lucide-icon>svg]:shrink-0',
      'after:absolute after:-inset-2 md:after:hidden',
      'group-data-[collapsible=icon]:hidden',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-group-content, [ui-sidebar-group-content]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-group-content"',
    '[attr.data-sidebar]': '"group-content"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarGroupContentComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block w-full text-sm', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu, [ui-sidebar-menu]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu"',
    '[attr.data-sidebar]': '"menu"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex w-full min-w-0 flex-col gap-1', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-item, [ui-sidebar-menu-item]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-item"',
    '[attr.data-sidebar]': '"menu-item"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuItemComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('group/menu-item relative block', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-button, [ui-sidebar-menu-button]',
  standalone: true,
  // React's `tooltip` prop: a right-side tooltip shown only on the collapsed icon rail.
  hostDirectives: [{ directive: UiTooltipDirective, inputs: ['uiTooltip: tooltip'] }],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-button"',
    '[attr.data-sidebar]': '"menu-button"',
    '[attr.data-size]': 'size',
    '[attr.data-active]': 'isActive',
    '[attr.role]': 'semantics.role',
    '[attr.tabindex]': 'semantics.tabindex',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuButtonComponent {
  private readonly sidebar = injectSidebar()
  readonly semantics = buttonSemantics(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement)
  @Input() variant: 'default' | 'outline' = 'default'
  @Input() size: 'default' | 'sm' | 'lg' = 'default'
  @Input({ transform: booleanAttribute }) isActive = false
  @Input('class') className?: string

  constructor() {
    const tooltip = inject(UiTooltipDirective, { self: true })
    tooltip.tooltipSide = 'right'
    tooltip.tooltipAlign = 'center'
    tooltip.disabledWhen = () => this.sidebar.state !== 'collapsed' || this.sidebar.isMobile
  }

  get hostClass(): string {
    return cn(sidebarMenuButtonVariants({ variant: this.variant, size: this.size }), this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-action, [ui-sidebar-menu-action]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-action"',
    '[attr.data-sidebar]': '"menu-action"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuActionComponent {
  @Input({ transform: booleanAttribute }) showOnHover = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg,&>lucide-icon>svg]:size-4 [&>svg,&>lucide-icon>svg]:shrink-0',
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      this.showOnHover &&
        'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-badge, [ui-sidebar-menu-badge]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-badge"',
    '[attr.data-sidebar]': '"menu-badge"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuBadgeComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
      'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-skeleton, [ui-sidebar-menu-skeleton]',
  standalone: true,
  imports: [UiSkeletonComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-skeleton"',
    '[attr.data-sidebar]': '"menu-skeleton"',
    '[class]': 'hostClass',
  },
  template: `
    @if (showIcon) {
      <ui-skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
    }
    <ui-skeleton
      class="h-4 max-w-(--skeleton-width) flex-1"
      data-sidebar="menu-skeleton-text"
      [style.--skeleton-width]="width"
    />
  `,
})
export class UiSidebarMenuSkeletonComponent {
  @Input({ transform: booleanAttribute }) showIcon = false
  @Input() width = '70%'
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex h-8 items-center gap-2 rounded-md px-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-sub, [ui-sidebar-menu-sub]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-sub"',
    '[attr.data-sidebar]': '"menu-badge"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuSubComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-sub-item, [ui-sidebar-menu-sub-item]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-sub-item"',
    '[attr.data-sidebar]': '"menu-sub-item"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuSubItemComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('group/menu-sub-item relative block', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sidebar-menu-sub-button, [ui-sidebar-menu-sub-button]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"sidebar-menu-sub-button"',
    '[attr.data-sidebar]': '"menu-sub-button"',
    '[attr.data-size]': 'size',
    '[attr.data-active]': 'isActive',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSidebarMenuSubButtonComponent {
  @Input() size: 'sm' | 'md' = 'md'
  @Input({ transform: booleanAttribute }) isActive = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg,&>lucide-icon>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg,&>lucide-icon>svg]:size-4 [&>svg,&>lucide-icon>svg]:shrink-0',
      'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
      this.size === 'sm' && 'text-xs',
      this.size === 'md' && 'text-sm',
      'group-data-[collapsible=icon]:hidden',
      this.className,
    )
  }
}

export { sidebarMenuButtonVariants, type SidebarMenuButtonVariants } from './sidebar.variants'
export * from './sidebar-context'
