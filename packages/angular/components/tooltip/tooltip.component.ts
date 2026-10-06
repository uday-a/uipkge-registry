import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  BodyPortal,
  afterExitAnimation,
  autoPlace,
  pushDismissableLayer,
  uniqueId,
  type Placement,
  type PopperAlign,
  type PopperSide,
} from '@/ui/popper/popper'

export type TooltipSide = PopperSide
export type TooltipAlign = PopperAlign

/** Delay settings a TooltipProvider (or any ancestor, e.g. SidebarProvider) supplies. */
export interface TooltipConfig {
  delayDuration: number
  skipDelayDuration: number
  disableHoverableContent: boolean
}
export const UI_TOOLTIP_CONFIG = new InjectionToken<TooltipConfig>('UI_TOOLTIP_CONFIG')

/** Radix defaults: 700ms ambient open delay, 300ms window where neighbours open instantly. */
const DEFAULT_CONFIG: TooltipConfig = { delayDuration: 700, skipDelayDuration: 300, disableHoverableContent: false }
let lastClosedAt = 0

export const TOOLTIP_CONTENT_CLASS =
  'bg-foreground text-background motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance'
const ARROW_CLASS =
  'bg-foreground fill-foreground z-50 block size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]'

/** Radix Popper adds the measured arrow height to sideOffset, so the arrow tip sits sideOffset from the anchor. */
function arrowHeight(wrapper: HTMLElement | null): number {
  return (wrapper?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0
}

/** Radix popper arrow placement: wrapper pinned to the edge facing the anchor, rotated per side. */
function placeArrow(wrapper: HTMLElement | null, anchor: Element, floating: HTMLElement, p: Placement): void {
  if (!wrapper) return
  const a = anchor.getBoundingClientRect()
  const f = floating.getBoundingClientRect()
  const vertical = p.side === 'top' || p.side === 'bottom'
  const base = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[p.side]
  Object.assign(wrapper.style, {
    position: 'absolute',
    top: '',
    bottom: '',
    left: '',
    right: '',
    transformOrigin: { top: '', right: '0 0', bottom: 'center 0', left: '100% 0' }[p.side],
    transform: {
      top: 'translateY(100%)',
      right: 'translateY(50%) rotate(90deg) translateX(-50%)',
      bottom: 'rotate(180deg)',
      left: 'translateY(50%) rotate(-90deg) translateX(50%)',
    }[p.side],
  })
  wrapper.style.setProperty(base, '0px')
  if (vertical) wrapper.style.left = `${Math.max(4, Math.min(f.width - 14, a.left + a.width / 2 - f.left - 5))}px`
  else wrapper.style.top = `${Math.max(4, Math.min(f.height - 14, a.top + a.height / 2 - f.top - 5))}px`
}

/** Open/close timing shared by the compound Tooltip and the [uiTooltip] directive. */
class TooltipTiming {
  private timer: ReturnType<typeof setTimeout> | undefined
  constructor(
    private readonly config: () => TooltipConfig,
    private readonly apply: (open: boolean, how: 'delayed' | 'instant') => void,
  ) {}

  enter(): void {
    clearTimeout(this.timer)
    const c = this.config()
    const skip = Date.now() - lastClosedAt < c.skipDelayDuration
    if (skip || c.delayDuration <= 0) this.apply(true, 'instant')
    else this.timer = setTimeout(() => this.apply(true, 'delayed'), c.delayDuration)
  }

  focus(): void {
    clearTimeout(this.timer)
    this.apply(true, 'instant')
  }

  leave(): void {
    clearTimeout(this.timer)
    this.apply(false, 'instant')
  }

  destroy(): void {
    clearTimeout(this.timer)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tooltip-provider, [ui-tooltip-provider]',
  standalone: true,
  host: { class: 'contents' },
  providers: [{ provide: UI_TOOLTIP_CONFIG, useExisting: forwardRef(() => UiTooltipProviderComponent) }],
  template: `<ng-content />`,
})
export class UiTooltipProviderComponent implements TooltipConfig {
  @Input() delayDuration = 700
  @Input() skipDelayDuration = 300
  @Input({ transform: booleanAttribute }) disableHoverableContent = false
}

/**
 * Angular port of UIPKGE Tooltip with Radix behaviour: hover opens after the provider
 * delay (instant for neighbours within the skip window), focus opens instantly,
 * pointer-leave / blur / pointer-down / Escape close, content renders in a body portal
 * positioned against the trigger with an arrow. Class strings identical to Vue/React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tooltip, [ui-tooltip]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"tooltip"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiTooltipComponent implements OnDestroy {
  private readonly provided = inject(UI_TOOLTIP_CONFIG, { optional: true })
  @Input() open?: boolean
  @Input() defaultOpen = false
  /** Per-tooltip override of the provider's delay. */
  @Input() delayDuration?: number
  @Input({ transform: booleanAttribute }) disableHoverableContent = false
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('tooltip-content')
  private readonly _open = signal<boolean | null>(null)
  openHow: 'delayed' | 'instant' = 'instant'
  trigger?: HTMLElement
  content?: UiTooltipContentComponent
  readonly timing = new TooltipTiming(
    () => ({
      ...DEFAULT_CONFIG,
      ...pickConfig(this.provided),
      ...(this.delayDuration !== undefined ? { delayDuration: this.delayDuration } : {}),
    }),
    (open, how) => {
      this.openHow = how
      this.setOpen(open)
    },
  )

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this._open() ?? this.defaultOpen
  }

  setOpen(value: boolean): void {
    if (value === this.isOpen) return
    if (!value) lastClosedAt = Date.now()
    this._open.set(value)
    this.openChange.emit(value)
    this.content?.sync()
  }

  ngOnDestroy(): void {
    this.timing.destroy()
  }
}

function pickConfig(c: Partial<TooltipConfig> | null): Partial<TooltipConfig> {
  if (!c) return {}
  return { delayDuration: c.delayDuration, skipDelayDuration: c.skipDelayDuration }
}

@Directive({
  selector: 'ui-tooltip-trigger, [ui-tooltip-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'tooltip.isOpen ? tooltip.openHow + "-open" : "closed"',
    '[attr.aria-describedby]': 'tooltip.isOpen ? tooltip.contentId : null',
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'tooltip.timing.leave()',
    '(pointerdown)': 'tooltip.timing.leave()',
    '(focus)': 'tooltip.timing.focus()',
    '(blur)': 'tooltip.timing.leave()',
  },
})
export class UiTooltipTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'tooltip-trigger'
  readonly tooltip = inject(UiTooltipComponent)

  constructor() {
    this.tooltip.trigger = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  }

  onPointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'touch') this.tooltip.timing.enter()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tooltip-content, [ui-tooltip-content]',
  standalone: true,
  host: { class: 'hidden' },
  template: `
    <ng-template #panel>
      <div
        [id]="tooltip.contentId"
        role="tooltip"
        data-slot="tooltip-content"
        data-uipkge=""
        [attr.data-state]="state()"
        [class]="panelClass"
      >
        <ng-content />
        <span data-tooltip-arrow=""><span [class]="arrowClass"></span></span>
      </div>
    </ng-template>
  `,
})
export class UiTooltipContentComponent implements OnDestroy {
  readonly tooltip = inject(UiTooltipComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))
  @Input('class') className?: string
  @Input() side: TooltipSide = 'top'
  @Input() align: TooltipAlign = 'center'
  @Input() sideOffset = 4
  @Input() alignOffset = 0
  /** React passes `hidden` to suppress the tooltip (e.g. sidebar expanded); same here. */
  @Input({ transform: booleanAttribute }) hidden = false
  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>
  readonly arrowClass = ARROW_CLASS
  readonly state = signal<'delayed-open' | 'instant-open' | 'closed'>('closed')
  private panelEl?: HTMLElement
  private cleanups: (() => void)[] = []

  constructor() {
    this.tooltip.content = this
  }

  get panelClass(): string {
    return cn(TOOLTIP_CONTENT_CLASS, this.className)
  }

  sync(): void {
    const show = this.tooltip.isOpen && !this.hidden
    if (show && (!this.portal.attached || this.state() === 'closed')) {
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!show && this.portal.attached && this.state() !== 'closed') void this.hide()
  }

  private show(): void {
    const trigger = this.tooltip.trigger
    if (!trigger) return
    this.state.set(this.tooltip.openHow === 'delayed' ? 'delayed-open' : 'instant-open')
    const panel = this.portal.attach(this.panelTpl).firstElementChild as HTMLElement
    this.panelEl = panel
    const arrow = panel.querySelector<HTMLElement>('[data-tooltip-arrow]')
    this.cleanups.push(
      autoPlace(
        trigger,
        panel,
        () => ({
          side: this.side,
          align: this.align,
          sideOffset: this.sideOffset + arrowHeight(arrow),
          alignOffset: this.alignOffset,
          collisionPadding: 0,
          avoidCollisions: true,
        }),
        'tooltip',
        (p) => placeArrow(arrow, trigger, panel, p),
      ),
      pushDismissableLayer({
        contains: () => true,
        onEscape: () => this.tooltip.setOpen(false),
        onPointerDownOutside: () => {},
      }),
    )
  }

  private async hide(): Promise<void> {
    this.state.set('closed')
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(this.panelEl)
    if (this.tooltip.isOpen && !this.hidden) return
    this.portal.detach()
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

/**
 * Shorthand for a text tooltip on any element: `<button [uiTooltip]="'Save'" tooltipSide="right">`.
 * Same timing, placement, arrow and classes as the compound Tooltip. SidebarMenuButton
 * composes it (hostDirectives) for the collapsed icon-rail labels, like React's `tooltip` prop.
 */
@Directive({
  selector: '[uiTooltip]',
  standalone: true,
  host: {
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'timing.leave()',
    '(pointerdown)': 'timing.leave()',
    '(focus)': 'timing.focus()',
    '(blur)': 'timing.leave()',
    '[attr.aria-describedby]': 'panel ? id : null',
  },
})
export class UiTooltipDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly provided = inject(UI_TOOLTIP_CONFIG, { optional: true })
  @Input('uiTooltip') text?: string | null
  @Input() tooltipSide: TooltipSide = 'top'
  @Input() tooltipAlign: TooltipAlign = 'center'
  @Input() tooltipSideOffset = 4
  @Input({ transform: booleanAttribute }) tooltipDisabled = false
  /** Host components composing this directive can suppress it dynamically (sidebar: only when collapsed). */
  disabledWhen?: () => boolean

  readonly id = uniqueId('tooltip-content')
  panel: HTMLElement | null = null
  private cleanups: (() => void)[] = []
  readonly timing = new TooltipTiming(
    () => ({ ...DEFAULT_CONFIG, ...pickConfig(this.provided) }),
    (open, how) => (open ? this.show(how) : void this.hide()),
  )

  onPointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'touch') this.timing.enter()
  }

  private show(how: 'delayed' | 'instant'): void {
    if (!this.text || this.tooltipDisabled || this.disabledWhen?.()) return
    if (this.panel) this.teardown()
    const panel = document.createElement('div')
    panel.id = this.id
    panel.setAttribute('role', 'tooltip')
    panel.setAttribute('data-slot', 'tooltip-content')
    panel.setAttribute('data-uipkge', '')
    panel.setAttribute('data-state', `${how}-open`)
    panel.className = TOOLTIP_CONTENT_CLASS
    panel.textContent = this.text
    const wrapper = document.createElement('span')
    const arrow = document.createElement('span')
    arrow.className = ARROW_CLASS
    wrapper.appendChild(arrow)
    panel.appendChild(wrapper)
    document.body.appendChild(panel)
    this.panel = panel
    this.cleanups.push(
      autoPlace(
        this.el,
        panel,
        () => ({
          side: this.tooltipSide,
          align: this.tooltipAlign,
          sideOffset: this.tooltipSideOffset + arrowHeight(wrapper),
          alignOffset: 0,
          collisionPadding: 0,
          avoidCollisions: true,
        }),
        'tooltip',
        (p) => placeArrow(wrapper, this.el, panel, p),
      ),
      pushDismissableLayer({ contains: () => true, onEscape: () => void this.hide(), onPointerDownOutside: () => {} }),
    )
  }

  private async hide(): Promise<void> {
    const panel = this.panel
    if (!panel) return
    lastClosedAt = Date.now()
    panel.setAttribute('data-state', 'closed')
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(panel)
    if (this.panel === panel) this.teardown()
  }

  private teardown(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.panel?.remove()
    this.panel = null
  }

  ngOnDestroy(): void {
    this.timing.destroy()
    this.teardown()
  }
}
