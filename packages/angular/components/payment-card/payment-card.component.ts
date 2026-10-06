import { Component, ElementRef, Input, booleanAttribute, inject, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'
export type PaymentCardSize = 'sm' | 'md' | 'lg'
export type PaymentCardVariant = 'default' | 'compact'

const SIZE_CLASSES: Record<PaymentCardSize, string> = {
  sm: 'text-xs w-[280px]',
  md: 'max-w-sm text-sm w-[360px]',
  lg: 'max-w-md text-base w-[420px]',
}

interface BrandVisual {
  cardClass: string
  accentGlow: string
  foilSheen: string
  guillocheColor: string
  textColor: string
  subtextColor: string
  embossStyle: string
  chipType: 'gold' | 'silver'
}

const BRAND_VISUALS: Record<CardBrand, BrandVisual> = {
  visa: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#1e3a8a_0%,#0f2252_45%,#08122c_85%,#040a18_100%)] text-white shadow-[0_22px_45px_-12px_rgba(15,34,82,0.65),0_8px_16px_-8px_rgba(0,0,0,0.5)]',
    accentGlow: 'from-blue-400/20 via-indigo-500/10 to-transparent',
    foilSheen: 'from-white/20 via-blue-200/5 to-transparent',
    guillocheColor: 'rgba(96, 165, 250, 0.12)',
    textColor: 'text-white',
    subtextColor: 'text-blue-200/60',
    embossStyle: 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]',
    chipType: 'gold',
  },
  mastercard: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#2a0808_0%,#180608_35%,#0f0506_70%,#09090b_100%)] text-white shadow-[0_22px_45px_-12px_rgba(220,38,38,0.35),0_8px_16px_-8px_rgba(0,0,0,0.6)]',
    accentGlow: 'from-red-500/25 via-amber-500/15 to-transparent',
    foilSheen: 'from-white/20 via-orange-300/10 to-transparent',
    guillocheColor: 'rgba(239, 68, 68, 0.1)',
    textColor: 'text-white',
    subtextColor: 'text-zinc-400',
    embossStyle: 'text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'gold',
  },
  amex: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#1e293b_0%,#0f172a_40%,#090d16_80%,#020617_100%)] text-slate-100 shadow-[0_22px_45px_-12px_rgba(15,23,42,0.7),0_8px_16px_-8px_rgba(0,0,0,0.6)]',
    accentGlow: 'from-slate-300/20 via-teal-500/10 to-transparent',
    foilSheen: 'from-white/25 via-cyan-100/10 to-transparent',
    guillocheColor: 'rgba(148, 163, 184, 0.12)',
    textColor: 'text-slate-100',
    subtextColor: 'text-slate-400',
    embossStyle: 'text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'silver',
  },
  discover: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#431407_0%,#270d04_45%,#1c0903_80%,#0c0401_100%)] text-white shadow-[0_22px_45px_-12px_rgba(194,65,12,0.45),0_8px_16px_-8px_rgba(0,0,0,0.6)]',
    accentGlow: 'from-orange-400/25 via-amber-600/15 to-transparent',
    foilSheen: 'from-white/20 via-amber-200/10 to-transparent',
    guillocheColor: 'rgba(251, 146, 60, 0.12)',
    textColor: 'text-white',
    subtextColor: 'text-amber-200/60',
    embossStyle: 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'gold',
  },
  unknown: {
    cardClass:
      'bg-[radial-gradient(ellipse_at_top_right,#27272a_0%,#18181b_40%,#09090b_85%,#000000_100%)] text-white shadow-[0_22px_45px_-12px_rgba(0,0,0,0.7),0_8px_16px_-8px_rgba(0,0,0,0.5)]',
    accentGlow: 'from-zinc-400/15 via-zinc-600/10 to-transparent',
    foilSheen: 'from-white/18 via-zinc-300/5 to-transparent',
    guillocheColor: 'rgba(255, 255, 255, 0.06)',
    textColor: 'text-white',
    subtextColor: 'text-zinc-400',
    embossStyle: 'text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    chipType: 'silver',
  },
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-payment-card, [ui-payment-card]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"payment-card"',
    '[attr.data-uipkge]': '""',
    '[attr.data-brand]': 'detectedBrand',
    '[attr.data-flipped]': 'isFlipped || undefined',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel',
    '[class]': 'hostClass',
    '(mousemove)': 'onMove($event)',
    '(mouseleave)': 'onLeave()',
  },
  template: `
    <div data-uipkge data-slot="payment-card-inner" [class]="innerClass" [style.transform]="innerTransform">
      <!-- ==================== FRONT FACE ==================== -->
      <div data-uipkge data-slot="payment-card-front" [class]="frontFaceClass">
        <!-- Fine Guilloche pattern -->
        <svg
          class="pointer-events-none absolute inset-0 size-full opacity-60 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 227"
          fill="none"
          aria-hidden="true"
        >
          <g [attr.stroke]="theme.guillocheColor" stroke-width="0.75" stroke-opacity="0.7">
            <path d="M-40 40 C 60 180, 180 -40, 400 120" />
            <path d="M-40 55 C 60 195, 180 -25, 400 135" />
            <path d="M-40 70 C 60 210, 180 -10, 400 150" />
            <path d="M-40 85 C 60 225, 180 5, 400 165" />
            <path d="M-40 100 C 60 240, 180 20, 400 180" />
            <path d="M-40 115 C 60 255, 180 35, 400 195" />
            <circle cx="280" cy="80" r="90" stroke-width="0.5" stroke-dasharray="2 3" />
            <circle cx="280" cy="80" r="60" stroke-width="0.5" stroke-dasharray="1 2" />
          </g>
        </svg>

        <!-- Brushed metallic sheen & specular lighting -->
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent opacity-80"
        ></div>
        <div
          class="pointer-events-none absolute -inset-y-8 -left-1/3 w-1/2 rotate-12 bg-gradient-to-r opacity-70"
          [class]="theme.foilSheen"
        ></div>
        <div
          class="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br blur-2xl"
          [class]="theme.accentGlow"
        ></div>
        <div class="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-black/40 blur-2xl"></div>

        <!-- Outer bevel perimeter ring -->
        <div
          class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
        ></div>

        <!-- Shimmer sweep -->
        @if (shimmer) {
          <div
            class="pointer-events-none absolute -inset-x-full inset-y-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style="animation: payment-card-shimmer 2.5s linear infinite"
          ></div>
        }

        <!-- Content structure -->
        <div [class]="contentClass">
          <!-- TOP ROW: Tier / Brand Logo -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              @if (variant !== 'compact') {
                <span class="font-mono text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
                  {{ tierLabel }}
                </span>
              } @else {
                <span class="font-mono text-xs font-bold tracking-widest text-white/70 uppercase">CARD</span>
              }
            </div>

            <!-- Brand Logo -->
            <div class="flex items-center justify-end" style="perspective: 600px">
              @if (detectedBrand === 'visa') {
                <div class="flex items-center">
                  <svg
                    [class]="variant === 'compact' ? 'h-3 w-auto' : 'h-6 w-auto'"
                    viewBox="0 0 78 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Visa"
                  >
                    <path
                      d="M29.5 23.2H23.9L27.4 1.8H33L29.5 23.2ZM52.4 2.3C51.3 1.9 49.5 1.5 47.3 1.5C41.8 1.5 37.9 4.4 37.8 8.6C37.7 11.7 40.5 13.4 42.6 14.4C44.8 15.5 45.5 16.2 45.5 17.1C45.5 18.6 43.7 19.2 42.1 19.2C39.8 19.2 38.5 18.9 36.8 18.1L36 17.7L35.1 23C36.6 23.7 39.2 24.2 41.8 24.2C47.7 24.2 51.5 21.3 51.6 16.9C51.7 13.4 49.6 11.7 47 10.4C45.2 9.5 44.1 8.9 44.1 8C44.1 7.2 45 6.4 46.8 6.4C48.3 6.4 49.6 6.7 50.8 7.2L51.3 7.5L52.4 2.3ZM67.5 1.8H63.2C61.8 1.8 60.8 2.2 60.2 3.6L51.4 23.2H57.3L58.5 19.9H65.7L66.4 23.2H71.6L67.5 1.8ZM60.1 15.5C60.6 14.2 62.5 8.9 62.5 8.9C62.5 8.9 63 7.6 63.3 6.7L63.8 8.7C63.8 8.7 64.9 14.1 65.2 15.5H60.1ZM18.7 1.8L13.2 16.4L12.6 13.4C11.6 10 8.7 6.3 5.4 4.5L10.3 23.2H16.3L25.1 1.8H18.7ZM8.3 1.8H0.2L0 2.3C6.3 3.9 10.4 7.7 12.1 12.4L10.4 3.7C10.1 2.4 9.3 1.9 8.3 1.8Z"
                      fill="white"
                    />
                    <path
                      d="M12.1 12.4L10.4 3.7C10.1 2.4 9.3 1.9 8.3 1.8H0.2L0 2.3C6.3 3.9 10.4 7.7 12.1 12.4Z"
                      fill="#F9A01B"
                    />
                  </svg>
                </div>
              } @else if (detectedBrand === 'mastercard') {
                <div class="flex items-center gap-1.5">
                  <svg
                    [class]="variant === 'compact' ? 'h-3.5 w-auto' : 'h-7 w-auto'"
                    viewBox="0 0 48 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Mastercard"
                  >
                    <circle cx="15" cy="15" r="15" fill="#EB001B" />
                    <circle cx="33" cy="15" r="15" fill="#F79E1B" fill-opacity="0.92" />
                    <path
                      d="M24 4.5C27.5 7.1 29.8 11.2 29.8 16C29.8 20.8 27.5 24.9 24 27.5C20.5 24.9 18.2 20.8 18.2 16C18.2 11.2 20.5 7.1 24 4.5Z"
                      fill="#FF5F00"
                    />
                  </svg>
                  @if (variant !== 'compact') {
                    <span
                      class="font-mono text-xs font-bold tracking-tight text-white lowercase"
                      style="letter-spacing: -0.05em"
                    >
                      mastercard
                    </span>
                  }
                </div>
              } @else if (detectedBrand === 'amex') {
                <div class="flex items-center">
                  <div [class]="amexClass">AMEX</div>
                </div>
              } @else if (detectedBrand === 'discover') {
                <div class="flex items-center gap-0.5 text-xs font-bold tracking-wider text-white">
                  <span>DISC</span>
                  <span
                    class="inline-block rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-xs"
                    [class]="variant === 'compact' ? 'size-2' : 'size-3.5'"
                  ></span>
                  <span>VER</span>
                </div>
              } @else {
                <div class="flex items-center gap-1 opacity-80">
                  <div class="size-2 rounded-full bg-white/60"></div>
                  <div class="size-2 rounded-full bg-white/30"></div>
                  <span class="font-mono text-xs font-bold tracking-widest text-white/80 uppercase"> PREMIUM </span>
                </div>
              }
            </div>
          </div>

          <!-- MIDDLE ROW: EMV Chip + Contactless Symbol -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Ultra-Realistic Metallic EMV Chip -->
              <div [class]="chipClass">
                <div class="absolute inset-[2px] rounded-[3px] border border-black/25"></div>
                <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/30"></div>
                <div class="absolute inset-y-0 left-1/3 w-px bg-black/30"></div>
                <div class="absolute inset-y-0 right-1/3 w-px bg-black/30"></div>
                <div
                  class="absolute top-1/4 right-1/3 left-1/3 h-1/2 rounded-[2px] border border-black/25 bg-black/10"
                ></div>
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                ></div>
              </div>

              <!-- Contactless NFC Radio Waves -->
              @if (variant !== 'compact') {
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-auto text-white/70 drop-shadow-sm"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="M6.5 8a6 6 0 0 1 0 8" />
                  <path d="M10 6a9.5 9.5 0 0 1 0 12" />
                  <path d="M13.5 4a13 13 0 0 1 0 16" />
                </svg>
              }
            </div>

            <!-- Holographic Security Stamp -->
            @if (variant !== 'compact') {
              <div class="pay-card-holo h-7 w-9 rounded-[4px] opacity-75 shadow-xs"></div>
            }
          </div>

          <!-- CARD NUMBER (Authentic Embossed Raised Digits) -->
          <div [class]="numberContainerClass">
            <span class="sr-only" data-uipkge data-slot="payment-card-number">{{ displayNumber }}</span>
            @for (ch of displayChars; track $index) {
              <!-- Not [class.text-[0.85em]]: Angular can't parse brackets in a class-binding name and
                   emitted the class "text-[0", so placeholder dots rendered full size. -->
              <span
                class="inline-block origin-bottom tabular-nums transition-transform"
                [class]="ch === '•' ? 'text-[0.85em] opacity-50' : ''"
                aria-hidden="true"
                >{{ ch === ' ' ? '\u00a0' : ch }}</span
              >
            }
          </div>

          <!-- BOTTOM ROW: Cardholder Name + Expiry Date -->
          <div class="flex items-end justify-between gap-3">
            <div class="min-w-0 flex-1">
              @if (variant !== 'compact') {
                <div class="text-xs font-semibold tracking-[0.2em] uppercase" [class]="theme.subtextColor">
                  CARDHOLDER NAME
                </div>
              }
              <div data-uipkge data-slot="payment-card-name" [class]="nameClass">
                {{ displayName }}
              </div>
            </div>

            <div class="shrink-0 text-right">
              @if (variant !== 'compact') {
                <div
                  class="flex items-center justify-end gap-1 text-xs font-semibold tracking-wider uppercase"
                  [class]="theme.subtextColor"
                >
                  <span class="text-[6px] leading-tight">GOOD<br />THRU</span>
                  <span>MONTH/YEAR</span>
                </div>
              }
              <div data-uipkge data-slot="payment-card-expiry" [class]="expiryClass">
                {{ displayExpiry }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== BACK FACE ==================== -->
      @if (flip) {
        <div data-uipkge data-slot="payment-card-back" [class]="backFaceClass">
          <div
            class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
          ></div>

          <!-- Magnetic Stripe -->
          <div [class]="magneticStripeClass"></div>

          <div [class]="backContentClass">
            <!-- Signature Panel + CVV Code -->
            <div [class]="signatureRowClass">
              <div
                [class]="signatureStripClass"
                style="background-image: repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 2px, transparent 2px, transparent 6px);"
              >
                @if (variant !== 'compact') {
                  <div class="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    AUTHORIZED SIGNATURE
                  </div>
                }
              </div>

              <div [class]="cvcBoxClass">
                @if (variant !== 'compact') {
                  <span class="text-[6px] font-bold tracking-widest text-slate-400 uppercase">CVV</span>
                }
                <span data-uipkge data-slot="payment-card-cvc" class="leading-none tracking-widest italic">{{
                  displayCvc
                }}</span>
              </div>
            </div>

            <!-- Microtext Disclaimer -->
            @if (variant !== 'compact') {
              <div class="mt-3 space-y-1.5">
                <p class="text-[7.5px] leading-snug text-white/50">
                  This card is property of the issuing bank and must be returned upon request. Use is subject to the
                  cardholder agreement.
                </p>
                <div
                  class="flex items-center justify-between border-t border-white/10 pt-2 text-xs font-medium text-white/60"
                >
                  <span>24/7 Support: 1-800-555-0199</span>
                  <span class="font-mono font-bold tracking-wider text-white/75">CIRRUS · PLUS · STAR</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
    <ng-content />
  `,
  styles: `
    @keyframes payment-card-shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(200%);
      }
    }
  `,
})
export class UiPaymentCardComponent {
  @Input() number = ''
  @Input() name = ''
  @Input() expiry = ''
  @Input() cvc = ''
  @Input() brand: CardBrand | 'auto' = 'auto'
  @Input({ transform: booleanAttribute }) flipped = false
  @Input() variant: PaymentCardVariant = 'default'
  @Input({ transform: booleanAttribute }) tilt = false
  @Input({ transform: booleanAttribute }) shimmer = false
  @Input({ transform: booleanAttribute }) flip = true
  @Input() size: PaymentCardSize = 'md'
  @Input('class') className?: string

  tiltX = 0
  tiltY = 0
  isHovering = false
  private readonly el: ElementRef<HTMLElement> | null = null

  constructor() {
    try {
      this.el = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  onMove(e: MouseEvent): void {
    if (!this.tilt || !this.el) return
    const rect = this.el.nativeElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = (x / rect.width - 0.5) * 2
    const py = (y / rect.height - 0.5) * 2
    this.tiltX = -py * 10
    this.tiltY = px * 12
    this.isHovering = true
  }

  onLeave(): void {
    if (!this.tilt) return
    this.tiltX = 0
    this.tiltY = 0
    this.isHovering = false
  }

  get innerTransform(): string {
    const flipDeg = this.isFlipped ? 180 : 0
    if (this.tilt && this.isHovering) {
      return `perspective(1200px) rotateX(${this.tiltX}deg) rotateY(${this.tiltY + flipDeg}deg) scale3d(1.02, 1.02, 1.02)`
    }
    return `perspective(1200px) rotateY(${flipDeg}deg)`
  }

  get detectedBrand(): CardBrand {
    if (this.brand && this.brand !== 'auto') return this.brand
    return UiPaymentCardComponent.detectBrand(this.number)
  }

  static detectBrand(raw: string): CardBrand {
    const n = (raw ?? '').replace(/\D/g, '')
    if (!n) return 'unknown'
    if (/^4/.test(n)) return 'visa'
    if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
    if (/^3[47]/.test(n)) return 'amex'
    if (/^(6011|65|64[4-9])/.test(n)) return 'discover'
    return 'unknown'
  }

  get displayNumber(): string {
    return UiPaymentCardComponent.formatMasked(this.number, this.detectedBrand)
  }

  static formatMasked(raw: string, brand: CardBrand): string {
    const digits = (raw ?? '').replace(/\D/g, '').slice(0, brand === 'amex' ? 15 : 16)
    const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4]
    const total = groups.reduce((a, b) => a + b, 0)
    const padded = (digits + '••••••••••••••••').slice(0, total)
    let i = 0
    return groups
      .map((g) => {
        const slice = padded.slice(i, i + g)
        i += g
        return slice
      })
      .join(' ')
  }

  get displayChars(): string[] {
    return this.displayNumber.split('')
  }

  get displayName(): string {
    return (this.name.trim() || 'CARDHOLDER NAME').toUpperCase()
  }

  get displayExpiry(): string {
    const raw = (this.expiry ?? '').replace(/\D/g, '').slice(0, 4)
    if (!raw) return 'MM/YY'
    if (raw.length <= 2) return `${raw}/YY`
    return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`
  }

  get displayCvc(): string {
    const max = this.detectedBrand === 'amex' ? 4 : 3
    const digits = (this.cvc ?? '').replace(/\D/g, '').slice(0, max)
    return digits || '•••'
  }

  get isFlipped(): boolean {
    return this.flipped
  }

  get theme(): BrandVisual {
    return BRAND_VISUALS[this.detectedBrand]
  }

  get tierLabel(): string {
    if (this.detectedBrand === 'amex') return 'PLATINUM'
    if (this.detectedBrand === 'mastercard') return 'WORLD ELITE'
    return 'SIGNATURE'
  }

  get hostClass(): string {
    return cn(
      'group relative inline-block select-none [perspective:1200px]',
      SIZE_CLASSES[this.size],
      this.variant === 'compact' && 'w-[120px] max-w-56',
      this.className,
    )
  }

  get innerClass(): string {
    return cn(
      'relative aspect-[85.6/53.98] w-full transition-transform [transform-style:preserve-3d]',
      this.flip ? 'duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : 'duration-300',
      this.isFlipped && '[transform:rotateY(180deg)]',
    )
  }

  get faceClass(): string {
    return cn(
      'absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl p-5',
      this.shimmer && 'payment-card-shimmer',
      this.tilt && 'payment-card-tilt',
    )
  }

  get frontFaceClass(): string {
    return cn(
      'pay-card-face absolute inset-0 overflow-hidden rounded-[16px] border border-white/15 [backface-visibility:hidden]',
      this.theme.cardClass,
    )
  }

  get backFaceClass(): string {
    return cn(
      'pay-card-face absolute inset-0 [transform:rotateY(180deg)] overflow-hidden rounded-[16px] border border-white/15 [backface-visibility:hidden]',
      this.theme.cardClass,
    )
  }

  get contentClass(): string {
    return cn('absolute inset-0 flex flex-col justify-between', this.variant === 'compact' ? 'p-2' : 'p-5')
  }

  get amexClass(): string {
    return cn(
      'flex items-center justify-center rounded-sm bg-[#006fcf] font-sans font-bold tracking-tighter text-white shadow-xs',
      this.variant === 'compact' ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-xs',
    )
  }

  get chipClass(): string {
    return cn(
      'relative overflow-hidden rounded-[5px] border border-amber-950/40 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.6)]',
      this.theme.chipType === 'silver'
        ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400'
        : 'bg-gradient-to-br from-[#ffe082] via-[#ffb300] to-[#ff8f00]',
      this.variant === 'compact' ? 'h-3.5 w-5' : 'h-8 w-11',
    )
  }

  get numberContainerClass(): string {
    return cn(
      'flex flex-nowrap items-center font-mono font-bold tracking-[0.18em] tabular-nums',
      this.theme.embossStyle,
      this.variant === 'compact' ? 'my-0.5 text-xs' : 'my-1 text-base sm:text-lg',
    )
  }

  get nameClass(): string {
    return cn(
      'truncate font-semibold tracking-wider uppercase',
      this.theme.embossStyle,
      this.variant === 'compact' ? 'text-xs' : 'text-xs',
    )
  }

  get expiryClass(): string {
    return cn(
      'font-mono font-semibold tracking-wider whitespace-nowrap',
      this.theme.embossStyle,
      this.variant === 'compact' ? 'text-xs' : 'text-xs',
    )
  }

  get magneticStripeClass(): string {
    return cn(
      'w-full bg-gradient-to-b from-neutral-950 via-black to-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.8)]',
      this.variant === 'compact' ? 'mt-2 h-4' : 'mt-4 h-10',
    )
  }

  get backContentClass(): string {
    return cn('relative flex flex-col justify-between', this.variant === 'compact' ? 'p-2' : 'p-4')
  }

  get signatureRowClass(): string {
    return cn('flex items-stretch gap-2', this.variant === 'compact' ? 'mt-1' : 'mt-2')
  }

  get signatureStripClass(): string {
    return cn(
      'relative flex-1 overflow-hidden rounded-[3px] border border-slate-300/80 bg-white/95 px-2 py-1',
      this.variant === 'compact' ? 'h-4' : 'h-8',
    )
  }

  get cvcBoxClass(): string {
    return cn(
      'flex flex-col items-center justify-center rounded-[3px] border border-slate-300 bg-white font-mono font-bold text-slate-950 shadow-inner',
      this.variant === 'compact' ? 'px-1 text-xs' : 'px-3 text-xs',
    )
  }

  get ariaLabel(): string {
    const brand = this.detectedBrand === 'unknown' ? 'Card' : this.detectedBrand
    const last4 = this.displayNumber.replace(/[•\s]/g, '').slice(-4) || '••••'
    return `${brand} ending ${last4}, ${this.displayName}, expires ${this.displayExpiry}`
  }
}
