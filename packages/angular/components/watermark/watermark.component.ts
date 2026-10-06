import {
  type AfterViewInit,
  Component,
  ElementRef,
  Input,
  type OnDestroy,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

/** Build the tiled SVG data URL (same math as React `Watermark`). Empty when there is nothing to draw. */
export function buildWatermarkUrl(opts: {
  width: number
  height: number
  content: string
  image?: string
  rotate: number
  gap: number
  opacity: number
  fontSize: number
  color: string
  fontFamily: string
  fontWeight: number | string
}): string {
  const { width, height, content, image, rotate, gap, opacity, fontSize, color, fontFamily, fontWeight } = opts
  if (!width || !height) return ''
  const text = content || ''

  if (image) {
    const tile = gap + 100
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">
  <image href="${image}" x="${gap / 2}" y="${gap / 2}" width="100" height="100" opacity="${opacity}" transform="rotate(${rotate} ${tile / 2} ${tile / 2})"/>
</svg>`
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  }

  if (!text) return ''

  const textWidth = text.length * fontSize * 0.6
  const tileW = gap + textWidth
  const tileH = gap + fontSize * 1.5

  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 ${tileW} ${tileH}">
  <text x="${gap / 2}" y="${gap / 2 + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" fill="${color}" opacity="${opacity}" transform="rotate(${rotate} ${gap / 2} ${gap / 2 + fontSize / 2})">${escapedText}</text>
</svg>`
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

/**
 * Angular port of UIPKGE Watermark (React `Watermark`). Projects its content and lays an
 * aria-hidden overlay on top whose background is a tiled SVG of the text (or image),
 * rotated by `rotate`. The overlay is sized from a ResizeObserver on the host, is
 * pointer-events-none unless `interactive`, and sits at `zIndex`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-watermark, [ui-watermark]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"watermark"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    <ng-content />
    <div
      data-uipkge=""
      data-slot="watermark-overlay"
      class="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      [style.background-image]="url ? 'url(&quot;' + url + '&quot;)' : null"
      [style.background-repeat]="'repeat'"
      [style.z-index]="zIndex"
      [style.pointer-events]="interactive ? 'auto' : 'none'"
    ></div>
  `,
})
export class UiWatermarkComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private ro: ResizeObserver | null = null
  /** Host size (signal so ResizeObserver updates render in zoneless apps). */
  readonly size = signal({ width: 0, height: 0 })

  /** Text content for the watermark. Ignored when `image` is set. */
  @Input() content = ''
  /** Image URL. When set, repeats the image instead of text. */
  @Input() image?: string
  @Input() rotate = -22
  @Input() gap = 100
  @Input() opacity = 0.08
  @Input() fontSize = 16
  @Input() color = 'currentColor'
  @Input() fontFamily = 'sans-serif'
  @Input() fontWeight: number | string = 'normal'
  @Input() zIndex = 9
  /** When true, the overlay captures pointer events (blocks interaction). */
  @Input({ transform: booleanAttribute }) interactive = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block relative', this.className)
  }

  get url(): string {
    const { width, height } = this.size()
    return buildWatermarkUrl({
      width,
      height,
      content: this.content,
      image: this.image,
      rotate: this.rotate,
      gap: this.gap,
      opacity: this.opacity,
      fontSize: this.fontSize,
      color: this.color,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
    })
  }

  measure(): void {
    const rect = this.el.getBoundingClientRect()
    this.size.set({ width: rect.width, height: rect.height })
  }

  ngAfterViewInit(): void {
    this.measure()
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.measure())
      this.ro.observe(this.el)
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
  }
}
