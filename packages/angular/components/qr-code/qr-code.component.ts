import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  type OnChanges,
  type OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  effect,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- qrcode ships no types unless @types/qrcode (a devDependency) is installed; @ts-ignore stays valid either way
import QRCodeLib from 'qrcode'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export type QRCodeType = 'canvas' | 'svg'
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'
export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

/**
 * Angular port of UIPKGE QrCode (React `QrCode`). Generates the code with the `qrcode`
 * package (PNG data URL for `type="canvas"`, inline SVG for `type="svg"`) whenever the
 * value / size / colors / level / margin / status change, overlays an optional centre
 * icon, shows expired / scanned / loading overlays (expired offers Refresh when
 * `(refresh)` is bound, like React's `onRefresh`), and renders a Download link for active
 * canvas codes. `extra` (a TemplateRef, React's `extra` node) replaces the Download link.
 * Colors are hex because `qrcode` cannot resolve CSS variables.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-qr-code, [ui-qr-code]',
  standalone: true,
  imports: [UiRenderTemplateDirective],
  host: {
    '[attr.data-slot]': '"qr-code"',
    '[attr.data-uipkge]': '""',
    '[attr.aria-busy]': 'status === "loading" ? true : null',
    '[class]': 'hostClass',
  },
  template: `
    <div
      class="relative inline-flex items-center justify-center overflow-hidden"
      [style.width.px]="size"
      [style.height.px]="size"
    >
      @if (type === 'svg' && qrSvg()) {
        <div #svgHost class="size-full"></div>
      } @else if (qrDataUrl()) {
        <img [src]="qrDataUrl()" [alt]="'QR Code for ' + value" class="size-full" />
      }

      @if (icon && status === 'active') {
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="bg-background overflow-hidden rounded-md shadow-sm"
            [style.width.px]="iconDimensions.width"
            [style.height.px]="iconDimensions.height"
          >
            <img [src]="icon" alt="" class="size-full object-cover" />
          </div>
        </div>
      }

      @if (status !== 'active') {
        <div class="bg-background/90 absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
          @switch (status) {
            @case ('expired') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-rotate-ccw size-8"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            }
            @case ('scanned') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-check size-8"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            }
            @case ('loading') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-loader-circle size-8 animate-spin"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            }
          }
          <span class="text-foreground text-sm font-medium">{{ statusText }}</span>
          @if (status === 'expired' && refresh.observed) {
            <button
              type="button"
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
              (click)="refresh.emit()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-scan-line size-3"
                aria-hidden="true"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M7 12h10" />
              </svg>
              Refresh
            </button>
          }
        </div>
      }
    </div>

    @if (extra) {
      <ng-container [uiRenderTemplate]="extra" />
    } @else if (type === 'canvas' && status === 'active' && qrDataUrl()) {
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
        (click)="download()"
      >
        Download
      </button>
    }
  `,
})
export class UiQRCodeComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) value = ''
  @Input() type: QRCodeType = 'canvas'
  @Input() size = 160
  @Input() color = '#000000'
  @Input() bgColor = '#ffffff'
  @Input() icon?: string
  @Input() iconSize?: number | { width: number; height: number }
  @Input() errorLevel: QRCodeErrorLevel = 'M'
  @Input({ transform: booleanAttribute }) bordered = true
  @Input() status: QRCodeStatus = 'active'
  @Input() marginSize = 0
  @Input('class') className?: string
  /** Replaces the default Download link (React `extra`). */
  @Input() extra?: TemplateRef<unknown>
  /** Fired by the expired overlay's Refresh button; the button only shows when this is bound. */
  @Output() refresh = new EventEmitter<void>()

  @ViewChild('svgHost') set svgHost(ref: ElementRef<HTMLElement> | undefined) {
    this._svgHost.set(ref?.nativeElement)
  }

  /** Signals: generation resolves asynchronously, so zoneless apps need them to repaint. */
  readonly qrDataUrl = signal('')
  readonly qrSvg = signal('')
  private readonly _svgHost = signal<HTMLElement | undefined>(undefined)
  private run = 0

  constructor() {
    // Write the generated SVG markup directly (bypasses Angular's HTML sanitizer, which strips SVG).
    effect(() => {
      const host = this._svgHost()
      if (host) host.innerHTML = this.qrSvg()
    })
  }

  get iconDimensions(): { width: number; height: number } {
    if (typeof this.iconSize === 'number') return { width: this.iconSize, height: this.iconSize }
    return this.iconSize ?? { width: 40, height: 40 }
  }

  get statusText(): string {
    return this.status === 'expired' ? 'Expired' : this.status === 'scanned' ? 'Scanned' : 'Loading...'
  }

  get hostClass(): string {
    return cn(
      'inline-flex flex-col items-center gap-2',
      this.bordered && 'bg-background rounded-lg border p-4',
      this.className,
    )
  }

  ngOnChanges(): void {
    void this.generate()
  }

  ngOnDestroy(): void {
    this.run++
  }

  private async generate(): Promise<void> {
    const run = ++this.run
    if (!this.value || this.status === 'loading') return
    try {
      const options = {
        width: this.size,
        margin: this.marginSize,
        color: { dark: this.color, light: this.bgColor },
        errorCorrectionLevel: this.errorLevel,
      }
      if (this.type === 'svg') {
        const svg: string = await QRCodeLib.toString(this.value, { type: 'svg', ...options })
        if (run === this.run) this.qrSvg.set(svg)
      } else {
        const url: string = await QRCodeLib.toDataURL(this.value, options)
        if (run === this.run) this.qrDataUrl.set(url)
      }
    } catch (e) {
      console.error('QR Code generation failed:', e)
    }
  }

  download(): void {
    const link = document.createElement('a')
    link.download = `qrcode-${this.value.slice(0, 20)}.png`
    link.href = this.qrDataUrl()
    link.click()
  }
}
