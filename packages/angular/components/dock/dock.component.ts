import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  booleanAttribute,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { NgTemplateOutlet } from '@angular/common'
import { cn } from '@/lib/utils'

export interface DockItem {
  id: string
  label: string
  icon?: string | TemplateRef<unknown> | any
  handler?: () => void
  active?: boolean
}

/**
 * Angular port of UIPKGE Dock. macOS-style dock menu with cosine-bell
 * magnification. Class strings mirror the React and Vue source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dock, [ui-dock]',
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    '[attr.data-slot]': '"dock"',
    '[attr.data-uipkge]': '""',
    '[attr.data-orientation]': 'orientation',
    '[class]': 'hostClass',
    '(mousemove)': 'onMove($event)',
    '(mouseleave)': 'onLeave()',
  },
  template: `
    @for (item of items; track item.id; let i = $index) {
      <div
        data-slot="dock-item"
        [attr.data-active]="item.active ? '' : null"
        role="button"
        tabindex="0"
        [attr.aria-label]="item.label"
        [attr.aria-current]="item.active ? 'true' : null"
        class="group focus-visible:ring-ring/50 relative flex shrink-0 cursor-pointer items-end justify-center rounded-xl outline-none focus-visible:ring-[3px]"
        (mouseenter)="hoveredId = item.id"
        (mouseleave)="hoveredId = null"
        (click)="onSelect(item)"
        (keydown.enter)="onSelect(item)"
        (keydown.space)="$event.preventDefault(); onSelect(item)"
      >
        <!-- Tooltip -->
        @if (showTooltips && hoveredId === item.id) {
          <span
            class="border-border bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md"
          >
            {{ item.label }}
          </span>
        }

        <!-- Icon tile -->
        <span
          class="flex items-center justify-center rounded-xl border transition-[width,height] duration-100 ease-out will-change-[width,height]"
          [class]="
            item.active
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border/50 bg-muted/40 text-foreground hover:bg-muted'
          "
          [style.width.px]="sizeFor(i)"
          [style.height.px]="sizeFor(i)"
        >
          @if (isSvg(item.icon)) {
            <span
              class="flex items-center justify-center [&>svg,&>lucide-icon>svg]:size-full"
              [style.width.px]="sizeFor(i) * 0.5"
              [style.height.px]="sizeFor(i) * 0.5"
              [innerHTML]="sanitize(item.icon)"
            ></span>
          } @else if (isTemplate(item.icon)) {
            <ng-container [ngTemplateOutlet]="item.icon" />
          } @else {
            <span [style.fontSize.px]="sizeFor(i) * 0.4">{{ item.icon ?? '●' }}</span>
          }
        </span>

        <!-- Active indicator dot -->
        @if (item.active) {
          <span
            data-slot="dock-indicator"
            class="bg-primary absolute -bottom-2 size-1 rounded-full"
            aria-hidden="true"
          ></span>
        }
      </div>
    }
  `,
})
export class UiDockComponent {
  @Input() items: DockItem[] = []
  @Input() baseSize = 48
  @Input() magnification = 1.6
  @Input() distance = 120
  /** Orientation. Only 'horizontal' (bottom dock) is supported, like React/Vue. */
  @Input() orientation: 'horizontal' = 'horizontal'
  @Input({ transform: booleanAttribute }) showTooltips = true
  @Input('class') set classAttr(v: string | undefined) {
    this._class = v
  }
  @Input() set className(v: string | undefined) {
    this._class = v
  }
  get className(): string | undefined {
    return this._class
  }
  @Output() select = new EventEmitter<DockItem>()

  hoveredId: string | null = null
  mouseX: number | null = null

  private _class?: string
  private sanitizedCache = new Map<string, SafeHtml>()
  private readonly sanitizer: DomSanitizer | null = null
  private readonly el: ElementRef<HTMLElement> | null = null

  constructor() {
    try {
      this.sanitizer = inject(DomSanitizer, { optional: true })
    } catch {}
    try {
      this.el = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  get hostClass(): string {
    return cn(
      'border-border/60 bg-background/60 flex items-end justify-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-md',
      this._class,
    )
  }

  onMove(event: MouseEvent): void {
    this.mouseX = event.clientX
  }

  onLeave(): void {
    this.mouseX = null
    this.hoveredId = null
  }

  sizeFor(index: number): number {
    if (this.mouseX === null) return this.baseSize
    let center: number
    const root = this.el?.nativeElement
    const itemEl = root?.querySelectorAll<HTMLElement>('[data-slot="dock-item"]')?.[index]
    if (itemEl) {
      const rect = itemEl.getBoundingClientRect()
      center = rect.left + rect.width / 2
    } else {
      center = index * (this.baseSize + 8) + this.baseSize / 2
    }
    const dist = Math.abs(this.mouseX - center)
    if (dist > this.distance) return this.baseSize
    const t = 1 - dist / this.distance
    const scale = 1 + (this.magnification - 1) * t
    return this.baseSize * scale
  }

  onSelect(item: DockItem): void {
    item.handler?.()
    this.select.emit(item)
  }

  isSvg(val: unknown): boolean {
    return typeof val === 'string' && val.includes('<svg')
  }

  isTemplate(val: unknown): boolean {
    return val instanceof TemplateRef
  }

  sanitize(svg: string): SafeHtml | string {
    if (!this.sanitizer) return svg
    let safe = this.sanitizedCache.get(svg)
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustHtml(svg)
      this.sanitizedCache.set(svg, safe)
    }
    return safe
  }
}
