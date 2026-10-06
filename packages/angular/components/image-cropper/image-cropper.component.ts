import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  booleanAttribute,
  effect,
  numberAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

function coverScale(vw: number, vh: number, nw: number, nh: number): number {
  if (!nw || !nh) return 1
  return Math.max(vw / nw, vh / nh)
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

interface Point {
  x: number
  y: number
}

/**
 * Angular port of the React ImageCropper: the image covers a fixed-aspect viewport and is
 * panned by dragging (pointer capture) or Arrow keys (8px), zoomed by the wheel, + / - keys
 * or the optional range; panning is clamped so the image always covers the viewport.
 * `zoom` / `defaultZoom` / `zoomChange` (`[(zoom)]`). React's imperative handle is the
 * component's public API: `getCroppedCanvas()` / `getCroppedBlob(type, quality)` (grab the
 * component with a template ref or viewChild).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-image-cropper, [ui-image-cropper]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'image-cropper',
    '[class]': 'hostClass',
  },
  template: `
    <div
      #viewport
      data-slot="image-cropper-viewport"
      role="application"
      aria-label="Image crop viewport"
      tabindex="0"
      [attr.data-disabled]="disabled ? '' : null"
      [class]="viewportClass"
      [style.aspect-ratio]="aspectRatioValue"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (wheel)="onWheel($event)"
      (keydown)="onKeyDown($event)"
    >
      <img
        #img
        data-slot="image-cropper-image"
        [src]="src"
        [alt]="alt"
        draggable="false"
        class="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
        [style.width]="imgStyle.width"
        [style.height]="imgStyle.height"
        [style.transform]="imgStyle.transform"
        (load)="onImageLoad()"
      />
    </div>
    @if (showZoom) {
      <label data-slot="image-cropper-zoom" class="text-muted-foreground flex items-center gap-3 text-xs">
        <span class="w-10">Zoom</span>
        <input
          type="range"
          [min]="minZoom"
          [max]="maxZoom"
          step="0.05"
          [value]="currentZoom"
          class="accent-primary h-1.5 w-full cursor-pointer"
          aria-label="Zoom"
          (input)="setZoom(+$any($event.target).value)"
        />
        <span class="w-10 tabular-nums">{{ currentZoom.toFixed(1) }}×</span>
      </label>
    }
  `,
})
export class UiImageCropperComponent {
  private readonly _zoom = signal<number | undefined>(undefined)
  private readonly _uncontrolledZoom = signal<number | null>(null)
  private readonly pan = signal<Point>({ x: 0, y: 0 })
  private readonly natural = signal({ w: 0, h: 0 })
  private dragging = false
  private lastPointer: Point = { x: 0, y: 0 }

  @Input({ required: true }) src!: string
  @Input() alt = ''
  @Input({ transform: numberAttribute }) aspectRatio = 1
  /** Controlled zoom. */
  @Input()
  set zoom(v: number | null | undefined) {
    this._zoom.set(v ?? undefined)
  }
  get zoom(): number | undefined {
    return this._zoom()
  }
  /** Uncontrolled initial zoom. */
  @Input({ transform: numberAttribute }) defaultZoom = 1
  @Output() zoomChange = new EventEmitter<number>()
  @Input({ transform: numberAttribute }) minZoom = 1
  @Input({ transform: numberAttribute }) maxZoom = 4
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) showZoom = false
  @Input() rounded: 'lg' | 'full' = 'lg'
  @Input('class') className?: string

  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLDivElement>
  @ViewChild('img', { static: true }) imgRef!: ElementRef<HTMLImageElement>

  constructor() {
    // React: re-clamp the pan whenever the zoom (or the loaded image) changes.
    effect(() => {
      void this.currentZoom
      this.natural()
      const p = this.pan()
      const next = this.clampPan(p)
      if (next.x !== p.x || next.y !== p.y) this.pan.set(next)
    })
  }

  get currentZoom(): number {
    return this._zoom() ?? this._uncontrolledZoom() ?? this.defaultZoom
  }

  get aspectRatioValue(): string {
    return String(this.aspectRatio)
  }

  get hostClass(): string {
    return cn('flex w-full max-w-md flex-col gap-3', this.className)
  }

  get viewportClass(): string {
    return cn(
      'bg-muted relative w-full overflow-hidden select-none',
      this.rounded === 'full' ? 'rounded-full' : 'rounded-lg',
      this.disabled ? 'pointer-events-none opacity-60' : 'cursor-grab active:cursor-grabbing',
    )
  }

  get imgStyle(): { width: string | null; height: string | null; transform: string } {
    const el = this.viewportRef?.nativeElement
    const { w, h } = this.natural()
    if (!el || !w) return { width: null, height: null, transform: 'translate(-50%, -50%)' }
    const scale = coverScale(el.clientWidth, el.clientHeight, w, h) * this.currentZoom
    const { x, y } = this.pan()
    return {
      width: `${w * scale}px`,
      height: `${h * scale}px`,
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    }
  }

  setZoom(value: number): void {
    const next = clamp(value, this.minZoom, this.maxZoom)
    this.zoomChange.emit(next)
    if (this._zoom() === undefined) this._uncontrolledZoom.set(next)
  }

  private clampPan(next: Point): Point {
    const el = this.viewportRef?.nativeElement
    const { w, h } = this.natural()
    if (!el || !w) return next
    const vw = el.clientWidth
    const vh = el.clientHeight
    const scale = coverScale(vw, vh, w, h) * this.currentZoom
    const maxX = Math.abs(vw - w * scale) / 2
    const maxY = Math.abs(vh - h * scale) / 2
    return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) }
  }

  onImageLoad(): void {
    const img = this.imgRef.nativeElement
    this.natural.set({ w: img.naturalWidth, h: img.naturalHeight })
    this.pan.set({ x: 0, y: 0 })
  }

  onPointerDown(e: PointerEvent): void {
    if (this.disabled) return
    this.dragging = true
    this.lastPointer = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging) return
    const p = this.pan()
    const next = { x: p.x + (e.clientX - this.lastPointer.x), y: p.y + (e.clientY - this.lastPointer.y) }
    this.lastPointer = { x: e.clientX, y: e.clientY }
    this.pan.set(this.clampPan(next))
  }

  onPointerUp(e: PointerEvent): void {
    this.dragging = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  onWheel(e: WheelEvent): void {
    if (this.disabled) return
    e.preventDefault()
    this.setZoom(this.currentZoom + (e.deltaY > 0 ? -0.12 : 0.12))
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return
    const step = 8
    const p = this.pan()
    if (e.key === 'ArrowLeft') this.pan.set(this.clampPan({ ...p, x: p.x - step }))
    if (e.key === 'ArrowRight') this.pan.set(this.clampPan({ ...p, x: p.x + step }))
    if (e.key === 'ArrowUp') this.pan.set(this.clampPan({ ...p, y: p.y - step }))
    if (e.key === 'ArrowDown') this.pan.set(this.clampPan({ ...p, y: p.y + step }))
    if (e.key === '+' || e.key === '=') this.setZoom(this.currentZoom + 0.2)
    if (e.key === '-' || e.key === '_') this.setZoom(this.currentZoom - 0.2)
  }

  /** The visible crop as a canvas at the source image's resolution (null before the image loads). */
  getCroppedCanvas(): HTMLCanvasElement | null {
    const el = this.viewportRef?.nativeElement
    const img = this.imgRef?.nativeElement
    const { w, h } = this.natural()
    if (!el || !img || !w) return null
    const vw = el.clientWidth
    const vh = el.clientHeight
    const scale = coverScale(vw, vh, w, h) * this.currentZoom
    const { x, y } = this.pan()
    const left = (vw - w * scale) / 2 + x
    const top = (vh - h * scale) / 2 + y
    const sw = vw / scale
    const sh = vh / scale
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sw))
    canvas.height = Math.max(1, Math.round(sh))
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, -left / scale, -top / scale, sw, sh, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  /** The visible crop encoded as a Blob (null before the image loads). */
  getCroppedBlob(type = 'image/png', quality?: number): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = this.getCroppedCanvas()
      if (!canvas) {
        resolve(null)
        return
      }
      canvas.toBlob((blob) => resolve(blob), type, quality)
    })
  }
}
