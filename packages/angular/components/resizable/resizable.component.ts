import {
  type AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  type OnDestroy,
  type OnInit,
  Output,
  booleanAttribute,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export type ResizableDirection = 'horizontal' | 'vertical'
/*
 * Angular port of UIPKGE Resizable (React: react-resizable-panels v2 wrapped by
 * ResizablePanelGroup / ResizablePanel / ResizableHandle). The group owns the layout
 * (percentages summing to 100) as a signal; panels and handles register with the
 * nearest group. Drag, arrow / Home / End / Enter keyboard resizing, min / max /
 * collapsible constraints (the library's adjustLayoutByDelta cascade), aria-value*
 * on the separator, data-* attributes, inline flex styles and autoSaveId persistence
 * follow the library. Class strings are the React ones verbatim.
 */

const PRECISION = 10
let idCounter = 0
const nextId = (p: string) => `${p}-${++idCounter}`

const fuzzyCompare = (a: number, b: number, fractionDigits = PRECISION) => {
  const x = parseFloat(a.toFixed(fractionDigits))
  const y = parseFloat(b.toFixed(fractionDigits))
  return x === y ? 0 : x > y ? 1 : -1
}
const fuzzyEqual = (a: number, b: number, fractionDigits = PRECISION) => fuzzyCompare(a, b, fractionDigits) === 0
const fuzzyLayoutsEqual = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => fuzzyEqual(v, b[i]!))

export interface ResizablePanelConstraints {
  collapsedSize: number
  collapsible: boolean
  defaultSize?: number
  maxSize: number
  minSize: number
}

/** Clamp one panel size to its constraints (collapsible panels snap below the halfway point). */
export function clampPanelSize(c: ResizablePanelConstraints, size: number): number {
  if (fuzzyCompare(size, c.minSize) < 0) {
    if (c.collapsible) size = fuzzyCompare(size, (c.collapsedSize + c.minSize) / 2) < 0 ? c.collapsedSize : c.minSize
    else size = c.minSize
  }
  size = Math.min(c.maxSize, size)
  return parseFloat(size.toFixed(PRECISION))
}

/** react-resizable-panels adjustLayoutByDelta: move `delta` % across the pivot, cascading past panels at their limits. */
export function adjustLayoutByDelta(
  delta: number,
  initialLayout: number[],
  constraints: ResizablePanelConstraints[],
  pivot: [number, number],
  prevLayout: number[],
  trigger: 'keyboard' | 'pointer' | 'imperative',
): number[] {
  if (fuzzyEqual(delta, 0)) return initialLayout
  const next = [...initialLayout]
  const [first, second] = pivot
  let applied = 0

  // Keyboard resizes a collapsible pivot panel straight between collapsed and min size.
  if (trigger === 'keyboard') {
    const index = delta < 0 ? second : first
    const c = constraints[index]!
    if (c.collapsible) {
      const prev = initialLayout[index]!
      if (fuzzyEqual(prev, c.collapsedSize)) {
        const d = c.minSize - prev
        if (fuzzyCompare(d, Math.abs(delta)) > 0) delta = delta < 0 ? -d : d
      }
    }
    const other = delta < 0 ? first : second
    const oc = constraints[other]!
    if (oc.collapsible) {
      const prev = initialLayout[other]!
      if (fuzzyEqual(prev, oc.minSize)) {
        const d = prev - oc.collapsedSize
        if (fuzzyCompare(d, Math.abs(delta)) > 0) delta = delta < 0 ? -d : d
      }
    }
  }

  {
    const inc = delta < 0 ? 1 : -1
    let i = delta < 0 ? second : first
    let available = 0
    while (i >= 0 && i < constraints.length) {
      available += clampPanelSize(constraints[i]!, 100) - initialLayout[i]!
      i += inc
    }
    const abs = Math.min(Math.abs(delta), Math.abs(available))
    delta = delta < 0 ? -abs : abs
  }

  {
    let i = delta < 0 ? first : second
    while (i >= 0 && i < constraints.length) {
      const remaining = Math.abs(delta) - Math.abs(applied)
      const prev = initialLayout[i]!
      const safe = clampPanelSize(constraints[i]!, prev - remaining)
      if (!fuzzyEqual(prev, safe)) {
        applied += prev - safe
        next[i] = safe
        if (applied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), undefined, { numeric: true }) >= 0)
          break
      }
      i += delta < 0 ? -1 : 1
    }
  }
  if (fuzzyLayoutsEqual(prevLayout, next)) return prevLayout

  {
    const p = delta < 0 ? second : first
    const unsafe = initialLayout[p]! + applied
    const safe = clampPanelSize(constraints[p]!, unsafe)
    next[p] = safe
    if (!fuzzyEqual(safe, unsafe)) {
      let remaining = unsafe - safe
      let i = p
      while (i >= 0 && i < constraints.length) {
        const prev = next[i]!
        const s = clampPanelSize(constraints[i]!, prev + remaining)
        if (!fuzzyEqual(prev, s)) {
          remaining -= s - prev
          next[i] = s
        }
        if (fuzzyEqual(remaining, 0)) break
        i += delta > 0 ? -1 : 1
      }
    }
  }
  const total = next.reduce((a, b) => a + b, 0)
  return fuzzyEqual(total, 100) ? next : prevLayout
}

/** Initial layout: defaultSize where given, the rest shared equally, then validated to sum 100. */
function initialLayout(constraints: ResizablePanelConstraints[]): number[] {
  let remaining = 100
  let unsized = 0
  const layout = constraints.map((c) => {
    if (c.defaultSize == null) {
      unsized++
      return NaN
    }
    remaining -= c.defaultSize
    return c.defaultSize
  })
  const share = unsized ? remaining / unsized : 0
  return validateLayout(
    layout.map((v) => (Number.isNaN(v) ? share : v)),
    constraints,
  )
}

function validateLayout(layout: number[], constraints: ResizablePanelConstraints[]): number[] {
  const next = [...layout]
  const total = next.reduce((a, b) => a + b, 0)
  if (next.length && !fuzzyEqual(total, 100)) for (let i = 0; i < next.length; i++) next[i] = (100 / total) * next[i]!
  let remaining = 0
  for (let i = 0; i < next.length; i++) {
    const safe = clampPanelSize(constraints[i]!, next[i]!)
    if (next[i] !== safe) {
      remaining += next[i]! - safe
      next[i] = safe
    }
  }
  if (!fuzzyEqual(remaining, 0)) {
    for (let i = 0; i < next.length; i++) {
      const safe = clampPanelSize(constraints[i]!, next[i]! + remaining)
      if (next[i] !== safe) {
        remaining -= safe - next[i]!
        next[i] = safe
        if (fuzzyEqual(remaining, 0)) break
      }
    }
  }
  return next
}

const byDomOrder = (a: { el: HTMLElement }, b: { el: HTMLElement }) =>
  a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1

let cursorStyle: HTMLStyleElement | null = null
function setGlobalCursor(cursor: string | null): void {
  if (!cursor) {
    cursorStyle?.remove()
    cursorStyle = null
    return
  }
  cursorStyle ??= document.head.appendChild(document.createElement('style'))
  cursorStyle.textContent = `*{cursor: ${cursor} !important;}`
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-resizable-panel-group, [ui-resizable-panel-group]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"resizable-panel-group"',
    '[class]': 'hostClass',
    '[attr.id]': 'id ?? null',
    '[attr.data-panel-group]': '""',
    '[attr.data-panel-group-direction]': 'direction',
    '[attr.data-panel-group-id]': 'groupId',
    '[style.display]': '"flex"',
    '[style.flex-direction]': 'direction === "horizontal" ? "row" : "column"',
    '[style.height]': '"100%"',
    '[style.overflow]': '"hidden"',
    '[style.width]': '"100%"',
  },
  template: `<ng-content />`,
})
export class UiResizablePanelGroupComponent implements AfterContentInit, OnDestroy {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input() direction: ResizableDirection = 'horizontal'
  @Input() autoSaveId?: string | null
  @Input() id?: string | null
  /** Arrow-key step in percent (library default 10). */
  @Input() keyboardResizeBy: number | null = null
  @Input() storage: Pick<Storage, 'getItem' | 'setItem'> | null = null
  @Input('class') className?: string
  /** React `onLayout`: the layout (percentages) after every change. */
  @Output() layout = new EventEmitter<number[]>()

  readonly panels = signal<UiResizablePanelComponent[]>([])
  readonly sizes = signal<number[]>([])
  /** Handle currently being dragged (pointer) -- drives data-resize-handle-state="drag". */
  readonly dragging = signal<UiResizableHandleComponent | null>(null)
  private ready = false
  private saveTimer?: ReturnType<typeof setTimeout>

  get groupId(): string {
    return this.id ?? (this._gid ??= nextId('resizable-group'))
  }
  private _gid?: string

  get hostClass(): string {
    return cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', this.className)
  }

  ngAfterContentInit(): void {
    this.ready = true
    this.reset()
  }

  register(panel: UiResizablePanelComponent): void {
    this.panels.update((list) => [...list, panel].sort(byDomOrder))
    if (this.ready) this.reset()
  }

  unregister(panel: UiResizablePanelComponent): void {
    this.panels.update((list) => list.filter((p) => p !== panel))
    if (this.ready) this.reset()
  }

  constraints(): ResizablePanelConstraints[] {
    return this.panels().map((p) => p.constraints)
  }

  sizeOf(panel: UiResizablePanelComponent): number | undefined {
    const i = this.panels().indexOf(panel)
    return i < 0 ? undefined : this.sizes()[i]
  }

  /** Pivot panels either side of a handle (by DOM position). */
  pivotFor(handle: HTMLElement): [number, number] | null {
    const i =
      this.panels().filter((p) => p.el.compareDocumentPosition(handle) & Node.DOCUMENT_POSITION_FOLLOWING).length - 1
    return i < 0 || i + 1 >= this.panels().length ? null : [i, i + 1]
  }

  private reset(): void {
    const constraints = this.constraints()
    let next = initialLayout(constraints)
    const saved = this.loadLayout()
    if (saved && saved.length === next.length) next = validateLayout(saved, constraints)
    this.commit(next, true)
  }

  /** Apply a new layout, firing panel resize / collapse / expand + group layout callbacks like the library. */
  commit(next: number[], initial = false): void {
    const prev = this.sizes()
    if (!initial && fuzzyLayoutsEqual(prev, next)) return
    this.sizes.set(next)
    // The initial layout is set during change detection: notify once it has finished,
    // like the library's post-render effects.
    if (initial) queueMicrotask(() => this.notify(prev, next, true))
    else this.notify(prev, next, false)
  }

  private notify(prev: number[], next: number[], initial: boolean): void {
    this.panels().forEach((p, i) => {
      const size = next[i]!
      const before = initial ? undefined : prev[i]
      if (before === undefined || !fuzzyEqual(before, size)) {
        p.resize.emit(size)
        const c = p.constraints
        if (c.collapsible) {
          const was = before !== undefined && fuzzyEqual(before, c.collapsedSize)
          const is = fuzzyEqual(size, c.collapsedSize)
          if ((before === undefined || was) && !is) p.expand.emit()
          if ((before === undefined || !was) && is) p.collapse.emit()
        }
      }
    })
    this.layout.emit(next)
    this.saveLayout(next)
  }

  /** Imperative resize of one panel (used by the panel API and Enter-to-collapse). */
  resizePanel(panel: UiResizablePanelComponent, size: number): void {
    const panels = this.panels()
    const i = panels.indexOf(panel)
    if (i < 0) return
    const layout = this.sizes()
    const isLast = i === panels.length - 1
    const pivot: [number, number] = isLast ? [i - 1, i] : [i, i + 1]
    if (pivot[0] < 0) return
    const delta = isLast ? layout[i]! - size : size - layout[i]!
    this.commit(adjustLayoutByDelta(delta, layout, this.constraints(), pivot, layout, 'imperative'))
  }

  private storageKey(): string {
    return this.panels()
      .map((p) =>
        p.id ? p.id : p.order != null ? `${p.order}:${JSON.stringify(p.constraints)}` : JSON.stringify(p.constraints),
      )
      .sort((a, b) => a.localeCompare(b))
      .join(',')
  }

  private store(): Pick<Storage, 'getItem' | 'setItem'> | null {
    if (this.storage) return this.storage
    try {
      return typeof localStorage === 'undefined' ? null : localStorage
    } catch {
      return null
    }
  }

  private loadLayout(): number[] | null {
    if (!this.autoSaveId) return null
    try {
      const raw = this.store()?.getItem(`react-resizable-panels:${this.autoSaveId}`)
      const state = raw ? JSON.parse(raw) : null
      return state?.[this.storageKey()]?.layout ?? null
    } catch {
      return null
    }
  }

  private saveLayout(layout: number[]): void {
    if (!this.autoSaveId) return
    clearTimeout(this.saveTimer)
    this.saveTimer = setTimeout(() => {
      try {
        const store = this.store()
        const key = `react-resizable-panels:${this.autoSaveId}`
        const state = JSON.parse(store?.getItem(key) ?? '{}') ?? {}
        state[this.storageKey()] = { expandToSizes: {}, layout }
        store?.setItem(key, JSON.stringify(state))
      } catch {
        /* storage unavailable */
      }
    }, 100)
  }

  ngOnDestroy(): void {
    clearTimeout(this.saveTimer)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-resizable-panel, [ui-resizable-panel]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"resizable-panel"',
    '[class]': 'className ?? ""',
    '[attr.id]': 'panelId',
    '[attr.data-panel-group-id]': 'group.groupId',
    '[attr.data-panel]': '""',
    '[attr.data-panel-collapsible]': 'collapsible || null',
    '[attr.data-panel-id]': 'panelId',
    '[attr.data-panel-size]': 'sizeAttr()',
    '[style.flex]': 'flexStyle()',
    '[style.overflow]': '"hidden"',
  },
  template: `<ng-content />`,
})
export class UiResizablePanelComponent implements OnInit, OnDestroy {
  readonly group = inject(UiResizablePanelGroupComponent)
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input() defaultSize?: number
  @Input() minSize = 0
  @Input() maxSize = 100
  @Input({ transform: booleanAttribute }) collapsible = false
  @Input() collapsedSize = 0
  @Input() id?: string | null
  @Input() order?: number
  @Input('class') className?: string
  /** React `onResize`: new size in percent. */
  @Output() resize = new EventEmitter<number>()
  /** React `onCollapse`. */
  @Output() collapse = new EventEmitter<void>()
  /** React `onExpand`. */
  @Output() expand = new EventEmitter<void>()

  private readonly autoId = nextId('resizable-panel')
  private readonly size = computed(() => this.group.sizeOf(this))
  readonly sizeAttr = computed(() => this.size()?.toFixed(1) ?? null)
  readonly flexStyle = computed(() => {
    const s = this.size()
    const grow = s == null ? (this.defaultSize != null ? this.defaultSize.toPrecision(3) : '1') : s.toPrecision(3)
    return `${grow} 1 0px`
  })
  /** Size to restore when expanding a collapsed panel. */
  private expandTo?: number

  get panelId(): string {
    return this.id ?? this.autoId
  }

  get constraints(): ResizablePanelConstraints {
    return {
      collapsedSize: this.collapsedSize,
      collapsible: this.collapsible,
      defaultSize: this.defaultSize,
      maxSize: this.maxSize,
      minSize: this.minSize,
    }
  }

  ngOnInit(): void {
    this.group.register(this)
  }

  // Imperative API (React ImperativePanelHandle). Named *Panel where the React name
  // collides with the collapse / expand / resize outputs.
  getSize(): number {
    return this.size() ?? 0
  }

  isCollapsed(): boolean {
    return this.collapsible && fuzzyEqual(this.getSize(), this.collapsedSize)
  }

  isExpanded(): boolean {
    return !this.isCollapsed()
  }

  collapsePanel(): void {
    if (!this.collapsible || this.isCollapsed()) return
    this.expandTo = this.getSize()
    this.group.resizePanel(this, this.collapsedSize)
  }

  expandPanel(minSize?: number): void {
    if (!this.isCollapsed()) return
    const target = Math.max(this.expandTo ?? minSize ?? this.minSize, minSize ?? this.minSize)
    this.group.resizePanel(this, target)
  }

  resizePanel(size: number): void {
    this.group.resizePanel(this, size)
  }

  ngOnDestroy(): void {
    this.group.unregister(this)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-resizable-handle, [ui-resizable-handle]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"resizable-handle"',
    '[class]': 'hostClass',
    '[attr.id]': 'id ?? null',
    '[attr.role]': '"separator"',
    '[attr.tabindex]': 'tabIndex',
    '[attr.data-panel-group-direction]': 'group.direction',
    '[attr.data-panel-group-id]': 'group.groupId',
    '[attr.data-resize-handle]': '""',
    '[attr.data-resize-handle-active]': 'active()',
    '[attr.data-panel-resize-handle-enabled]': '!disabled',
    '[attr.data-panel-resize-handle-id]': 'handleId',
    '[attr.data-resize-handle-state]': 'state()',
    '[attr.aria-controls]': 'aria().controls',
    '[attr.aria-valuemax]': 'aria().max',
    '[attr.aria-valuemin]': 'aria().min',
    '[attr.aria-valuenow]': 'aria().now',
    '[style.touch-action]': '"none"',
    '[style.user-select]': '"none"',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerenter)': 'onPointerEnter()',
    '(pointerleave)': 'onPointerLeave()',
    '(keydown)': 'onKeydown($event)',
    '(focus)': 'focused.set(true)',
    '(blur)': 'focused.set(false)',
  },
  template: `
    @if (withHandle) {
      <div class="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
        <ng-content
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-grip-vertical size-2.5"
            aria-hidden="true"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" /></svg
        ></ng-content>
      </div>
    }
  `,
})
export class UiResizableHandleComponent implements OnDestroy {
  readonly group = inject(UiResizablePanelGroupComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ transform: booleanAttribute }) withHandle = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() id?: string | null
  @Input() tabIndex = 0
  @Input('class') className?: string
  /** React `onDragging`. */
  @Output() dragging = new EventEmitter<boolean>()

  readonly handleId = nextId('resizable-handle')
  readonly focused = signal(false)
  private readonly hovered = signal(false)
  readonly state = computed(() =>
    this.group.dragging() === this ? 'drag' : this.hovered() && !this.group.dragging() ? 'hover' : 'inactive',
  )
  readonly active = computed(() => (this.group.dragging() === this ? 'pointer' : this.focused() ? 'keyboard' : null))
  readonly aria = computed(() => {
    const layout = this.group.sizes()
    const panels = this.group.panels()
    const pivot = layout.length ? this.group.pivotFor(this.el) : null
    if (!pivot) return { controls: null, max: null, min: null, now: null }
    let curMin = 0,
      curMax = 100,
      totalMin = 0,
      totalMax = 0
    panels.forEach((p, i) => {
      if (i === pivot[0]) {
        curMin = p.minSize
        curMax = p.maxSize
      } else {
        totalMin += p.minSize
        totalMax += p.maxSize
      }
    })
    return {
      controls: panels[pivot[0]]!.panelId,
      max: Math.min(curMax, 100 - totalMin),
      min: Math.max(curMin, 100 - totalMax),
      now: Math.round(layout[pivot[0]]!),
    }
  })
  private stopDrag?: () => void

  get hostClass(): string {
    return cn(
      'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      this.className,
    )
  }

  private get cursor(): string {
    return this.group.direction === 'horizontal' ? 'ew-resize' : 'ns-resize'
  }

  onPointerEnter(): void {
    this.hovered.set(true)
    if (!this.disabled && !this.group.dragging()) setGlobalCursor(this.cursor)
  }

  onPointerLeave(): void {
    this.hovered.set(false)
    if (!this.group.dragging()) setGlobalCursor(null)
  }

  onPointerDown(event: PointerEvent): void {
    if (this.disabled || (event.button !== undefined && event.button !== 0)) return
    const pivot = this.group.pivotFor(this.el)
    if (!pivot) return
    event.preventDefault()
    const horizontal = this.group.direction === 'horizontal'
    const start = horizontal ? event.clientX : event.clientY
    const initial = this.group.sizes()
    const groupSize = horizontal ? this.group.el.offsetWidth : this.group.el.offsetHeight
    this.el.focus({ preventScroll: true })
    this.group.dragging.set(this)
    this.dragging.emit(true)
    setGlobalCursor(this.cursor)
    const move = (e: PointerEvent) => {
      const pos = horizontal ? e.clientX : e.clientY
      const delta = groupSize ? ((pos - start) / groupSize) * 100 : 0
      this.group.commit(
        adjustLayoutByDelta(delta, initial, this.group.constraints(), pivot, this.group.sizes(), 'pointer'),
      )
    }
    const up = () => this.stopDrag?.()
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
    document.addEventListener('pointercancel', up)
    this.stopDrag = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      document.removeEventListener('pointercancel', up)
      this.stopDrag = undefined
      this.group.dragging.set(null)
      this.dragging.emit(false)
      setGlobalCursor(this.hovered() ? this.cursor : null)
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled || event.defaultPrevented) return
    const pivot = this.group.pivotFor(this.el)
    if (!pivot) return
    const horizontal = this.group.direction === 'horizontal'
    const step = this.group.keyboardResizeBy ?? 10
    const layout = this.group.sizes()
    let delta: number | null = null
    switch (event.key) {
      case 'ArrowLeft':
        if (horizontal) delta = -step
        break
      case 'ArrowRight':
        if (horizontal) delta = step
        break
      case 'ArrowUp':
        if (!horizontal) delta = -step
        break
      case 'ArrowDown':
        if (!horizontal) delta = step
        break
      case 'Home':
        delta = -100
        break
      case 'End':
        delta = 100
        break
      case 'Enter': {
        // Toggle the collapsible panel before the handle.
        event.preventDefault()
        const panel = this.group.panels()[pivot[0]]!
        if (!panel.collapsible) return
        if (panel.isCollapsed()) panel.expandPanel()
        else panel.collapsePanel()
        return
      }
    }
    if (delta === null) return
    event.preventDefault()
    this.group.commit(adjustLayoutByDelta(delta, layout, this.group.constraints(), pivot, layout, 'keyboard'))
  }

  ngOnDestroy(): void {
    this.stopDrag?.()
    if (this.hovered()) setGlobalCursor(null)
  }
}
