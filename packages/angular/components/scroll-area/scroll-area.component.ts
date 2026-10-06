import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export type ScrollBarOrientation = 'vertical' | 'horizontal'
export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover'

/** Radix ScrollAreaViewportStyle, copied verbatim: hides the native scrollbar on the viewport. */
const VIEWPORT_STYLE = `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`

interface Sizes {
  content: number
  viewport: number
  scrollbar: { size: number; paddingStart: number; paddingEnd: number }
}

const clamp = (v: number, [lo, hi]: [number, number]) => Math.min(hi, Math.max(lo, v))
function linearScale(input: [number, number], output: [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}
const toInt = (value: string) => (value ? parseInt(value, 10) : 0)
export function thumbRatio(viewport: number, content: number): number {
  const ratio = viewport / content
  return isNaN(ratio) ? 0 : ratio
}
/** Radix: thumb length = track length * viewport/content, never below 18px. */
export function thumbSize(sizes: Sizes): number {
  const ratio = thumbRatio(sizes.viewport, sizes.content)
  const padding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd
  return Math.max((sizes.scrollbar.size - padding) * ratio, 18)
}
function scrollFromPointer(
  pointerPos: number,
  pointerOffset: number,
  sizes: Sizes,
  dir: 'ltr' | 'rtl' = 'ltr',
): number {
  const size = thumbSize(sizes)
  const offset = pointerOffset || size / 2
  const minPointer = sizes.scrollbar.paddingStart + offset
  const maxPointer = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - (size - offset)
  const maxScroll = sizes.content - sizes.viewport
  const range: [number, number] = dir === 'ltr' ? [0, maxScroll] : [maxScroll * -1, 0]
  return linearScale([minPointer, maxPointer], range)(pointerPos)
}
export function thumbOffsetFromScroll(scrollPos: number, sizes: Sizes, dir: 'ltr' | 'rtl' = 'ltr'): number {
  const size = thumbSize(sizes)
  const padding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd
  const track = sizes.scrollbar.size - padding
  const maxScroll = sizes.content - sizes.viewport
  const range: [number, number] = dir === 'ltr' ? [0, maxScroll] : [maxScroll * -1, 0]
  return linearScale([0, maxScroll], [0, track - size])(clamp(scrollPos, range))
}

function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const run = () => {
    clearTimeout(timer)
    timer = setTimeout(fn, ms)
  }
  run.cancel = () => clearTimeout(timer)
  return run
}

/**
 * Angular port of UIPKGE ScrollArea (React: Radix ScrollArea). Root > viewport (native
 * scrollbar hidden, overflow:scroll on each axis that has a scrollbar) > content, plus the
 * vertical ScrollBar and Corner React always renders. Add `<ui-scroll-bar orientation="horizontal" />`
 * inside the content for the x-axis, exactly like React. `type` controls visibility like Radix:
 * hover (default: while hovered, when overflowing), scroll (while scrolling), auto (when
 * overflowing), always.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-area, [ui-scroll-area]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [VIEWPORT_STYLE],
  imports: [forwardRef(() => UiScrollBarComponent)],
  host: {
    '[attr.data-slot]': '"scroll-area"',
    '[attr.data-uipkge]': '""',
    '[attr.dir]': 'dir',
    '[class]': 'hostClass',
    '[style.--radix-scroll-area-corner-width]': 'cornerWidth() + "px"',
    '[style.--radix-scroll-area-corner-height]': 'cornerHeight() + "px"',
    '(pointerenter)': 'onPointerEnter()',
    '(pointerleave)': 'onPointerLeave()',
  },
  template: `
    <div
      #viewport
      data-radix-scroll-area-viewport=""
      data-uipkge=""
      data-slot="scroll-area-viewport"
      [class]="viewportClass"
      [style.overflow-x]="scrollbarXEnabled() > 0 ? 'scroll' : 'hidden'"
      [style.overflow-y]="scrollbarYEnabled() > 0 ? 'scroll' : 'hidden'"
    >
      <div #content class="table min-w-full"><ng-content /></div>
    </div>
    <ui-scroll-bar />
    @if (hasCorner()) {
      <div
        class="absolute bottom-0"
        [style.width.px]="cornerWidth()"
        [style.height.px]="cornerHeight()"
        [style.right]="dir === 'ltr' ? '0px' : null"
        [style.left]="dir === 'rtl' ? '0px' : null"
      ></div>
    }
  `,
})
export class UiScrollAreaComponent implements OnDestroy {
  @Input() type: ScrollAreaType = 'hover'
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input() scrollHideDelay = 600
  @Input('class') className?: string

  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLElement>
  @ViewChild('content', { static: true }) contentRef!: ElementRef<HTMLElement>

  readonly scrollbarXEnabled = signal(0)
  readonly scrollbarYEnabled = signal(0)
  /** Currently mounted (visible) scrollbars, for the corner. */
  readonly scrollbarX = signal<HTMLElement | null>(null)
  readonly scrollbarY = signal<HTMLElement | null>(null)
  readonly cornerWidth = signal(0)
  readonly cornerHeight = signal(0)
  readonly hoverVisible = signal(false)
  private hideTimer?: ReturnType<typeof setTimeout>
  private cornerRo?: ResizeObserver

  readonly hasCorner = computed(() => {
    const both = !!(this.scrollbarX() && this.scrollbarY())
    return both && this.cornerWidth() > 0 && this.cornerHeight() > 0
  })

  get hostClass(): string {
    return cn('block relative', this.className)
  }

  get viewportClass(): string {
    return 'focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1'
  }

  get viewport(): HTMLElement {
    return this.viewportRef.nativeElement
  }
  get content(): HTMLElement {
    return this.contentRef.nativeElement
  }

  onPointerEnter(): void {
    clearTimeout(this.hideTimer)
    this.hoverVisible.set(true)
  }

  onPointerLeave(): void {
    clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(() => this.hoverVisible.set(false), this.scrollHideDelay)
  }

  /** Called by scrollbars when they mount / unmount (Radix Presence + ref). */
  setMounted(orientation: ScrollBarOrientation, el: HTMLElement | null): void {
    const target = orientation === 'horizontal' ? this.scrollbarX : this.scrollbarY
    if (target() === el) return
    target.set(el)
    this.observeCorner()
  }

  private observeCorner(): void {
    this.cornerRo?.disconnect()
    const x = this.scrollbarX()
    const y = this.scrollbarY()
    const measure = () => {
      this.cornerHeight.set(this.type !== 'scroll' && x && y ? x.offsetHeight : 0)
      this.cornerWidth.set(this.type !== 'scroll' && x && y ? y.offsetWidth : 0)
    }
    measure()
    if (!x || !y || typeof ResizeObserver === 'undefined') return
    this.cornerRo = new ResizeObserver(() => requestAnimationFrame(measure))
    this.cornerRo.observe(x)
    this.cornerRo.observe(y)
  }

  ngOnDestroy(): void {
    clearTimeout(this.hideTimer)
    this.cornerRo?.disconnect()
  }
}

type ScrollState = 'hidden' | 'scrolling' | 'interacting' | 'idle'
const SCROLL_MACHINE: Record<ScrollState, Partial<Record<string, ScrollState>>> = {
  hidden: { SCROLL: 'scrolling' },
  scrolling: { SCROLL_END: 'idle', POINTER_ENTER: 'interacting' },
  interacting: { SCROLL: 'interacting', POINTER_LEAVE: 'idle' },
  idle: { HIDE: 'hidden', SCROLL: 'scrolling', POINTER_ENTER: 'interacting' },
}

/**
 * ScrollBar (Radix Scrollbar + Thumb). Absolutely positioned against the root, sized and
 * positioned from the viewport's scroll metrics; drag the thumb or press the track to scroll,
 * wheel over it to scroll the viewport. Class strings verbatim from React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-bar, [ui-scroll-bar]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"scroll-area-scrollbar"',
    '[attr.data-uipkge]': '""',
    '[attr.data-orientation]': 'orientation',
    '[attr.data-state]': 'dataState()',
    '[attr.hidden]': 'present() ? null : ""',
    '[class]': 'hostClass',
    '[style]': 'hostStyle()',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointerenter)': 'send("POINTER_ENTER")',
    '(pointerleave)': 'send("POINTER_LEAVE")',
  },
  template: `
    @if (hasThumb()) {
      <div
        #thumb
        data-uipkge=""
        data-slot="scroll-area-thumb"
        data-state="visible"
        class="bg-border relative flex-1 rounded-full"
        (pointerdown)="onThumbPointerDown($event)"
        (pointerup)="pointerOffset = 0"
      ></div>
    }
  `,
})
export class UiScrollBarComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Inert outside a ScrollArea (Radix throws; kept renderable for previews). */
  private readonly area = inject(UiScrollAreaComponent, { optional: true })
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  @Input() orientation: ScrollBarOrientation = 'vertical'
  @Input({ transform: booleanAttribute }) forceMount = false
  @Input('class') className?: string

  readonly sizes = signal<Sizes>({ content: 0, viewport: 0, scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 } })
  readonly overflowing = signal(false)
  readonly scrollState = signal<ScrollState>('hidden')
  readonly hasThumb = computed(() => {
    const r = thumbRatio(this.sizes().viewport, this.sizes().content)
    return r > 0 && r < 1
  })

  pointerOffset = 0
  private thumbEl: HTMLElement | null = null
  private rect: DOMRect | null = null
  private prevUserSelect = ''
  private cleanups: (() => void)[] = []
  private idleTimer?: ReturnType<typeof setTimeout>
  private readonly scrollEnd = debounce(() => this.send('SCROLL_END'), 100)
  private readonly measureSoon = debounce(() => this.measure(), 10)
  private readonly checkOverflowSoon = debounce(() => this.checkOverflow(), 10)

  constructor() {
    // Presence changes (hover / scroll / overflow) mount or unmount the bar for the corner.
    effect(() => this.syncMounted())
  }

  @ViewChild('thumb')
  set thumb(ref: ElementRef<HTMLElement> | undefined) {
    this.thumbEl = ref?.nativeElement ?? null
    this.updateThumbPosition()
  }

  get isHorizontal(): boolean {
    return this.orientation === 'horizontal'
  }

  private get type(): ScrollAreaType {
    return this.area?.type ?? 'always'
  }

  /** Radix Presence: whether the scrollbar is mounted for the area's `type`. */
  present(): boolean {
    if (!this.area) return true
    if (this.forceMount) return true
    switch (this.type) {
      case 'hover':
        return this.area.hoverVisible() && this.overflowing()
      case 'scroll':
        return this.scrollState() !== 'hidden'
      case 'auto':
        return this.overflowing()
      default:
        return true
    }
  }

  dataState(): 'visible' | 'hidden' {
    switch (this.type) {
      case 'hover':
        return this.area?.hoverVisible() ? 'visible' : 'hidden'
      case 'scroll':
        return this.scrollState() === 'hidden' ? 'hidden' : 'visible'
      case 'auto':
        return this.overflowing() ? 'visible' : 'hidden'
      default:
        return 'visible'
    }
  }

  get hostClass(): string {
    return cn(
      'flex touch-none p-px transition-colors select-none',
      this.orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
      this.orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
      this.className,
    )
  }

  /** Radix positions the scrollbar inline (edges depend on dir + the corner size). */
  hostStyle(): Record<string, string> {
    const dir = this.area?.dir ?? 'ltr'
    const size = `${thumbSize(this.sizes())}px`
    if (this.isHorizontal) {
      return {
        position: 'absolute',
        bottom: '0px',
        left: dir === 'rtl' ? 'var(--radix-scroll-area-corner-width)' : '0px',
        right: dir === 'ltr' ? 'var(--radix-scroll-area-corner-width)' : '0px',
        '--radix-scroll-area-thumb-width': size,
      }
    }
    return {
      position: 'absolute',
      top: '0px',
      ...(dir === 'ltr' ? { right: '0px' } : { left: '0px' }),
      bottom: 'var(--radix-scroll-area-corner-height)',
      '--radix-scroll-area-thumb-height': size,
    }
  }

  send(event: string): void {
    if (this.type !== 'scroll') return
    const next = SCROLL_MACHINE[this.scrollState()][event]
    if (!next) return
    this.scrollState.set(next)
    clearTimeout(this.idleTimer)
    if (next === 'idle') this.idleTimer = setTimeout(() => this.send('HIDE'), this.area?.scrollHideDelay ?? 600)
  }

  ngOnInit(): void {
    if (!this.area) return
    const counter = this.isHorizontal ? this.area.scrollbarXEnabled : this.area.scrollbarYEnabled
    counter.update((n) => n + 1)
    this.cleanups.push(() => counter.update((n) => n - 1))
  }

  ngAfterViewInit(): void {
    const area = this.area
    if (!area) return
    const viewport = area.viewport
    let prevPos = this.scrollPos(viewport)
    const onScroll = () => {
      this.updateThumbPosition()
      const pos = this.scrollPos(viewport)
      if (pos !== prevPos) {
        this.send('SCROLL')
        this.scrollEnd()
      }
      prevPos = pos
    }
    viewport.addEventListener('scroll', onScroll)
    const onWheel = (event: WheelEvent) => {
      if (!(event.target instanceof Node) || !this.el.contains(event.target)) return
      const max = this.sizes().content - this.sizes().viewport
      const next = this.scrollPos(viewport) + (this.isHorizontal ? event.deltaX : event.deltaY)
      this.setScroll(next)
      if (next > 0 && next < max) event.preventDefault()
    }
    document.addEventListener('wheel', onWheel, { passive: false })
    this.cleanups.push(
      () => viewport.removeEventListener('scroll', onScroll),
      () => document.removeEventListener('wheel', onWheel),
      () => area.setMounted(this.orientation, null),
      () => this.scrollEnd.cancel(),
      () => this.measureSoon.cancel(),
      () => this.checkOverflowSoon.cancel(),
    )
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() =>
        requestAnimationFrame(() => {
          this.measureSoon()
          this.checkOverflowSoon()
          this.syncMounted()
        }),
      )
      ro.observe(this.el)
      ro.observe(area.content)
      ro.observe(viewport)
      this.cleanups.push(() => ro.disconnect())
    }
    this.sync()
  }

  /** Re-read scroll metrics, overflow and presence (what the ResizeObservers trigger). */
  sync(): void {
    this.measure()
    this.checkOverflow()
    this.syncMounted()
  }

  /** Radix onResize: content / viewport / track sizes for this axis. */
  private measure(): void {
    const viewport = this.area?.viewport
    if (!viewport) return
    const cs = getComputedStyle(this.el)
    this.sizes.set(
      this.isHorizontal
        ? {
            content: viewport.scrollWidth,
            viewport: viewport.offsetWidth,
            scrollbar: {
              size: this.el.clientWidth,
              paddingStart: toInt(cs.paddingLeft),
              paddingEnd: toInt(cs.paddingRight),
            },
          }
        : {
            content: viewport.scrollHeight,
            viewport: viewport.offsetHeight,
            scrollbar: {
              size: this.el.clientHeight,
              paddingStart: toInt(cs.paddingTop),
              paddingEnd: toInt(cs.paddingBottom),
            },
          },
    )
    this.updateThumbPosition()
  }

  private checkOverflow(): void {
    const v = this.area?.viewport
    if (!v) return
    this.overflowing.set(this.isHorizontal ? v.offsetWidth < v.scrollWidth : v.offsetHeight < v.scrollHeight)
  }

  private syncMounted(): void {
    const present = this.present()
    untracked(() => this.area?.setMounted(this.orientation, present ? this.el : null))
  }

  private scrollPos(viewport: HTMLElement): number {
    return this.isHorizontal ? viewport.scrollLeft : viewport.scrollTop
  }

  private setScroll(pos: number): void {
    const viewport = this.area?.viewport
    if (!viewport) return
    if (this.isHorizontal) viewport.scrollLeft = pos
    else viewport.scrollTop = pos
  }

  updateThumbPosition(): void {
    const viewport = this.area?.viewport
    if (!viewport || !this.thumbEl) return
    const offset = thumbOffsetFromScroll(
      this.scrollPos(viewport),
      this.sizes(),
      this.isHorizontal ? this.area!.dir : 'ltr',
    )
    this.thumbEl.style.transform = this.isHorizontal
      ? `translate3d(${offset}px, 0, 0)`
      : `translate3d(0, ${offset}px, 0)`
  }

  onThumbPointerDown(event: PointerEvent): void {
    const r = (event.target as HTMLElement).getBoundingClientRect()
    this.pointerOffset = this.isHorizontal ? event.clientX - r.left : event.clientY - r.top
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 || !this.area) return
    const target = event.target as HTMLElement
    target.setPointerCapture?.(event.pointerId)
    this.rect = this.el.getBoundingClientRect()
    this.prevUserSelect = document.body.style.webkitUserSelect
    document.body.style.webkitUserSelect = 'none'
    this.area.viewport.style.scrollBehavior = 'auto'
    this.dragScroll(event)
  }

  onPointerMove(event: PointerEvent): void {
    this.dragScroll(event)
  }

  onPointerUp(event: PointerEvent): void {
    const target = event.target as HTMLElement
    if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId)
    document.body.style.webkitUserSelect = this.prevUserSelect
    if (this.area) this.area.viewport.style.scrollBehavior = ''
    this.rect = null
  }

  private dragScroll(event: PointerEvent): void {
    if (!this.rect) return
    const pos = this.isHorizontal ? event.clientX - this.rect.left : event.clientY - this.rect.top
    this.setScroll(scrollFromPointer(pos, this.pointerOffset, this.sizes(), this.isHorizontal ? this.area?.dir : 'ltr'))
  }

  ngOnDestroy(): void {
    clearTimeout(this.idleTimer)
    this.cleanups.splice(0).forEach((fn) => fn())
  }
}
